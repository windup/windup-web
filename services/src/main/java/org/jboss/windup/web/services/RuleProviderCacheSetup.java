package org.jboss.windup.web.services;

import javax.annotation.PostConstruct;
import javax.ejb.Singleton;
import javax.ejb.Startup;
import javax.inject.Inject;

import org.jboss.forge.furnace.Furnace;
import org.jboss.windup.config.metadata.RuleProviderRegistryCache;
import org.jboss.windup.web.services.model.RulesPath;
import org.jboss.windup.web.services.service.ConfigurationService;

import java.nio.file.Paths;

/**
 * This makes sure that the Rule Provider cache is properly configured with any required rules directories, based upon
 * the current setup.
 *
 * @author <a href="mailto:jesse.sightler@gmail.com">Jesse Sightler</a>
 */
@Singleton
@Startup
public class RuleProviderCacheSetup
{
    @Inject
    private Furnace furnace;

    @Inject
    private ConfigurationService configurationService;

    @PostConstruct
    public void addSystemRulesPath()
    {
        configurationService.getAllConfigurations().forEach(configuration -> {
            configuration
                    .getRulesPaths()
                    .stream()
                    .filter(rulesPath -> rulesPath.getRulesPathType() == RulesPath.RulesPathType.SYSTEM_PROVIDED)
                    .map(rulesPath -> Paths.get(rulesPath.getPath()))
                    .forEach(path -> {
                        this.getRuleProviderRegistryCache().addUserRulesPath(path);
                    });
        });
        // This is just to make sure the cache gets loaded
        this.getRuleProviderRegistryCache().getRuleProviderRegistry();
    }

    private RuleProviderRegistryCache getRuleProviderRegistryCache()
    {
        return furnace.getAddonRegistry().getServices(RuleProviderRegistryCache.class).get();
    }
}
