package org.jboss.windup.web.services;

import org.jboss.windup.web.services.model.PathType;
import org.jboss.windup.web.services.model.ScopeType;
import org.jboss.windup.web.services.service.ConfigurationService;

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
public class RuleProviderCacheSetup_UserProvidedGlobal {

    @Inject
    private ConfigurationService configurationService;

    @Inject
    private RuleProviderRegistryCache_UserProvidedGlobal ruleProviderRegistryCache;

    @PostConstruct
    public void addSystemRulesPath() {
        Set<Path> userRulePaths = configurationService.getAllConfigurations().stream()
                .flatMap(configuration -> configuration.getRulesPaths().stream())
                .filter(rulePath -> rulePath.getScopeType().equals(ScopeType.GLOBAL) && rulePath.getRulesPathType().equals(PathType.USER_PROVIDED))
                .map(rulesPath -> Paths.get(rulesPath.getPath()))
                .collect(Collectors.toSet());
        ruleProviderRegistryCache.setUserRulesPath(userRulePaths);
    }

}
