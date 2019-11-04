package org.jboss.windup.web.services.rest;

import org.jboss.resteasy.plugins.providers.multipart.MultipartFormDataInput;
import org.jboss.windup.web.addons.websupport.WebPathUtil;
import org.jboss.windup.web.furnaceserviceprovider.FromFurnace;
import org.jboss.windup.web.services.model.*;
import org.jboss.windup.web.services.model.LabelsPath.LabelsPathType;
import org.jboss.windup.web.services.service.ConfigurationService;
import org.jboss.windup.web.services.service.FileUploadService;

import javax.ejb.Stateless;
import javax.inject.Inject;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Root;
import javax.ws.rs.NotFoundException;
import java.io.File;
import java.nio.file.Path;
import java.util.List;

/**
 * @author <a href="mailto:carlosthe19916@gmail.com">Carlos Feria</a>
 */
@Stateless
public class LabelEndpointImpl implements LabelEndpoint
{
    @PersistenceContext
    private EntityManager entityManager;

    @Inject
    @FromFurnace
    private WebPathUtil webPathUtil;

    @Inject
    private FileUploadService fileUploadService;

    @Inject
    private ConfigurationService configurationService;

    @Override
    public List<LabelProviderEntity> getAllProviders()
    {
        return entityManager.createNamedQuery(LabelProviderEntity.FIND_ALL).getResultList();
    }

    @Override
    public List<LabelProviderEntity> getByLabelsPath(Long labelsPathID)
    {
        LabelsPath labelsPath = getLabelsPath(labelsPathID);
        CriteriaBuilder builder = entityManager.getCriteriaBuilder();
        CriteriaQuery<LabelProviderEntity> criteriaQuery = builder.createQuery(LabelProviderEntity.class);
        Root<LabelProviderEntity> root = criteriaQuery.from(LabelProviderEntity.class);
        criteriaQuery.where(builder.equal(root.get(LabelProviderEntity_.labelsPath), labelsPath));

        return entityManager.createQuery(criteriaQuery).getResultList();
    }

    private LabelsPath getLabelsPath(Long labelsPathID)
    {
        LabelsPath labelsPath = entityManager.find(LabelsPath.class, labelsPathID);

        if (labelsPath == null)
        {
            throw new NotFoundException("LabelsPath with id " + labelsPathID + " not found");
        }

        return labelsPath;
    }

    @Override
    public LabelsPath uploadLabelProvider(MultipartFormDataInput data)
    {
        Configuration configuration = this.configurationService.getGlobalConfiguration();
        return uploadLabelProviderToConfiguration(data, configuration, null);
    }

    @Override
    public LabelsPath uploadLabelProviderByProject(Long projectId, MultipartFormDataInput data) {
        Configuration configuration = this.configurationService.getConfigurationByProjectId(projectId);
        MigrationProject migrationProject = configuration.getMigrationProject();
        return uploadLabelProviderToConfiguration(data, configuration, migrationProject.getId());
    }

    private LabelsPath uploadLabelProviderToConfiguration(MultipartFormDataInput data, Configuration configuration, Long projectId)
    {
        String fileName = this.fileUploadService.getFileName(data);
        Path customLabelsPath = this.webPathUtil.getCustomLabelsPath();

        // Save file to custom project folder
        if (projectId != null) {
            customLabelsPath = this.webPathUtil.getCustomLabelsPath(projectId.toString());
        }

        File file = this.fileUploadService.uploadFile(data, customLabelsPath, fileName, true);

        LabelsPath.LabelsScopeType scopeType = configuration.isGlobal() ? LabelsPath.LabelsScopeType.GLOBAL : LabelsPath.LabelsScopeType.PROJECT;
        LabelsPath labelsPathEntity = new LabelsPath(file.getPath(), LabelsPathType.USER_PROVIDED, scopeType, RegistrationType.UPLOADED);
        String relativePath = customLabelsPath.relativize(file.toPath()).toString();
        labelsPathEntity.setShortPath(relativePath);

        this.entityManager.persist(labelsPathEntity);

        configuration.getLabelsPaths().add(labelsPathEntity);
        this.configurationService.saveConfiguration(configuration);

        return labelsPathEntity;
    }

    @Override
    public void deleteLabelProvider(Long labelsPathID)
    {
        LabelsPath labelsPath = this.getLabelsPath(labelsPathID);

        if (labelsPath.getRegistrationType() == RegistrationType.UPLOADED)
        {
            String path = labelsPath.getPath();
            File file = new File(path);
            file.delete();
        }

        Configuration configuration = (Configuration) entityManager.createNamedQuery(Configuration.FIND_BY_LABEL_PATH_ID)
                .setParameter("labelPathId", labelsPath.getId())
                .getSingleResult();

        configuration.getLabelsPaths().remove(labelsPath);
        this.entityManager.merge(configuration);

        // Remove rulePath from all AnalysisContexts
        @SuppressWarnings("unchecked")
        List<AnalysisContext> analysisContexts = entityManager.createNamedQuery(AnalysisContext.FIND_BY_LABEL_PATH_ID_AND_EXECUTION_IS_NULL)
                .setParameter("labelPathId", labelsPath.getId())
                .getResultList();
        analysisContexts.forEach(analysisContext -> {
            analysisContext.getLabelsPaths().remove(labelsPath);
            this.entityManager.merge(analysisContext);
        });

        this.entityManager.createNamedQuery(LabelProviderEntity.DELETE_BY_LABELS_PATH)
                .setParameter(LabelProviderEntity.LABELS_PATH_PARAM, labelsPath)
                .executeUpdate();

        this.entityManager.remove(labelsPath);
    }

    @Override
    public Boolean isLabelsPathUsed(Long labelsPathID)
    {
        LabelsPath labelsPath = this.getLabelsPath(labelsPathID);
        if (labelsPath.getLabelsPathType() == LabelsPathType.SYSTEM_PROVIDED)
            return false;

        // Using ordinal() instead of toString() because WindupExecution.status is using ordinal value
        String queryStr = "SELECT count(*) > 0 FROM ANALYSISCONTEXT_LABELSPATH ACRP \n" +
                "INNER JOIN ANALYSISCONTEXT AC ON ACRP.ANALYSISCONTEXT_ID = AC.ID \n" +
                "INNER JOIN WINDUPEXECUTION WE ON AC.ID = WE.ANALYSISCONTEXT_ID \n" +
                "where (WE.STATUS = "+ ExecutionState.QUEUED.ordinal() + " OR WE.STATUS = " + ExecutionState.STARTED.ordinal() + ") \n" +
                "AND LABELSPATHS_LABELS_PATH_ID=:id";
        Boolean test = (Boolean) this.entityManager.createNativeQuery(queryStr).
                    setParameter("id", labelsPath.getId()).
                    getSingleResult();
        return test;
    }
    
}
