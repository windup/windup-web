package org.jboss.windup.web.services;

import org.jboss.forge.furnace.Furnace;
import org.jboss.windup.config.RuleProvider;
import org.jboss.windup.config.loader.RuleLoader;
import org.jboss.windup.config.loader.RuleLoaderContext;
import org.jboss.windup.config.metadata.*;

import javax.annotation.PostConstruct;
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

    private RuleLoader ruleLoader;
    private Set<Path> userRulesPaths = new LinkedHashSet<>();

    private volatile RuleProviderRegistry cachedRegistry;
    private volatile List<TechnologyReferenceAliasTranslator> cachedTranslators;

    @PostConstruct
    public void init() {
        ruleLoader = furnace.getAddonRegistry().getServices(RuleLoader.class).get();
    }

    public void setUserRulesPath(Set<Path> paths) {
        clearCache();
        userRulesPaths = paths;
    }

    public void addUserRulesPath(Path path) {
        clearCache();
        userRulesPaths.add(path);
    }

    public void removeUserRulesPath(Path path) {
        clearCache();
        userRulesPaths = userRulesPaths.stream()
                .filter(p -> !p.normalize().toString().equals(path.normalize().toString()))
                .collect(Collectors.toSet());
    }

    private void clearCache() {
        cachedRegistry = null;
        cachedTranslators = null;
    }

    public Set<String> getAvailableSourceTechnologies() {
        Set<TechnologyReference> sourceOptions = new HashSet<>();
        RuleProviderRegistry registry = getRuleProviderRegistry();
        if (registry == null) {
            return Collections.emptySet();
        }

        for (RuleProvider provider : registry.getProviders()) {
            sourceOptions.addAll(provider.getMetadata().getSourceTechnologies());
        }

        addTransformers(sourceOptions);
        return sourceOptions.stream().map(TechnologyReference::getId).collect(Collectors.toSet());
    }

    public Set<String> getAvailableTargetTechnologies() {
        Set<TechnologyReference> targetOptions = new HashSet<>();
        RuleProviderRegistry registry = getRuleProviderRegistry();
        if (registry == null) {
            return Collections.emptySet();
        }

        for (RuleProvider provider : registry.getProviders()) {
            targetOptions.addAll(provider.getMetadata().getTargetTechnologies());
        }

        addTransformers(targetOptions);
        return targetOptions.stream().map(TechnologyReference::getId).collect(Collectors.toSet());
    }

    private void addTransformers(Set<TechnologyReference> techs) {
        List<TechnologyReferenceAliasTranslator> transformerList = getTranslators();

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

    private RuleProviderRegistry getRuleProviderRegistry() {
        if (cachedRegistry == null) {
            synchronized (this) {
                if (cachedRegistry == null) {
                    try {
                        RuleLoaderContext ruleLoaderContext = new RuleLoaderContext(userRulesPaths, null);
                        cachedRegistry = ruleLoader.loadConfiguration(ruleLoaderContext);
                    } catch (Exception e) {
                        LOG.log(Level.WARNING, "Failed to load rule information due to: " + e.getMessage(), e);
                    }
                }
            }
        }

        return cachedRegistry;
    }

    private List<TechnologyReferenceAliasTranslator> getTranslators() {
        if (cachedTranslators == null) {
            synchronized (this) {
                if (cachedTranslators == null) {
                    RuleLoaderContext ruleLoaderContext = new RuleLoaderContext(userRulesPaths, null);
                    Collection<TechnologyReferenceAliasTranslator> technologyReferenceAliasTranslators = loader.loadTranslators(ruleLoaderContext);
                    cachedTranslators = new ArrayList<>(technologyReferenceAliasTranslators);
                }
            }
        }

        return cachedTranslators;
    }

}
