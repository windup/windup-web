package org.jboss.windup.web.services;

import org.jboss.forge.furnace.Furnace;
import org.jboss.windup.config.RuleProvider;
import org.jboss.windup.config.loader.RuleLoader;
import org.jboss.windup.config.loader.RuleLoaderContext;
import org.jboss.windup.config.metadata.RuleProviderRegistry;
import org.jboss.windup.config.metadata.TechnologyReference;
import org.jboss.windup.config.metadata.TechnologyReferenceAliasTranslator;
import org.jboss.windup.config.metadata.TechnologyReferenceAliasTranslatorLoader;

import javax.ejb.Singleton;
import javax.inject.Inject;
import java.nio.file.Path;
import java.util.*;
import java.util.logging.Level;
import java.util.logging.Logger;
import java.util.stream.Collectors;

@Singleton
public class RuleProviderRegistryCache_UserProvidedGlobal {

    private static Logger LOG = Logger.getLogger(RuleProviderRegistryCache_UserProvidedGlobal.class.getCanonicalName());

    @Inject
    private Furnace furnace;

    @Inject
    private TechnologyReferenceAliasTranslatorLoader loader;

    private List<TechnologyReferenceAliasTranslator> cachedTranslators;
    private RuleProviderRegistry cachedRegistry;
    private Set<Path> userRulesPaths = new LinkedHashSet<>();

    public void addUserRulesPath(Path path) {
        this.cachedRegistry = null;
        this.cachedTranslators = null;
        userRulesPaths.add(path);
    }

    public void removeUserRulesPath(Path path) {
        this.cachedRegistry = null;
        this.cachedTranslators = null;
        userRulesPaths = userRulesPaths.stream()
                .filter(p -> !p.normalize().toString().equals(path.normalize().toString()))
                .collect(Collectors.toSet());
    }

    public RuleProviderRegistry getRuleProviderRegistry() {
        this.cachedRegistry = null;
        try {
            Set<Path> defaultRulePaths = new HashSet<>(this.userRulesPaths);

            RuleLoaderContext ruleLoaderContext = new RuleLoaderContext(defaultRulePaths, null);
            getRuleProviderRegistry(ruleLoaderContext);
        } catch (Exception e) {
            LOG.log(Level.SEVERE, "Failed to load rule information due to: " + e.getMessage(), e);
        }
        return cachedRegistry;
    }

    public Set<String> getAvailableSourceTechnologies() {
        Set<TechnologyReference> sourceOptions = new HashSet<>();
        RuleProviderRegistry registry = getRuleProviderRegistry();
        if (registry == null)
            return Collections.emptySet();

        for (RuleProvider provider : registry.getProviders()) {
            sourceOptions.addAll(provider.getMetadata().getSourceTechnologies());
        }

        addTransformers(sourceOptions);
        return sourceOptions.stream().map(TechnologyReference::getId).collect(Collectors.toSet());
    }

    public Set<String> getAvailableTargetTechnologies() {
        Set<TechnologyReference> targetOptions = new HashSet<>();
        RuleProviderRegistry registry = getRuleProviderRegistry();
        if (registry == null)
            return Collections.emptySet();

        for (RuleProvider provider : registry.getProviders()) {
            targetOptions.addAll(provider.getMetadata().getTargetTechnologies());
        }

        addTransformers(targetOptions);
        return targetOptions.stream().map(TechnologyReference::getId).collect(Collectors.toSet());
    }

    private RuleProviderRegistry getRuleProviderRegistry(RuleLoaderContext ruleLoaderContext) {
        initCaches(ruleLoaderContext);
        return this.cachedRegistry;
    }

    private void initCaches(RuleLoaderContext ruleLoaderContext) {
        RuleLoader ruleLoader = furnace.getAddonRegistry().getServices(RuleLoader.class).get();

        List<TechnologyReferenceAliasTranslator> transformerList = new ArrayList<>(loader.loadTranslators(ruleLoaderContext));

        this.cachedRegistry = ruleLoader.loadConfiguration(ruleLoaderContext);
        this.cachedTranslators = transformerList;
    }

    private void addTransformers(Set<TechnologyReference> techs) {
        techs.addAll(getTechnologyAliasTranslators()
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

    private List<TechnologyReferenceAliasTranslator> getTechnologyAliasTranslators() {
        return this.cachedTranslators;
    }
}
