package org.jboss.windup.web.services.rest;

import java.util.Set;

import javax.ejb.Stateless;
import javax.enterprise.event.Event;
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

    @Inject
    private Event<Configuration> configurationEvent;

    @Override
    public Configuration getConfiguration()
    {
        return configurationService.getConfiguration();
    }

    @Override
    public Configuration saveConfiguration(Configuration configuration)
    {
        Configuration saved = configurationService.saveConfiguration(configuration);
        configurationEvent.fire(saved);
        return saved;
    }

    @Override
    public Set<RulesPath> getCustomRulesetPaths()
    {
        return configurationService.getCustomRulesPath();
    }

    @Override
    public Configuration reloadConfiguration()
    {
        Configuration configuration = configurationService.getConfiguration();
        this.configurationEvent.fire(configuration);

        return configuration;
    }
}
