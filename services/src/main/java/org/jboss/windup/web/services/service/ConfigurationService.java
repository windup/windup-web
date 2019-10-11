package org.jboss.windup.web.services.service;

import javax.annotation.PostConstruct;
import javax.ejb.Singleton;
import javax.ejb.Startup;
import javax.enterprise.event.Event;
import javax.inject.Inject;
import javax.persistence.EntityManager;
import javax.persistence.NoResultException;
import javax.persistence.PersistenceContext;
import javax.persistence.Query;

import org.jboss.windup.web.furnaceserviceprovider.WebProperties;
import org.jboss.windup.web.services.model.AnalysisContext;
import org.jboss.windup.web.services.model.Configuration;
import org.jboss.windup.web.services.model.MigrationProject;
import org.jboss.windup.web.services.model.RulesPath;
import org.jboss.windup.web.services.model.RulesPath.RulesPathType;

import java.nio.file.Path;
import java.util.*;
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

    @Inject
    private AnalysisContextService analysisContextService;

    @PostConstruct
    public void initConfiguration()
    {
        Configuration configuration = getGlobalConfiguration();
        updateSystemRulesPath(configuration);
    }

    /**
     * Persists the provided {@link Configuration} object.
     */
    public Configuration saveConfiguration(Configuration configuration)
    {
        if (configuration.isGlobal()) {
            Set<RulesPath> oldRulesPaths = new HashSet<>(getConfiguration(configuration.getId()).getRulesPaths());

            configuration = entityManager.merge(configuration);
            Set<RulesPath> newRulesPaths = new HashSet<>(configuration.getRulesPaths());

            Set<RulesPath> addedRulesPath = new HashSet<>(newRulesPaths);
            addedRulesPath.removeAll(oldRulesPaths);

            Set<RulesPath> deletedRulesPaths = new HashSet<>(oldRulesPaths);
            deletedRulesPaths.removeAll(newRulesPaths);

            List<AnalysisContext> analysisContexts = analysisContextService.getAll();
            analysisContexts.forEach(analysisContext -> {
                analysisContext.getRulesPaths().removeAll(deletedRulesPaths);
                analysisContext.getRulesPaths().addAll(addedRulesPath);
                analysisContextService.ensureSystemRulesPathsPresent(analysisContext);
                entityManager.merge(analysisContext);
            });
        } else {
            configuration = entityManager.merge(configuration);
        }

        configurationEvent.fire(configuration);

        return configuration;
    }

    public Configuration getConfigurationByProjectId(long projectId)
    {
        try
        {
            return (Configuration) entityManager.createQuery("select c from Configuration c inner join c.migrationProject m where m.id = :projectId")
                    .setParameter("projectId", projectId)
                    .getSingleResult();
        }
        catch (NoResultException t)
        {
            Configuration configuration = createDefaultConfiguration(false);
            configuration.setRulesPaths(Collections.emptySet());
//            updateSystemRulesPath(configuration);

            MigrationProject migrationProject = entityManager.find(MigrationProject.class, projectId);
            migrationProject.setConfiguration(configuration);
            entityManager.merge(configuration);

            return configuration;
        }
    }

    public List<Configuration> getAllConfigurations()
    {
        return entityManager.createQuery("select c from Configuration c").getResultList();
    }

    public Configuration getConfiguration(long id)
    {
        return entityManager.find(Configuration.class, id);
    }

    /**
     * Gets the global configuration for Windup.
     */
    public Configuration getGlobalConfiguration()
    {
        try
        {
            return (Configuration)entityManager.createQuery("select configuration from Configuration configuration where configuration.isGlobal = true").getSingleResult();
        }
        catch (NoResultException t)
        {
            return createDefaultConfiguration(true);
        }
    }

    private Configuration createDefaultConfiguration(boolean isGlobal)
    {
        Configuration configuration = new Configuration();
        configuration.setGlobal(isGlobal);

        entityManager.persist(configuration);
        return configuration;
    }

    public Set<RulesPath> getCustomRulesPath(long id)
    {
        Set<RulesPath> customRulesPaths = new HashSet<>();
        Set<RulesPath> rulesets = getConfiguration(id).getRulesPaths();

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

    public Configuration reloadConfiguration(long id)
    {
        Configuration configuration = this.entityManager.find(Configuration.class, id);
        this.configurationEvent.fire(configuration);

        return configuration;
    }
}
