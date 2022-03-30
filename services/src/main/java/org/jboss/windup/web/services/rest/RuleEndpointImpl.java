package org.jboss.windup.web.services.rest;

import org.jboss.resteasy.plugins.providers.multipart.MultipartFormDataInput;
import org.jboss.windup.web.addons.websupport.WebPathUtil;
import org.jboss.windup.web.furnaceserviceprovider.FromFurnace;
import org.jboss.windup.web.services.model.*;
import org.jboss.windup.web.services.service.AnalysisContextService;
import org.jboss.windup.web.services.service.ConfigurationService;
import org.jboss.windup.web.services.service.FileUploadService;
import org.jboss.windup.web.services.service.RulesPathService;

import javax.ejb.Stateless;
import javax.inject.Inject;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.ws.rs.NotFoundException;
import java.io.File;
import java.nio.file.Path;
import java.util.List;

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

    @Inject
    private RulesPathService rulesPathService;

    @Inject
    private AnalysisContextService analysisContextService;

//    @Inject
//    private RuleProviderRegistryCache_UserProvidedGlobal ruleProviderRegistryCache_userProvidedGlobal;
//
//    @Inject
//    private RuleProviderRegistryCache_UserProvidedProject ruleProviderRegistryCache_userProvidedProject;

    @Override
    public List<RuleProviderEntity> getAllProviders()
    {
        return entityManager.createNamedQuery(RuleProviderEntity.FIND_ALL).getResultList();
    }

    @Override
    public List<RuleProviderEntity> getByRulesPath(Long rulesPathID)
    {
        RulesPath rulesPath = getRulesPath(rulesPathID);
        return rulesPathService.getRuleProviderEntitiesByRulesPath(rulesPath);
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
        RulesPath rulesPath = uploadRuleProviderToConfiguration(data, configuration, null);

        // Add uploaded rule to cache
//        ruleProviderRegistryCache_userProvidedGlobal.addUserRulesPath(Paths.get(rulesPath.getPath()));

        return rulesPath;
    }

    @Override
    public RulesPath uploadRuleProviderByProject(Long projectId, MultipartFormDataInput data)
    {
        Configuration configuration = this.configurationService.getConfigurationByProjectId(projectId);
        MigrationProject migrationProject = configuration.getMigrationProject();
        RulesPath rulesPath = uploadRuleProviderToConfiguration(data, configuration, migrationProject.getId());

        // Add uploaded rule to cache
//        AnalysisContext analysisContext = migrationProject.getDefaultAnalysisContext();
//        Set<Path> newRulesPath = analysisContext.getRulesPaths().stream()
//                .filter(item -> item.getScopeType().equals(ScopeType.PROJECT) && item.getRulesPathType().equals(PathType.USER_PROVIDED))
//                .map(item -> Paths.get(item.getPath()))
//                .collect(Collectors.toSet());
//        newRulesPath.add(Paths.get(rulesPath.getPath()));
//        ruleProviderRegistryCache_userProvidedProject.setUserRulesPath(analysisContext, newRulesPath);

        return rulesPath;
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

        // Remove deleted rule from cache
//        Path path = Paths.get(rulesPath.getPath());
//        if (rulesPath.getScopeType().equals(ScopeType.GLOBAL)) {
//            ruleProviderRegistryCache_userProvidedGlobal.removeUserRulesPath(path);
//        } else if (rulesPath.getScopeType().equals(ScopeType.PROJECT)) {
//            MigrationProject migrationProject = configuration.getMigrationProject();
//            AnalysisContext analysisContext = migrationProject.getDefaultAnalysisContext();
//            Set<Path> newRulesPath = analysisContext.getRulesPaths().stream()
//                    .filter(item -> item.getScopeType().equals(ScopeType.PROJECT) && item.getRulesPathType().equals(PathType.USER_PROVIDED))
//                    .map(item -> Paths.get(item.getPath()))
//                    .collect(Collectors.toSet());
//            newRulesPath.remove(Paths.get(rulesPath.getPath()));
//            ruleProviderRegistryCache_userProvidedProject.setUserRulesPath(analysisContext, newRulesPath);
//        }

        // Remove rulePath from all AnalysisContexts
        @SuppressWarnings("unchecked")
        List<AnalysisContext> analysisContexts = entityManager
                .createNamedQuery(AnalysisContext.FIND_BY_RULE_PATH_ID_AND_EXECUTION_IS_NULL)
                .setParameter("rulePathId", rulesPath.getId())
                .getResultList();

        analysisContexts.forEach(analysisContext -> {
            analysisContext.getRulesPaths().remove(rulesPath);

//            Set<String> availableSources = Stream.concat(ruleProviderRegistryCache.getAvailableSourceTechnologies().stream(), ruleProviderRegistryCache_userProvidedProject.getAvailableSourceTechnologies(analysisContext).stream()).collect(Collectors.toSet());
//            Set<String> availableTargets = Stream.concat(ruleProviderRegistryCache.getAvailableTargetTechnologies().stream(), ruleProviderRegistryCache_userProvidedProject.getAvailableSourceTechnologies(analysisContext).stream()).collect(Collectors.toSet());
//
//            List<AdvancedOption> advancedOptions = analysisContext.getAdvancedOptions().stream()
//                    .filter(advancedOption -> !advancedOption.getName().equals(SourceOption.NAME) || availableSources.contains(advancedOption.getValue()))
//                    .filter(advancedOption -> !advancedOption.getName().equals(TargetOption.NAME) || availableTargets.contains(advancedOption.getValue()))
//                    .collect(Collectors.toList());
//
//            analysisContext.setAdvancedOptions(advancedOptions);
//            analysisContext.getRulesPaths().remove(rulesPath);
//
//            this.entityManager.merge(analysisContext);

            // Remove no longer available sources/targets
            analysisContextService.pruneAdvancedOptions(analysisContext);

            this.entityManager.merge(analysisContext);
        });

//        // Remove sources/targets that belonged to rule
//        if (rulesPath.getScopeType().equals(ScopeType.GLOBAL)) {
//            // TODO
//            analysisContexts.forEach(analysisContext -> {
//                Set<String> validTargets = Stream.concat(
//                        ruleProviderRegistryCache_systemProvided.getAvailableTargetTechnologies().stream(),
//                        ruleProviderRegistryCache_userProvidedProject.getAvailableSourceTechnologies(analysisContext).stream()
//                ).collect(Collectors.toSet());
//
//                List<AdvancedOption> advancedOptions = analysisContext.getAdvancedOptions().stream()
//                        .filter(advancedOption -> !advancedOption.getName().equals(TargetOption.NAME) || validTargets.contains(advancedOption.getValue()))
//                        .collect(Collectors.toList());
//                analysisContext.setAdvancedOptions(advancedOptions);
//
//                this.entityManager.merge(analysisContext);
//            });
//        } else if (rulesPath.getScopeType().equals(ScopeType.PROJECT)) {
//            MigrationProject migrationProject = configuration.getMigrationProject();
//            AnalysisContext analysisContext = migrationProject.getDefaultAnalysisContext();
//
//            Set<String> validTargets = Stream.concat(
//                    ruleProviderRegistryCache_systemProvided.getAvailableTargetTechnologies().stream(),
//                    ruleProviderRegistryCache_userProvidedProject.getAvailableSourceTechnologies(analysisContext).stream()
//            ).collect(Collectors.toSet());
//
//            List<AdvancedOption> advancedOptions = analysisContext.getAdvancedOptions().stream()
//                    .filter(advancedOption -> !advancedOption.getName().equals(TargetOption.NAME) || validTargets.contains(advancedOption.getValue()))
//                    .collect(Collectors.toList());
//            analysisContext.setAdvancedOptions(advancedOptions);
//
//            this.entityManager.merge(analysisContext);
//        }
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
