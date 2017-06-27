package org.jboss.windup.web.services.rest;

import java.util.Set;

import javax.ejb.Stateless;
import javax.inject.Inject;

import org.jboss.windup.web.services.model.Configuration;
import org.jboss.windup.web.services.model.RulesPath;
import org.jboss.windup.web.services.service.ConfigurationService;

/**
 * @author <a href="mailto:jesse.sightler@gmail.com">Jesse Sightler</a>
 */
@Stateless
public class ConfigurationEndpointImpl implements ConfigurationEndpoint
{
    @Inject
    private ConfigurationService configurationService;

    @Override
    public Configuration getConfiguration()
    {
        return configurationService.getConfiguration();
    }

    @Override
    public Configuration saveConfiguration(Configuration configuration)
    {
        return configurationService.saveConfiguration(configuration);
    }

    @Override
    public Set<RulesPath> getCustomRulesetPaths()
    {
        return configurationService.getCustomRulesPath();
    }

    @Override
    public Configuration reloadConfiguration()
    {
        return configurationService.reloadConfiguration();
    }
}
