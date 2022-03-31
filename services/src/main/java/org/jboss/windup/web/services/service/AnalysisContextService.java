package org.jboss.windup.web.services.service;

import org.jboss.forge.furnace.Furnace;
import org.jboss.windup.config.metadata.RuleProviderRegistryCache;
import org.jboss.windup.exec.configuration.options.SourceOption;
import org.jboss.windup.exec.configuration.options.TargetOption;
import org.jboss.windup.web.services.SourceTargetTechnologies;
import org.jboss.windup.web.services.model.Package;
import org.jboss.windup.web.services.model.*;

import javax.annotation.PostConstruct;
import javax.ejb.Stateless;
import javax.inject.Inject;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.ws.rs.BadRequestException;
import javax.ws.rs.NotFoundException;
import java.util.*;
import java.util.stream.Collectors;

/**
 * Provides tools for creating default analysis context instances, as well as providing default configuration data.
 *
 * @author <a href="mailto:jesse.sightler@gmail.com">Jesse Sightler</a>
 */
@Stateless
public class AnalysisContextService
{
    @PersistenceContext
    private EntityManager entityManager;

    @Inject
    private ConfigurationService configurationService;

    @Inject
    private RulesPathService rulesPathService;

    @Inject
    private Furnace furnace;

    private RuleProviderRegistryCache ruleProviderRegistryCache;

    @PostConstruct
    public void init() {
        ruleProviderRegistryCache = furnace.getAddonRegistry().getServices(RuleProviderRegistryCache.class).get();
    }

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

    public List<AnalysisContext> getAll()
    {
        return entityManager.createNamedQuery(AnalysisContext.FIND_ALL).getResultList();
    }

    /**
     * Creates a default instance.
     */
    public AnalysisContext createDefaultAnalysisContext(MigrationProject project)
    {
        AnalysisContext defaultAnalysisContext = new AnalysisContext(project);
        ensureSystemRulesPathsPresent(defaultAnalysisContext);
        ensureSystemLabelsPathsPresent(defaultAnalysisContext);
        entityManager.persist(defaultAnalysisContext);

        return defaultAnalysisContext;
    }

    /**
     * Creates a new instance.
     */
    public AnalysisContext create(AnalysisContext analysisContext)
    {
        analysisContext.setId(null); // creating new instance, should not have id
        this.ensureSystemRulesPathsPresent(analysisContext);
        this.ensureSystemLabelsPathsPresent(analysisContext);
        this.loadPackagesToAnalysisContext(analysisContext);
        this.loadAdvancedOptionsToAnalysisContext(analysisContext);
        entityManager.persist(analysisContext);

        return analysisContext;
    }

    protected void loadAdvancedOptionsToAnalysisContext(AnalysisContext analysisContext)
    {
        analysisContext.setAdvancedOptions(this.loadAdvancedOptionsFromPersistenceContext(analysisContext.getAdvancedOptions()));
    }

    protected Collection<AdvancedOption> loadAdvancedOptionsFromPersistenceContext(Collection<AdvancedOption> advancedOptions)
    {
        return advancedOptions.stream()
                    .filter(anOption -> anOption.getId() != null && anOption.getId() != 0)
                    .map(anOption -> this.entityManager.find(AdvancedOption.class, anOption.getId()))
                    .filter(anOption -> anOption != null)
                    .map(anOption -> new AdvancedOption(anOption.getName(), anOption.getValue()))
                    .collect(Collectors.toList());
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

    protected boolean contextHasExecutions(AnalysisContext context)
    {
        String query = "SELECT COUNT(ex) FROM WindupExecution ex WHERE ex.analysisContext = :ctxt";

        Long count = this.entityManager.createQuery(query, Long.class)
                    .setParameter("ctxt", context)
                    .getSingleResult();

        return count > 0;
    }

    /**
     * Updates an existing instance.
     */
    public AnalysisContext update(Long analysisContextId, AnalysisContext analysisContext, boolean skipChangeToProvisional)
    {
        AnalysisContext original = this.get(analysisContextId);

        if (this.contextHasExecutions(original))
        {
            throw new BadRequestException("Cannot update context used for executions");
        }

        analysisContext.setId(analysisContextId); // make sure user doesn't provide invalid id
        this.ensureSystemRulesPathsPresent(analysisContext);
        this.ensureSystemLabelsPathsPresent(analysisContext);
        this.loadPackagesToAnalysisContext(analysisContext);
        analysisContext.setMigrationProject(original.getMigrationProject());

        /*
         * This promotes the provisional project (temporary instance before finished in wizard)
         * to a normal project that is listed in project list.
         *
         * It seems a little out of place here, but this is the only place that projects are
         * currently finalized. (jsight - 2017/04/28)
         */
        if (!skipChangeToProvisional) {
            analysisContext.getMigrationProject().setProvisional(Boolean.FALSE);
        }

        AnalysisContext merged = entityManager.merge(analysisContext);
        return merged;
    }

    public void ensureSystemRulesPathsPresent(AnalysisContext analysisContext)
    {
        configurationService
                    .getGlobalConfiguration().getRulesPaths()
                    .forEach(rulesPath -> {
                        if (analysisContext.getRulesPaths() == null)
                            analysisContext.setRulesPaths(new HashSet<>());

                        if (!analysisContext.getRulesPaths().contains(rulesPath))
                            analysisContext.getRulesPaths().add(rulesPath);
                    });
    }

    public void ensureSystemLabelsPathsPresent(AnalysisContext analysisContext)
    {
        configurationService
                .getGlobalConfiguration().getLabelsPaths()
                .forEach(labelsPath -> {
                    if (analysisContext.getLabelsPaths() == null)
                        analysisContext.setLabelsPaths(new HashSet<>());

                    if (!analysisContext.getLabelsPaths().contains(labelsPath))
                        analysisContext.getLabelsPaths().add(labelsPath);
                });
    }

    public void addAndPruneTechnologiesToAdvancedOptions(AnalysisContext analysisContext) {
        List<RulesPath> userProvidedRulesPaths = analysisContext.getRulesPaths().stream()
                .filter(f -> f.getRulesPathType().equals(PathType.USER_PROVIDED))
                .collect(Collectors.toList());

        SourceTargetTechnologies userTechnologies = rulesPathService.getSourceTargetTechnologies(userProvidedRulesPaths);

        // Add custom source/targets to Advanced Options
        List<AdvancedOption> newSources = userTechnologies.getSources().stream()
                .filter(source -> analysisContext.getAdvancedOptions().stream()
                        .filter(advancedOption -> advancedOption.getName().equals(SourceOption.NAME))
                        .filter(advancedOption -> advancedOption.getValue().equals(source))
                        .findAny()
                        .isEmpty()
                )
                .map(source -> {
                    AdvancedOption advancedOption = new AdvancedOption();
                    advancedOption.setName(SourceOption.NAME);
                    advancedOption.setValue(source);
                    return advancedOption;
                })
                .collect(Collectors.toList());

        List<AdvancedOption> newTargets = userTechnologies.getTargets().stream()
                .filter(target -> analysisContext.getAdvancedOptions().stream()
                        .filter(advancedOption -> advancedOption.getName().equals(TargetOption.NAME))
                        .filter(advancedOption -> advancedOption.getValue().equals(target))
                        .findAny()
                        .isEmpty()
                )
                .map(source -> {
                    AdvancedOption advancedOption = new AdvancedOption();
                    advancedOption.setName(TargetOption.NAME);
                    advancedOption.setValue(source);
                    return advancedOption;
                })
                .collect(Collectors.toList());

        ArrayList<AdvancedOption> advancedOptionsWithCustomTechnologies = new ArrayList<>(analysisContext.getAdvancedOptions());
        advancedOptionsWithCustomTechnologies.addAll(newSources);
        advancedOptionsWithCustomTechnologies.addAll(newTargets);

        analysisContext.setAdvancedOptions(advancedOptionsWithCustomTechnologies);

        // Prune no longer available source/targets from Advanced Options
        Set<String> availableSources = new HashSet<>();
        ruleProviderRegistryCache.getAvailableSourceTechnologies().forEach(s -> availableSources.add(s));
        userTechnologies.getSources().forEach(s -> availableSources.add(s));

        Set<String> availableTargets = new HashSet<>();
        ruleProviderRegistryCache.getAvailableTargetTechnologies().forEach(s -> availableTargets.add(s));
        userTechnologies.getTargets().forEach(s -> availableTargets.add(s));

        List<AdvancedOption> advancedOptionsPruned = analysisContext.getAdvancedOptions().stream()
                .filter(advancedOption -> !advancedOption.getName().equals(SourceOption.NAME) || availableSources.contains(advancedOption.getValue()))
                .filter(advancedOption -> !advancedOption.getName().equals(TargetOption.NAME) || availableTargets.contains(advancedOption.getValue()))
                .collect(Collectors.toList());

        analysisContext.setAdvancedOptions(advancedOptionsPruned);
    }
}
