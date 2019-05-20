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
import org.jboss.windup.web.services.model.LabelsPath;
import org.jboss.windup.web.services.model.RulesPath;
import org.jboss.windup.web.services.model.RulesPath.RulesPathType;
import org.jboss.windup.web.services.model.LabelsPath.LabelsPathType;

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
        updateSystemLabelsPath(configuration);
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

    public Set<LabelsPath> getCustomLabelsPath()
    {
        Set<LabelsPath> customLabelsPaths = new HashSet<>();
        Set<LabelsPath> labelsets = getConfiguration().getLabelsPaths();

        for (Iterator<LabelsPath> iterator = labelsets.iterator(); iterator.hasNext();)
        {
            LabelsPath labelsPath = (LabelsPath) iterator.next();
            if (labelsPath.getLabelsPathType() == LabelsPathType.USER_PROVIDED && labelsPath.getLoadError() == null)
            {
                customLabelsPaths.add(labelsPath);
            }
        }
        return customLabelsPaths;
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

    private void updateSystemLabelsPath(Configuration configuration)
    {
        // Get the updated system rules path from the system
        Path newSystemLabelsPath = WebProperties.getInstance().getRulesRepository().toAbsolutePath().normalize();

        // make a list of existing rules path
        Set<LabelsPath> dbPaths = new HashSet<>();
        if (configuration.getLabelsPaths() != null)
            dbPaths = configuration.getLabelsPaths();

        // Find the existing system rules path
        Optional<LabelsPath> existingSystemLabelsPath = dbPaths.stream()
                .filter((labelsPath) -> labelsPath.getLabelsPathType() == LabelsPath.LabelsPathType.SYSTEM_PROVIDED)
                .findFirst();

        // Update it if present
        if (existingSystemLabelsPath.isPresent())
        {
            existingSystemLabelsPath.get().setPath(newSystemLabelsPath.toString());
        }
        else
        {
            // Otherwise, create a new one
            LabelsPath newLabelsPath = new LabelsPath(newSystemLabelsPath.toString(), LabelsPath.LabelsPathType.SYSTEM_PROVIDED);
            if (newLabelsPath.getLoadError() == null)
                dbPaths.add(newLabelsPath);
        }

        // finally, set the new values on the configuration
        configuration.setLabelsPaths(dbPaths);
    }

    public Configuration reloadConfiguration()
    {
        Configuration configuration = this.getConfiguration();
        this.configurationEvent.fire(configuration);

        return configuration;
    }
}
