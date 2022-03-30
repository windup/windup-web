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

import javax.annotation.PostConstruct;
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

    @Inject
    private TechnologyReferenceAliasTranslatorLoader loader;

    private RuleLoader ruleLoader;
    private final Map<AnalysisContext, Set<Path>> userRulesPaths = new ConcurrentHashMap<>();

    private final Map<AnalysisContext, RuleProviderRegistry> cachedRegistry = new ConcurrentHashMap<>();
    private final Map<AnalysisContext, List<TechnologyReferenceAliasTranslator>> cachedTranslators = new ConcurrentHashMap<>();

    @PostConstruct
    public void init() {
        ruleLoader = furnace.getAddonRegistry().getServices(RuleLoader.class).get();
    }

    public void setUserRulesPath(AnalysisContext analysisContext, Collection<Path> paths) {
        cachedRegistry.remove(analysisContext);
        cachedTranslators.remove(analysisContext);

        userRulesPaths.put(analysisContext, new LinkedHashSet<>(paths));
    }

    public Set<String> getAvailableSourceTechnologies(AnalysisContext analysisContext) {
        Set<TechnologyReference> sourceOptions = new HashSet<>();
        RuleProviderRegistry registry = getRuleProviderRegistry(analysisContext);
        if (registry == null) {
            return Collections.emptySet();
        }

        for (RuleProvider provider : registry.getProviders()) {
            sourceOptions.addAll(provider.getMetadata().getSourceTechnologies());
        }

        addTransformers(analysisContext, sourceOptions);
        return sourceOptions.stream().map(TechnologyReference::getId).collect(Collectors.toSet());
    }

    public Set<String> getAvailableTargetTechnologies(AnalysisContext analysisContext) {
        Set<TechnologyReference> targetOptions = new HashSet<>();
        RuleProviderRegistry registry = getRuleProviderRegistry(analysisContext);
        if (registry == null) {
            return Collections.emptySet();
        }

        for (RuleProvider provider : registry.getProviders()) {
            targetOptions.addAll(provider.getMetadata().getTargetTechnologies());
        }

        addTransformers(analysisContext, targetOptions);
        return targetOptions.stream().map(TechnologyReference::getId).collect(Collectors.toSet());
    }

    private void addTransformers(AnalysisContext analysisContext, Set<TechnologyReference> techs) {
        List<TechnologyReferenceAliasTranslator> transformerList = getTranslators(analysisContext);

        techs.addAll(transformerList
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

    private RuleProviderRegistry getRuleProviderRegistry(AnalysisContext analysisContext) {
        if (!cachedRegistry.containsKey(analysisContext)) {
            synchronized (this) {
                if (!cachedRegistry.containsKey(analysisContext)) {
                    try {
                        Set<Path> paths = userRulesPaths.getOrDefault(analysisContext, Collections.emptySet());
                        RuleLoaderContext ruleLoaderContext = new RuleLoaderContext(paths, null);
                        RuleProviderRegistry ruleProviderRegistry = ruleLoader.loadConfiguration(ruleLoaderContext);
                        cachedRegistry.put(analysisContext, ruleProviderRegistry);
                    } catch (Exception e) {
                        LOG.log(Level.WARNING, "Failed to load rule information due to: " + e.getMessage(), e);
                    }
                }
            }
        }

        return cachedRegistry.get(analysisContext);
    }

    private List<TechnologyReferenceAliasTranslator> getTranslators(AnalysisContext analysisContext) {
        if (!cachedTranslators.containsKey(analysisContext)) {
            synchronized (this) {
                if (!cachedTranslators.containsKey(analysisContext)) {
                    Set<Path> paths = userRulesPaths.getOrDefault(analysisContext, Collections.emptySet());
                    RuleLoaderContext ruleLoaderContext = new RuleLoaderContext(paths, null);
                    Collection<TechnologyReferenceAliasTranslator> technologyReferenceAliasTranslators = loader.loadTranslators(ruleLoaderContext);
                    cachedTranslators.put(analysisContext, new ArrayList<>(technologyReferenceAliasTranslators));
                }
            }
        }

        return cachedTranslators.get(analysisContext);
    }
}
