package org.jboss.windup.web.services.rest;

import org.jboss.windup.config.ConfigurationOption;
import org.jboss.windup.config.ValidationResult;
import org.jboss.windup.exec.configuration.options.InputPathOption;
import org.jboss.windup.exec.configuration.options.OutputPathOption;
import org.jboss.windup.exec.configuration.options.OverwriteOption;
import org.jboss.windup.exec.configuration.options.SourceOption;
import org.jboss.windup.exec.configuration.options.TargetOption;
import org.jboss.windup.exec.configuration.options.UserLabelsDirectoryOption;
import org.jboss.windup.exec.configuration.options.UserRulesDirectoryOption;
import org.jboss.windup.rules.apps.java.config.ExcludePackagesOption;
import org.jboss.windup.rules.apps.java.config.ScanPackagesOption;
import org.jboss.windup.web.furnaceserviceprovider.FromFurnace;
import org.jboss.windup.web.messaging.executor.ConfigurationOptionsService;
import org.jboss.windup.web.services.SourceTargetTechnologies;
import org.jboss.windup.web.services.model.AdvancedOption;
import org.jboss.windup.web.services.model.AnalysisContext;
import org.jboss.windup.web.services.model.PathType;
import org.jboss.windup.web.services.model.RulesPath;
import org.jboss.windup.web.services.service.AnalysisContextService;
import org.jboss.windup.web.services.service.RulesPathService;

import javax.inject.Inject;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

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

    @Inject
    private AnalysisContextService analysisContextService;

    @Inject
    private RulesPathService rulesPathService;

    @Override
    public List<ConfigurationOption> getAllOptions()
    {
        List<ConfigurationOption> result = new ArrayList<>();
        for (ConfigurationOption option : this.configurationOptionsService.getAllOptions())
        {
            if (optionsToSkip.contains(option.getName()))
                continue;

            result.add(option);
        }
        return result;
    }

    @Override
    public ValidationResult validateOption(Long analysisContextId, AdvancedOption advancedOption)
    {
        SourceTargetTechnologies sourceTargetTechnologies = null;
        if (analysisContextId != null) {
            AnalysisContext analysisContext = analysisContextService.get(analysisContextId);
            List<RulesPath> userProvidedRulesPaths = analysisContext.getRulesPaths().stream()
                    .filter(rulesPath -> rulesPath.getRulesPathType().equals(PathType.USER_PROVIDED))
                    .collect(Collectors.toList());
            sourceTargetTechnologies = rulesPathService.getSourceTargetTechnologies(userProvidedRulesPaths);
        }

        if (advancedOption == null)
            return new ValidationResult(ValidationResult.Level.ERROR, "No option specified");

        if (advancedOption.getName() == null)
            return new ValidationResult(ValidationResult.Level.ERROR, "No option name specified");

        ConfigurationOption configurationOption = this.configurationOptionsService.findConfigurationOption(advancedOption.getName());
        if (configurationOption == null)
            return new ValidationResult(ValidationResult.Level.ERROR, "Option not recognized");

        // Validate against custom source/target
        if (sourceTargetTechnologies != null) {
            if (configurationOption.getName().equals(SourceOption.NAME) && sourceTargetTechnologies.getSources().contains(advancedOption.getValue())) {
                return ValidationResult.SUCCESS;
            } else if (configurationOption.getName().equals(TargetOption.NAME) && sourceTargetTechnologies.getTargets().contains(advancedOption.getValue())) {
                return ValidationResult.SUCCESS;
            }
        }

        Object converted = this.configurationOptionsService.convertType(configurationOption, advancedOption.getValue());
        try
        {
            return configurationOption.validate(converted);
        } catch (Throwable t)
        {
            return new ValidationResult(ValidationResult.Level.ERROR, t.getMessage() == null ? "Invalid input" : t.getMessage());
        }
    }
}
