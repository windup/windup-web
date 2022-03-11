package org.jboss.windup.web.services;

import org.jboss.forge.furnace.Furnace;
import org.jboss.windup.config.RuleProvider;
import org.jboss.windup.config.loader.RuleLoader;
import org.jboss.windup.config.loader.RuleLoaderContext;
import org.jboss.windup.config.metadata.RuleProviderRegistry;
import org.jboss.windup.config.metadata.TechnologyReference;
import org.jboss.windup.config.metadata.TechnologyReferenceAliasTranslator;
import org.jboss.windup.config.metadata.TechnologyReferenceAliasTranslatorLoader;
import org.jboss.windup.web.services.model.AnalysisContext;

import javax.ejb.Singleton;
import javax.inject.Inject;
import java.nio.file.Path;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.logging.Level;
import java.util.logging.Logger;
import java.util.stream.Collectors;

@Singleton
public class RuleProviderRegistryCache_UserProvidedProject {

    private static Logger LOG = Logger.getLogger(RuleProviderRegistryCache_UserProvidedProject.class.getCanonicalName());

    @Inject
    private Furnace furnace;

//    @Inject
//    @FromFurnace
//    private RuleLoader ruleLoader;

    private final Map<AnalysisContext, List<TechnologyReferenceAliasTranslator>> cachedTranslators = new ConcurrentHashMap<>();
    private final Map<AnalysisContext, RuleProviderRegistry> cachedRegistry = new ConcurrentHashMap<>();
    private final Map<AnalysisContext, Set<Path>> userRulesPaths = new ConcurrentHashMap<>();

    public void setUserRulesPath(AnalysisContext analysisContext, Collection<Path> paths) {
        cachedRegistry.remove(analysisContext);
        cachedTranslators.remove(analysisContext);

        userRulesPaths.put(analysisContext, new LinkedHashSet<>(paths));
    }

    public Set<String> getAvailableSourceTechnologies(AnalysisContext analysisContext) {
        Set<TechnologyReference> sourceOptions = new HashSet<>();
        RuleProviderRegistry registry = getRuleProviderRegistry(analysisContext);
        if (registry == null)
            return Collections.emptySet();

        for (RuleProvider provider : registry.getProviders()) {
            sourceOptions.addAll(provider.getMetadata().getSourceTechnologies());
        }

        addTransformers(analysisContext, sourceOptions);
        return sourceOptions.stream().map(TechnologyReference::getId).collect(Collectors.toSet());
    }

    public Set<String> getAvailableTargetTechnologies(AnalysisContext analysisContext) {
        Set<TechnologyReference> targetOptions = new HashSet<>();
        RuleProviderRegistry registry = getRuleProviderRegistry(analysisContext);
        if (registry == null)
            return Collections.emptySet();

        for (RuleProvider provider : registry.getProviders()) {
            targetOptions.addAll(provider.getMetadata().getTargetTechnologies());
        }

        addTransformers(analysisContext, targetOptions);
        return targetOptions.stream().map(TechnologyReference::getId).collect(Collectors.toSet());
    }

    public RuleProviderRegistry getRuleProviderRegistry(AnalysisContext analysisContext) {
        cachedRegistry.remove(analysisContext);
        try {
            Set<Path> defaultRulePaths = new HashSet<>(this.userRulesPaths.getOrDefault(analysisContext, Collections.emptySet()));

            RuleLoaderContext ruleLoaderContext = new RuleLoaderContext(defaultRulePaths, null);
            getRuleProviderRegistry(analysisContext, ruleLoaderContext);
        } catch (Exception e) {
            LOG.log(Level.SEVERE, "Failed to load rule information due to: " + e.getMessage(), e);
        }
        return cachedRegistry.get(analysisContext);
    }

    private RuleProviderRegistry getRuleProviderRegistry(AnalysisContext analysisContext, RuleLoaderContext ruleLoaderContext) {
        initCaches(analysisContext, ruleLoaderContext);
        return this.cachedRegistry.get(analysisContext);
    }

    private void initCaches(AnalysisContext analysisContext, RuleLoaderContext ruleLoaderContext) {
        RuleLoader ruleLoader = furnace.getAddonRegistry().getServices(RuleLoader.class).get();

        List<TechnologyReferenceAliasTranslator> transformerList = new ArrayList<>();
        Iterable<TechnologyReferenceAliasTranslatorLoader> loaders = furnace.getAddonRegistry().getServices(TechnologyReferenceAliasTranslatorLoader.class);
        loaders.forEach((loader) -> transformerList.addAll(loader.loadTranslators(ruleLoaderContext)));

        this.cachedRegistry.put(analysisContext, ruleLoader.loadConfiguration(ruleLoaderContext));
        this.cachedTranslators.put(analysisContext, transformerList);
    }

    private void addTransformers(AnalysisContext analysisContext, Set<TechnologyReference> techs) {
        techs.addAll(getTechnologyAliasTranslators(analysisContext)
                .stream()

                // Only include it if the target of the transformation will match one of the items
                //   already in the list.
                .filter(transformer -> {
                    for (TechnologyReference originalTech : techs) {
                        if (originalTech.matches(transformer.getTargetTechnology())) {
                            return true;
                        }
                    }
                    return false;
                })

                .map(TechnologyReferenceAliasTranslator::getOriginalTechnology)
                .collect(Collectors.toList()));
    }

    private List<TechnologyReferenceAliasTranslator> getTechnologyAliasTranslators(AnalysisContext analysisContext) {
        return this.cachedTranslators.get(analysisContext);
    }
}
