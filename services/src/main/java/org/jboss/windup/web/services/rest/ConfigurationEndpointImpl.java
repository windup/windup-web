package org.jboss.windup.web.services.rest;

import java.util.Set;

import javax.ejb.Stateless;
import javax.inject.Inject;

import org.jboss.windup.web.services.model.Configuration;
import org.jboss.windup.web.services.model.LabelsPath;
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
    public Configuration getGlobalConfiguration()
    {
        return configurationService.getGlobalConfiguration();
    }

    @Override
    public Configuration saveConfiguration(long id, Configuration configuration)
    {
        configuration.setId(id);
        return configurationService.saveConfiguration(configuration);
    }

    @Override
    public Configuration getConfigurationByProject(long projectId)
    {
        return configurationService.getConfigurationByProjectId(projectId);
    }

    @Override
    public Set<RulesPath> getCustomRulesetPaths(long id)
    {
        return configurationService.getCustomRulesPath(id);
    }

    @Override
    public Set<LabelsPath> getCustomLabelsetPaths(long id)
    {
        return configurationService.getCustomLabelsPath(id);
    }

    @Override
    public Configuration reloadConfiguration(long id)
    {
        return configurationService.reloadConfiguration(id);
    }
}
