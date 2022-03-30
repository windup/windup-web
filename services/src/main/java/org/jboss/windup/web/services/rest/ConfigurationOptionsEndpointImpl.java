package org.jboss.windup.web.services.rest;

import org.jboss.windup.config.ConfigurationOption;
import org.jboss.windup.config.ValidationResult;
import org.jboss.windup.exec.configuration.options.*;
import org.jboss.windup.rules.apps.java.config.ExcludePackagesOption;
import org.jboss.windup.rules.apps.java.config.ScanPackagesOption;
import org.jboss.windup.web.furnaceserviceprovider.FromFurnace;
import org.jboss.windup.web.messaging.executor.ConfigurationOptionsService;
import org.jboss.windup.web.services.CustomSourceDelegator;
import org.jboss.windup.web.services.CustomTargetDelegator;
import org.jboss.windup.web.services.RuleProviderRegistryCache_UserProvidedGlobal;
import org.jboss.windup.web.services.RuleProviderRegistryCache_UserProvidedProject;
import org.jboss.windup.web.services.model.AdvancedOption;
import org.jboss.windup.web.services.model.AnalysisContext;

import javax.inject.Inject;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.ws.rs.NotFoundException;
import java.util.*;
import java.util.stream.Collectors;
import java.util.stream.Stream;

/**
 * @author <a href="mailto:jesse.sightler@gmail.com">Jesse Sightler</a>
 */
public class ConfigurationOptionsEndpointImpl implements ConfigurationOptionsEndpoint
{
    private static final Set<String> optionsToSkip = new HashSet<>(Arrays.asList(
            InputPathOption.NAME,
            OutputPathOption.NAME,
            OverwriteOption.NAME,
            ScanPackagesOption.NAME,
            ExcludePackagesOption.NAME,
            UserRulesDirectoryOption.NAME,
            UserLabelsDirectoryOption.NAME
    ));

    @Inject
    @FromFurnace
    private ConfigurationOptionsService configurationOptionsService;

    @PersistenceContext
    private EntityManager entityManager;

    @Inject
    RuleProviderRegistryCache_UserProvidedGlobal ruleProviderRegistryCache_userProvidedGlobal;

    @Inject
    RuleProviderRegistryCache_UserProvidedProject ruleProviderRegistryCache_userProvidedProject;

    @Override
    public List<ConfigurationOption> getAllOptions(Long analysisContextId)
    {
//        AnalysisContext analysisContext = null;
//        if (analysisContextId != null) {
//            analysisContext = entityManager.find(AnalysisContext.class, analysisContextId);
//            if (analysisContext == null) {
//                throw new NotFoundException("AnalysisContext with id" + analysisContextId + "not found");
//            }
//        }

        List<ConfigurationOption> result = new ArrayList<>();
        for (ConfigurationOption option : this.configurationOptionsService.getAllOptions())
        {
            if (optionsToSkip.contains(option.getName())) {
                continue;
            }

            result.add(option);
//
//            // Use custom Target and Source option
//            if (analysisContext != null && option.getName().equals(SourceOption.NAME)) {
//                result.add(getCustomSourceDelegator(analysisContext, (SourceOption) option));
//            } else if (analysisContext != null && option.getName().equals(TargetOption.NAME)) {
//                result.add(getCustomTargetDelegator(analysisContext, (TargetOption) option));
//            } else {
//                result.add(option);
//            }
        }

        return result;
    }

    @Override
    public ValidationResult validateOption(Long analysisContextId, AdvancedOption advancedOption)
    {
//        AnalysisContext analysisContext = null;
//        if (analysisContextId != null) {
//            analysisContext = entityManager.find(AnalysisContext.class, analysisContextId);
//            if (analysisContext == null) {
//                throw new NotFoundException("AnalysisContext with id" + analysisContextId + "not found");
//            }
//        }

        if (advancedOption == null)
            return new ValidationResult(ValidationResult.Level.ERROR, "No option specified");

        if (advancedOption.getName() == null)
            return new ValidationResult(ValidationResult.Level.ERROR, "No option name specified");

        ConfigurationOption configurationOption = this.configurationOptionsService.findConfigurationOption(advancedOption.getName());
        if (configurationOption == null)
            return new ValidationResult(ValidationResult.Level.ERROR, "Option not recognized");

//        // Use custom Target and Source option
//        if (configurationOption.getName().equals(SourceOption.NAME)) {
//            configurationOption = getCustomSourceDelegator(analysisContext, (SourceOption) configurationOption);
//        } else if (configurationOption.getName().equals(TargetOption.NAME)) {
//            configurationOption = getCustomTargetDelegator(analysisContext, (TargetOption) configurationOption);
//        }

        Object converted = this.configurationOptionsService.convertType(configurationOption, advancedOption.getValue());
        try
        {
            return configurationOption.validate(converted);
        } catch (Throwable t)
        {
            return new ValidationResult(ValidationResult.Level.ERROR, t.getMessage() == null ? "Invalid input" : t.getMessage());
        }
    }

    public CustomTargetDelegator getCustomTargetDelegator(AnalysisContext analysisContext, TargetOption option) {
        Set<String> globalAvailableTargets = ruleProviderRegistryCache_userProvidedGlobal.getAvailableTargetTechnologies();
        Set<String> projectAvailableTargets = ruleProviderRegistryCache_userProvidedProject.getAvailableTargetTechnologies(analysisContext);

        Set<String> availableTargetTechnologies = Stream
                .concat(globalAvailableTargets.stream(), projectAvailableTargets.stream())
                .collect(Collectors.toSet());

        return new CustomTargetDelegator(option, availableTargetTechnologies);
    }

    public CustomSourceDelegator getCustomSourceDelegator(AnalysisContext analysisContext, SourceOption option) {
        Set<String> globalAvailableSources = ruleProviderRegistryCache_userProvidedGlobal.getAvailableSourceTechnologies();
        Set<String> projectAvailableSources = ruleProviderRegistryCache_userProvidedProject.getAvailableSourceTechnologies(analysisContext);

        Set<String> availableTargetTechnologies = Stream
                .concat(globalAvailableSources.stream(), projectAvailableSources.stream())
                .collect(Collectors.toSet());

        return new CustomSourceDelegator(option, availableTargetTechnologies);
    }

}
