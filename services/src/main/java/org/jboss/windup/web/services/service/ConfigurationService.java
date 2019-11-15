package org.jboss.windup.web.services.service;

import org.jboss.windup.web.furnaceserviceprovider.WebProperties;
import org.jboss.windup.web.services.model.AnalysisContext;
import org.jboss.windup.web.services.model.Configuration;
import org.jboss.windup.web.services.model.MigrationProject;
import org.jboss.windup.web.services.model.PathType;
import org.jboss.windup.web.services.model.RulesPath;
import org.jboss.windup.web.services.model.ScopeType;

import javax.annotation.PostConstruct;
import javax.ejb.Singleton;
import javax.ejb.Startup;
import javax.enterprise.event.Event;
import javax.inject.Inject;
import javax.persistence.EntityManager;
import javax.persistence.NoResultException;
import javax.persistence.PersistenceContext;
import java.nio.file.Path;
import java.util.Collections;
import java.util.HashSet;
import java.util.Iterator;
import java.util.List;
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

    @Inject
    private AnalysisContextService analysisContextService;

    @PostConstruct
    public void initConfiguration()
    {
        Configuration configuration = getGlobalConfiguration();
        updateSystemRulesPath(configuration);
        updateSystemLabelsPath(configuration);
    }

    /**
     * Persists the provided {@link Configuration} object.
     */
    public Configuration saveConfiguration(Configuration configuration)
    {
        if (configuration.isGlobal()) {
            Set<RulesPath> oldRulesPaths = new HashSet<>(getConfiguration(configuration.getId()).getRulesPaths());
            Set<LabelsPath> oldLabelsPaths = new HashSet<>(getConfiguration(configuration.getId()).getLabelsPaths());

            configuration = entityManager.merge(configuration);

            // Rules
            Set<RulesPath> newRulesPaths = new HashSet<>(configuration.getRulesPaths());

            Set<RulesPath> addedRulesPath = new HashSet<>(newRulesPaths);
            addedRulesPath.removeAll(oldRulesPaths);

            Set<RulesPath> deletedRulesPaths = new HashSet<>(oldRulesPaths);
            deletedRulesPaths.removeAll(newRulesPaths);

            // Labels
            Set<LabelsPath> newLabelsPaths = new HashSet<>(configuration.getLabelsPaths());

            Set<LabelsPath> addedLabelsPath = new HashSet<>(newLabelsPaths);
            addedLabelsPath.removeAll(oldLabelsPaths);

            Set<LabelsPath> deletedLabelsPaths = new HashSet<>(oldLabelsPaths);
            deletedLabelsPaths.removeAll(newLabelsPaths);

            @SuppressWarnings("unchecked")
            List<AnalysisContext> analysisContexts = entityManager.createNamedQuery(AnalysisContext.FIND_ALL_WHERE_EXECUTION_IS_NULL)
                    .getResultList();
            analysisContexts.forEach(analysisContext -> {
                analysisContext.getRulesPaths().removeAll(deletedRulesPaths);
                analysisContext.getRulesPaths().addAll(addedRulesPath);
                analysisContextService.ensureSystemRulesPathsPresent(analysisContext);

                analysisContext.getLabelsPaths().removeAll(deletedLabelsPaths);
                analysisContext.getLabelsPaths().addAll(addedLabelsPath);
                analysisContextService.ensureSystemLabelsPathsPresent(analysisContext);

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
            configuration.setLabelsPaths(Collections.emptySet());

            MigrationProject migrationProject = entityManager.find(MigrationProject.class, projectId);
            migrationProject.setConfiguration(configuration);
            entityManager.merge(configuration);

            return configuration;
        }
    }

    public List<Configuration> getAllConfigurations()
    {
        return entityManager.createNamedQuery(Configuration.FIND_ALL).getResultList();
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
            return (Configuration)entityManager.createNamedQuery(Configuration.FIND_GLOBAL).getSingleResult();
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
            if (rulesPath.getRulesPathType() == PathType.USER_PROVIDED && rulesPath.getLoadError() == null)
            {
                customRulesPaths.add(rulesPath);
            }
        }
        return customRulesPaths;
    }

    public Set<LabelsPath> getCustomLabelsPath(long id)
    {
        Set<LabelsPath> customLabelsPaths = new HashSet<>();
        Set<LabelsPath> labelsets = getConfiguration(id).getLabelsPaths();

        for (Iterator<LabelsPath> iterator = labelsets.iterator(); iterator.hasNext();)
        {
            LabelsPath labelsPath = (LabelsPath) iterator.next();
            if (labelsPath.getLabelsPathType() == PathType.USER_PROVIDED && labelsPath.getLoadError() == null)
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
                     .filter((rulesPath) -> rulesPath.getRulesPathType() == PathType.SYSTEM_PROVIDED)
                     .findFirst();

        // Update it if present
        if (existingSystemRulesPath.isPresent())
        {
            existingSystemRulesPath.get().setPath(newSystemRulesPath.toString());
        }
        else
        {
            ScopeType scopeType = configuration.isGlobal() ? ScopeType.GLOBAL : ScopeType.PROJECT;

            // Otherwise, create a new one
            RulesPath newRulesPath = new RulesPath(newSystemRulesPath.toString(), PathType.SYSTEM_PROVIDED, scopeType);
            if (newRulesPath.getLoadError() == null)
                dbPaths.add(newRulesPath);
        }

        // finally, set the new values on the configuration
        configuration.setRulesPaths(dbPaths);
    }

    private void updateSystemLabelsPath(Configuration configuration)
    {
        // Get the updated system labels path from the system
        Path newSystemLabelsPath = WebProperties.getInstance().getLabelsRepository().toAbsolutePath().normalize();

        // make a list of existing labels path
        Set<LabelsPath> dbPaths = new HashSet<>();
        if (configuration.getLabelsPaths() != null)
            dbPaths = configuration.getLabelsPaths();

        // Find the existing system labels path
        Optional<LabelsPath> existingSystemLabelsPath = dbPaths.stream()
                .filter((labelsPath) -> labelsPath.getLabelsPathType() == PathType.SYSTEM_PROVIDED)
                .findFirst();

        // Update it if present
        if (existingSystemLabelsPath.isPresent())
        {
            existingSystemLabelsPath.get().setPath(newSystemLabelsPath.toString());
        }
        else
        {
            ScopeType scopeType = configuration.isGlobal() ? ScopeType.GLOBAL : ScopeType.PROJECT;

            // Otherwise, create a new one
            LabelsPath newLabelsPath = new LabelsPath(newSystemLabelsPath.toString(), PathType.SYSTEM_PROVIDED, scopeType);
            if (newLabelsPath.getLoadError() == null)
                dbPaths.add(newLabelsPath);
        }

        // finally, set the new values on the configuration
        configuration.setLabelsPaths(dbPaths);
    }

    public Configuration reloadConfiguration(long id)
    {
        Configuration configuration = this.entityManager.find(Configuration.class, id);
        this.configurationEvent.fire(configuration);

        return configuration;
    }
}
