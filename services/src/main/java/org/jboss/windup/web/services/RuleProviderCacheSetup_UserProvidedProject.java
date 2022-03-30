package org.jboss.windup.web.services;

import org.jboss.windup.web.services.model.PathType;
import org.jboss.windup.web.services.model.ScopeType;
import org.jboss.windup.web.services.service.AnalysisContextService;

import javax.annotation.PostConstruct;
import javax.ejb.Singleton;
import javax.ejb.Startup;
import javax.inject.Inject;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Set;
import java.util.stream.Collectors;

@Startup
@Singleton
public class RuleProviderCacheSetup_UserProvidedProject {

    @Inject
    private AnalysisContextService analysisContextService;

    @Inject
    private RuleProviderRegistryCache_UserProvidedProject ruleProviderRegistryCache;

    @PostConstruct
    public void addSystemRulesPath() {
        analysisContextService.getAll().forEach(analysisContext -> {
            Set<Path> userRulePaths = analysisContext
                    .getRulesPaths()
                    .stream()
                    .filter(rulesPath -> rulesPath.getScopeType().equals(ScopeType.PROJECT) && rulesPath.getRulesPathType().equals(PathType.USER_PROVIDED))
                    .map(rulesPath -> Paths.get(rulesPath.getPath()))
                    .collect(Collectors.toSet());

            ruleProviderRegistryCache.setUserRulesPath(analysisContext, userRulePaths);
        });
    }

}
