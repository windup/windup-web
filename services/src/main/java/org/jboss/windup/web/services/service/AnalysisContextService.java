package org.jboss.windup.web.services.service;

import javax.inject.Inject;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.ws.rs.NotFoundException;

import org.jboss.windup.web.services.model.AnalysisContext;
import org.jboss.windup.web.services.model.MigrationProject;
import org.jboss.windup.web.services.model.Package;
import org.jboss.windup.web.services.model.RulesPath;

import java.util.Collection;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.logging.Logger;
import java.util.stream.Collectors;
import org.jboss.windup.util.exception.WindupException;
import org.jboss.windup.web.services.model.WindupExecution;

/**
 * Provides tools for creating default analysis context instances, as well as providing default configuration data.
 *
 * @author <a href="mailto:jesse.sightler@gmail.com">Jesse Sightler</a>
 * @author <a href="http://ondra.zizka.cz/">Ondrej Zizka, zizka@seznam.cz</a>
 */
public class AnalysisContextService
{
    private static final Logger LOG = Logger.getLogger(AnalysisContextService.class.getName());

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
     * Creates and persists a default instance.
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

    /**
     * Returns the execution that was executed with given analysis context.
     */
    public WindupExecution getExecutionOfAnalysisContext(AnalysisContext analysisContext)
    {
        if (analysisContext == null)
            throw new WindupException("AnalysisContext was null.");

        List<WindupExecution> executions = this.entityManager.createQuery("SELECT exec FROM WindupExecution exec WHERE exec.analysisContext = :ctx ORDER BY exec.id DESC", WindupExecution.class).getResultList();
        if (executions.size() > 1)
        {
            String execIds = executions.stream().map(exec -> "" + exec.getId()).collect(Collectors.joining(", "));
            LOG.warning("Multiple executions have the same AnalysisContext #" + analysisContext.getId() + ": " + execIds);
        }
        return executions.isEmpty() ? null : executions.get(0);
    }

    /**
     * Returns the default analysis context for the given project, that is, the context that has no execution assigned.
     *
     * @return If there are multiple, it returns the last one and deletes the rest (for robustness).
     *         If there's none, returns null.
     */
    public AnalysisContext getDefaultProjectAnalysisContext(Long projectId)
    {
        return deleteDefaultContextOfProject(projectId, true);
    }

    /**
     * Deletes the default context of given project. If there are more, deletes them all.
     *
     * @param keepLast If true, does not delete the one latest context.
     */
    public AnalysisContext deleteDefaultContextOfProject(Long projectId, boolean keepLatest)
    {
        String jql = String.format(
                "SELECT ctx FROM %s AS ctx LEFT JOIN ctx.migrationProject AS proj"
                + " WHERE proj.id = :projectId AND NOT EXISTS (FROM WindupExecution exec WHERE exec.analysisContext = ctx)"
                + " ORDER BY ctx.id DESC",
                AnalysisContext.class.getSimpleName(),
                //MigrationProject.class.getSimpleName(),
                WindupExecution.class.getSimpleName());

        List<AnalysisContext> contexts = this.entityManager.createQuery(jql, AnalysisContext.class).setParameter("projectId", projectId).getResultList();

        String ids = contexts.stream().map(ctx -> "" + ctx.getId()).collect(Collectors.joining(", "));
        if (contexts.size() > 1)
        {
            LOG.warning("Project #" + projectId+ " has several default AnalysisContext's: " + ids);
        }
        else
            LOG.info("AnalysisContext's with project #" + projectId+ " and NULL execution: " + ids);

        AnalysisContext latest = null;
        if (keepLatest && !contexts.isEmpty())
        {
            latest = contexts.remove(0);
        }

        jql = "DELETE FROM AnalysisContext ctx WHERE ctx IN :toDelete AND NOT EXISTS (FROM WindupExecution exec WHERE exec.analysisContext = ctx)";
        this.entityManager.createQuery(jql).setParameter("toDelete", contexts).executeUpdate();

        return latest;
    }
}
