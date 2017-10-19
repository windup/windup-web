package org.jboss.windup.web.services.rest;

import org.jboss.windup.config.ConfigurationOption;
import org.jboss.windup.config.ValidationResult;
import org.jboss.windup.exec.configuration.options.InputPathOption;
import org.jboss.windup.exec.configuration.options.OutputPathOption;
import org.jboss.windup.exec.configuration.options.OverwriteOption;
import org.jboss.windup.exec.configuration.options.UserRulesDirectoryOption;
import org.jboss.windup.rules.apps.java.config.ExcludePackagesOption;
import org.jboss.windup.rules.apps.java.config.ScanPackagesOption;
import org.jboss.windup.web.furnaceserviceprovider.FromFurnace;
import org.jboss.windup.web.messaging.executor.ConfigurationOptionsService;
import org.jboss.windup.web.services.model.AdvancedOption;

import javax.inject.Inject;
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
            UserRulesDirectoryOption.NAME
    ));

    @Inject
    @FromFurnace
    private ConfigurationOptionsService configurationOptionsService;

    @Override
    public List<ConfigurationOption> getAllOptions()
    {
        return this.configurationOptionsService.getAllOptions()
                .stream()
                .filter((option) -> !optionsToSkip.contains(option.getName()))
                .collect(Collectors.toList());
    }

    @Override
    public ValidationResult validateOption(AdvancedOption advancedOption)
    {
        if (advancedOption == null)
            return new ValidationResult(ValidationResult.Level.ERROR, "No option specified");

        if (advancedOption.getName() == null)
            return new ValidationResult(ValidationResult.Level.ERROR, "No option name specified");

        ConfigurationOption configurationOption = this.configurationOptionsService.findConfigurationOption(advancedOption.getName());
        if (configurationOption == null)
            return new ValidationResult(ValidationResult.Level.ERROR, "Option not recognized");

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
