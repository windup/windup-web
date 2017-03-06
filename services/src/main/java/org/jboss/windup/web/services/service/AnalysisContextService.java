package org.jboss.windup.web.services.service;

import javax.inject.Inject;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.ws.rs.NotFoundException;

import org.jboss.windup.web.services.model.AnalysisContext;
import org.jboss.windup.web.services.model.ApplicationGroup;
import org.jboss.windup.web.services.model.MigrationProject;
import org.jboss.windup.web.services.model.Package;
import org.jboss.windup.web.services.model.RulesPath;

import java.util.Collection;
import java.util.HashSet;
import java.util.Set;
import java.util.stream.Collectors;

/**
 * Provides tools for creating default analysis context instances, as well as providing default configuration data.
 *
 * @author <a href="mailto:jesse.sightler@gmail.com">Jesse Sightler</a>
 */
public class AnalysisContextService
{
    @PersistenceContext
    private EntityManager entityManager;

    @Inject
    private ConfigurationService configurationService;

    /**
     * Gets analysis context
     */
    public AnalysisContext get(Long id)
    {
        AnalysisContext context = entityManager.find(AnalysisContext.class, id);

        if (context == null)
        {
            throw new NotFoundException("AnalysisContext with id" + id + "not found");
        }

        return context;
    }

    /**
     * Creates a default instance.
     */
    public AnalysisContext createDefaultAnalysisContext(ApplicationGroup group)
    {
        AnalysisContext defaultAnalysisContext = new AnalysisContext(group);
        ensureSystemRulesPathsPresent(defaultAnalysisContext);
        entityManager.persist(defaultAnalysisContext);
        return defaultAnalysisContext;
    }

    /**
     * Creates a default instance.
     */
    public AnalysisContext createDefaultAnalysisContext(MigrationProject project)
    {
        AnalysisContext defaultAnalysisContext = new AnalysisContext(project);
        ensureSystemRulesPathsPresent(defaultAnalysisContext);
        entityManager.persist(defaultAnalysisContext);
        return defaultAnalysisContext;
    }

    /**
     * Creates a new instance.
     */
    public AnalysisContext create(AnalysisContext analysisContext)
    {
        this.ensureSystemRulesPathsPresent(analysisContext);
        this.loadPackagesToAnalysisContext(analysisContext);
        entityManager.persist(analysisContext);

        return analysisContext;
    }

    protected void loadPackagesToAnalysisContext(AnalysisContext analysisContext)
    {
        analysisContext.setIncludePackages(this.loadPackagesFromPersistenceContext(analysisContext.getIncludePackages()));
        analysisContext.setExcludePackages(this.loadPackagesFromPersistenceContext(analysisContext.getExcludePackages()));
    }

    protected Set<Package> loadPackagesFromPersistenceContext(Collection<Package> detachedPackages)
    {
        return detachedPackages.stream()
                .filter(aPackage -> aPackage.getId() != null && aPackage.getId() != 0)
                .map(aPackage -> this.entityManager.find(Package.class, aPackage.getId()))
                .filter(aPackage -> aPackage != null)
                .collect(Collectors.toSet());
    }

    /**
     * Updates an existing instance.
     */
    public AnalysisContext update(AnalysisContext analysisContext)
    {
        AnalysisContext original = this.get(analysisContext.getId());

        this.ensureSystemRulesPathsPresent(analysisContext);
        this.loadPackagesToAnalysisContext(analysisContext);
        analysisContext.setMigrationProject(original.getMigrationProject());

        return entityManager.merge(analysisContext);
    }

    private void ensureSystemRulesPathsPresent(AnalysisContext analysisContext)
    {
        this.configurationService
                    .getConfiguration().getRulesPaths()
                    .stream()
                    .filter(rulesPath -> rulesPath.getRulesPathType() == RulesPath.RulesPathType.SYSTEM_PROVIDED)
                    .forEach(rulesPath -> {
                        if (analysisContext.getRulesPaths() == null)
                            analysisContext.setRulesPaths(new HashSet<>());

                        if (!analysisContext.getRulesPaths().contains(rulesPath))
                            analysisContext.getRulesPaths().add(rulesPath);
                    });
    }
}
