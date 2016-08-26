package org.jboss.windup.web.services.rest;

import javax.ejb.Stateless;
import javax.enterprise.event.Event;
import javax.inject.Inject;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;

import org.jboss.windup.web.services.model.Configuration;
import org.jboss.windup.web.services.service.ConfigurationService;

/**
 * @author <a href="mailto:jesse.sightler@gmail.com">Jesse Sightler</a>
 */
@Stateless
public class ConfigurationEndpointImpl implements ConfigurationEndpoint
{
    @PersistenceContext
    private EntityManager entityManager;

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
        Configuration saved = entityManager.merge(configuration);
        configurationEvent.fire(saved);
        return saved;
    }
}
