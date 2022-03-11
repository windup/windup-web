package org.jboss.windup.web.services;

import org.jboss.windup.web.services.model.PathType;
import org.jboss.windup.web.services.model.ScopeType;
import org.jboss.windup.web.services.service.AnalysisContextService;
import org.jboss.windup.web.services.service.ConfigurationService;

import javax.annotation.PostConstruct;
import javax.ejb.Singleton;
import javax.ejb.Startup;
import javax.inject.Inject;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Startup
@Singleton
public class RuleProviderCacheSetup_UserProvidedProject {

    @Inject
    private AnalysisContextService analysisContextService;

    @Inject
    private RuleProviderRegistryCache_UserProvidedProject ruleProviderRegistryCachePerAnalysisConfig;

    @PostConstruct
    public void addSystemRulesPath() {
        analysisContextService.getAll().forEach(analysisContext -> {
            Set<Path> paths = analysisContext
                    .getRulesPaths()
                    .stream()
                    .filter(rulesPath -> rulesPath.getScopeType().equals(ScopeType.PROJECT) && rulesPath.getRulesPathType().equals(PathType.USER_PROVIDED))
                    .map(rulesPath -> Paths.get(rulesPath.getPath()))
                    .collect(Collectors.toSet());

            ruleProviderRegistryCachePerAnalysisConfig.setUserRulesPath(analysisContext, paths);

            // This is just to make sure the cache gets loaded
            ruleProviderRegistryCachePerAnalysisConfig.getRuleProviderRegistry(analysisContext);
        });
    }

}
