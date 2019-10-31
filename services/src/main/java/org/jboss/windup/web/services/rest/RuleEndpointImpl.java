package org.jboss.windup.web.services.rest;

import java.io.File;
import java.nio.file.Path;
import java.util.List;

import javax.ejb.Stateless;
import javax.inject.Inject;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Root;
import javax.ws.rs.NotFoundException;

import org.jboss.resteasy.plugins.providers.multipart.MultipartFormDataInput;
import org.jboss.windup.web.addons.websupport.WebPathUtil;
import org.jboss.windup.web.furnaceserviceprovider.FromFurnace;
import org.jboss.windup.web.services.model.*;
import org.jboss.windup.web.services.service.ConfigurationService;
import org.jboss.windup.web.services.service.FileUploadService;

/**
 * @author <a href="mailto:jesse.sightler@gmail.com">Jesse Sightler</a>
 */
@Stateless
public class RuleEndpointImpl implements RuleEndpoint
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
    public List<RuleProviderEntity> getAllProviders()
    {
        return entityManager.createNamedQuery(RuleProviderEntity.FIND_ALL).getResultList();
    }

    @Override
    public List<RuleProviderEntity> getByRulesPath(Long rulesPathID)
    {
        RulesPath rulesPath = getRulesPath(rulesPathID);
        CriteriaBuilder builder = entityManager.getCriteriaBuilder();
        CriteriaQuery<RuleProviderEntity> criteriaQuery = builder.createQuery(RuleProviderEntity.class);
        Root<RuleProviderEntity> root = criteriaQuery.from(RuleProviderEntity.class);
        criteriaQuery.where(builder.equal(root.get(RuleProviderEntity_.rulesPath), rulesPath));

        return entityManager.createQuery(criteriaQuery).getResultList();
    }

    private RulesPath getRulesPath(Long rulesPathID)
    {
        RulesPath rulesPath = entityManager.find(RulesPath.class, rulesPathID);

        if (rulesPath == null)
        {
            throw new NotFoundException("RulesPath with id " + rulesPathID + " not found");
        }

        return rulesPath;
    }

    @Override
    public RulesPath uploadRuleProvider(MultipartFormDataInput data)
    {
        Configuration configuration = this.configurationService.getGlobalConfiguration();
        return uploadRuleProviderToConfiguration(data, configuration, null);
    }

    @Override
    public RulesPath uploadRuleProviderByProject(Long projectId, MultipartFormDataInput data)
    {
        Configuration configuration = this.configurationService.getConfigurationByProjectId(projectId);
        MigrationProject migrationProject = configuration.getMigrationProject();
        return uploadRuleProviderToConfiguration(data, configuration, migrationProject.getId());
    }

    private  RulesPath uploadRuleProviderToConfiguration(MultipartFormDataInput data, Configuration configuration, Long projectId)
    {
        String fileName = this.fileUploadService.getFileName(data);
        Path customRulesPath = this.webPathUtil.getCustomRulesPath();

        // Save file to custom project folder
        if (projectId != null) {
            customRulesPath = this.webPathUtil.getCustomRulesPath(projectId.toString());
        }

        File file = this.fileUploadService.uploadFile(data, customRulesPath, fileName, true);

        ScopeType scopeType = configuration.isGlobal() ? ScopeType.GLOBAL : ScopeType.PROJECT;
        RulesPath rulesPathEntity = new RulesPath(file.getPath(), PathType.USER_PROVIDED, scopeType, RegistrationType.UPLOADED);
        String relativePath = customRulesPath.relativize(file.toPath()).toString();
        rulesPathEntity.setShortPath(relativePath);

        this.entityManager.persist(rulesPathEntity);

        configuration.getRulesPaths().add(rulesPathEntity);
        this.configurationService.saveConfiguration(configuration);

        return rulesPathEntity;
    }

    @Override
    public void deleteRuleProvider(Long rulesPathID)
    {
        RulesPath rulesPath = this.getRulesPath(rulesPathID);

        if (rulesPath.getRegistrationType() == RegistrationType.UPLOADED)
        {
            String path = rulesPath.getPath();
            File file = new File(path);
            file.delete();
        }

        Configuration configuration = (Configuration) entityManager.createNamedQuery(Configuration.FIND_BY_RULE_PATH_ID)
                .setParameter("rulePathId", rulesPath.getId())
                .getSingleResult();

        configuration.getRulesPaths().remove(rulesPath);
        this.entityManager.merge(configuration);

        // Remove rulePath from all AnalysisContexts
        @SuppressWarnings("unchecked")
        List<AnalysisContext> analysisContexts = entityManager.createNamedQuery(AnalysisContext.FIND_BY_RULE_PATH_ID)
                .setParameter("rulePathId", rulesPath.getId())
                .getResultList();
        analysisContexts.forEach(analysisContext -> {
            analysisContext.getRulesPaths().remove(rulesPath);
            this.entityManager.merge(analysisContext);
        });

        this.entityManager.createNamedQuery(RuleProviderEntity.DELETE_BY_RULES_PATH)
                .setParameter(RuleProviderEntity.RULES_PATH_PARAM, rulesPath)
                .executeUpdate();

        this.entityManager.remove(rulesPath);
    }

    @Override
    public Boolean isRulesPathUsed(Long rulesPathID)
    {
        RulesPath rulesPath = this.getRulesPath(rulesPathID);
        if (rulesPath.getRulesPathType() == PathType.SYSTEM_PROVIDED)
            return false;

        // Using ordinal() instead of toString() because WindupExecution.status is using ordinal value
        String queryStr = "SELECT count(*)  > 0 FROM ANALYSISCONTEXT_RULESPATH ACRP \n" +
                "INNER JOIN ANALYSISCONTEXT AC ON ACRP.ANALYSISCONTEXT_ID = AC.ID \n" +
                "INNER JOIN WINDUPEXECUTION WE ON AC.ID = WE.ANALYSISCONTEXT_ID \n" +
                "where (WE.STATUS = "+ ExecutionState.QUEUED.ordinal() + " OR WE.STATUS = " + ExecutionState.STARTED.ordinal() + ") \n" +
                "AND RULESPATHS_RULES_PATH_ID=:id";
        Boolean test = (Boolean) this.entityManager.createNativeQuery(queryStr).
                    setParameter("id", rulesPath.getId()).
                    getSingleResult();
        return test;
    }
    
}
