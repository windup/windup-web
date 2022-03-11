package org.jboss.windup.web.services;

import org.jboss.windup.web.services.model.PathType;
import org.jboss.windup.web.services.model.ScopeType;
import org.jboss.windup.web.services.service.ConfigurationService;

import javax.annotation.PostConstruct;
import javax.ejb.Singleton;
import javax.ejb.Startup;
import javax.inject.Inject;
import java.nio.file.Paths;

@Startup
@Singleton
public class RuleProviderCacheSetup_UserProvidedGlobal {

    @Inject
    private ConfigurationService configurationService;

    @Inject
    private RuleProviderRegistryCache_UserProvidedGlobal ruleProviderRegistryCache;

    @PostConstruct
    public void addSystemRulesPath() {
        configurationService.getAllConfigurations().forEach(configuration -> {
            configuration
                    .getRulesPaths()
                    .stream()
                    .filter(rulesPath -> rulesPath.getScopeType().equals(ScopeType.GLOBAL) && rulesPath.getRulesPathType().equals(PathType.USER_PROVIDED))
                    .map(rulesPath -> Paths.get(rulesPath.getPath()))
                    .forEach(path -> ruleProviderRegistryCache.addUserRulesPath(path));
        });

        // This is just to make sure the cache gets loaded
        ruleProviderRegistryCache.getRuleProviderRegistry();
    }

}
