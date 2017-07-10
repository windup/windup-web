package org.jboss.windup.web.services.service;

import javax.annotation.PostConstruct;
import javax.ejb.Singleton;
import javax.ejb.Startup;
import javax.enterprise.event.Event;
import javax.inject.Inject;
import javax.persistence.EntityManager;
import javax.persistence.NoResultException;
import javax.persistence.PersistenceContext;

import org.jboss.windup.web.furnaceserviceprovider.WebProperties;
import org.jboss.windup.web.services.model.Configuration;
import org.jboss.windup.web.services.model.RulesPath;
import org.jboss.windup.web.services.model.RulesPath.RulesPathType;

import java.nio.file.Path;
import java.util.HashSet;
import java.util.Iterator;
import java.util.Optional;
import java.util.Set;
import java.util.concurrent.TimeUnit;

/**
 * Contains the global configuration for Windup server.
 *
 * @author <a href="mailto:jesse.sightler@gmail.com">Jesse Sightler</a>
 */
@Singleton
@Startup
@javax.ejb.AccessTimeout(value = 20, unit = TimeUnit.SECONDS)
public class ConfigurationService
{
    @PersistenceContext
    private EntityManager entityManager;

    @Inject
    private Event<Configuration> configurationEvent;

    @PostConstruct
    public void initConfiguration()
    {
        Configuration configuration = getConfiguration();
        updateSystemRulesPath(configuration);
    }

    /**
     * Persists the provided {@link Configuration} object.
     */
    public Configuration saveConfiguration(Configuration configuration)
    {
        configuration = entityManager.merge(configuration);
        configurationEvent.fire(configuration);

        return configuration;
    }

    /**
     * Gets the global configuration for Windup.
     */
    public Configuration getConfiguration()
    {
        try
        {
            return (Configuration)entityManager.createQuery("select configuration from Configuration configuration").getSingleResult();
        }
        catch (NoResultException t)
        {
            return createDefaultConfiguration();
        }
    }

    private Configuration createDefaultConfiguration()
    {
        Configuration configuration = new Configuration();

        entityManager.persist(configuration);
        return configuration;
    }

    public Set<RulesPath> getCustomRulesPath()
    {
        Set<RulesPath> customRulesPaths = new HashSet<>();
        Set<RulesPath> rulesets = getConfiguration().getRulesPaths();

        for (Iterator<RulesPath> iterator = rulesets.iterator(); iterator.hasNext();)
        {
            RulesPath rulesPath = (RulesPath) iterator.next();
            if (rulesPath.getRulesPathType() == RulesPathType.USER_PROVIDED && rulesPath.getLoadError() == null)
            {
                customRulesPaths.add(rulesPath);
            }
        }
        return customRulesPaths;
    }

    private void updateSystemRulesPath(Configuration configuration)
    {
        // Get the updated system rules path from the system
        Path newSystemRulesPath = WebProperties.getInstance().getRulesRepository().toAbsolutePath().normalize();

        // make a list of existing rules path
        Set<RulesPath> dbPaths = new HashSet<>();
        if (configuration.getRulesPaths() != null)
            dbPaths = configuration.getRulesPaths();

        // Find the existing system rules path
        Optional<RulesPath> existingSystemRulesPath = dbPaths.stream()
                     .filter((rulesPath) -> rulesPath.getRulesPathType() == RulesPath.RulesPathType.SYSTEM_PROVIDED)
                     .findFirst();

        // Update it if present
        if (existingSystemRulesPath.isPresent())
        {
            existingSystemRulesPath.get().setPath(newSystemRulesPath.toString());
        }
        else
        {
            // Otherwise, create a new one
            RulesPath newRulesPath = new RulesPath(newSystemRulesPath.toString(), RulesPath.RulesPathType.SYSTEM_PROVIDED);
            if (newRulesPath.getLoadError() == null)
                dbPaths.add(newRulesPath);
        }

        // finally, set the new values on the configuration
        configuration.setRulesPaths(dbPaths);
    }

    public Configuration reloadConfiguration()
    {
        Configuration configuration = this.getConfiguration();
        this.configurationEvent.fire(configuration);

        return configuration;
    }
}
