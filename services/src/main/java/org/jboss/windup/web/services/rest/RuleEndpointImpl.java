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
import org.jboss.windup.web.services.model.Configuration;
import org.jboss.windup.web.services.model.RegistrationType;
import org.jboss.windup.web.services.model.RuleProviderEntity;
import org.jboss.windup.web.services.model.RuleProviderEntity_;
import org.jboss.windup.web.services.model.RulesPath;
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

    /**
     * TODO:
     * 1) Validate if path exists
     * 2) Validate if it is not already used
     * 3) Validate if it is valid RuleProvider
     */
    @Override
    public RulesPath registerRuleProviderByPath(String path)
    {

        return null;
    }

    @Override
    public RulesPath uploadRuleProvider(MultipartFormDataInput data)
    {
        String fileName = this.fileUploadService.getFileName(data);
        Path customRulesPath = this.webPathUtil.getCustomRulesPath();

        File file = this.fileUploadService.uploadFile(data, customRulesPath, fileName, true);

        RulesPath rulesPathEntity = new RulesPath(file.getPath(), RulesPath.RulesPathType.USER_PROVIDED, RegistrationType.UPLOADED);
        this.entityManager.persist(rulesPathEntity);

        Configuration configuration = this.configurationService.getConfiguration();
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

        Configuration configuration = this.configurationService.getConfiguration();
        configuration.getRulesPaths().remove(rulesPath);
        this.entityManager.merge(configuration);

        this.entityManager.createNamedQuery(RuleProviderEntity.DELETE_BY_RULES_PATH)
                .setParameter(RuleProviderEntity.RULES_PATH_PARAM, rulesPath)
                .executeUpdate();

        this.entityManager.remove(rulesPath);
    }
}
