package org.jboss.windup.web.services.service;

import javax.inject.Inject;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;

import org.jboss.windup.web.services.model.AnalysisContext;
import org.jboss.windup.web.services.model.RulesPath;

import java.util.HashSet;

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
     * Creates a default instance.
     */
    public AnalysisContext createDefaultAnalysisContext()
    {
        AnalysisContext defaultAnalysisContext = new AnalysisContext();
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
        entityManager.persist(analysisContext);
        return analysisContext;
    }

    /**
     * Updates an existing instance.
     */
    public AnalysisContext update(AnalysisContext analysisContext)
    {
        this.ensureSystemRulesPathsPresent(analysisContext);
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
