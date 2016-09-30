package org.jboss.windup.web.services.rest;

import org.apache.commons.lang3.StringUtils;
import org.jboss.forge.furnace.Furnace;
import org.jboss.windup.config.ConfigurationOption;
import org.jboss.windup.config.SkipReportsRenderingOption;
import org.jboss.windup.config.ValidationResult;
import org.jboss.windup.exec.configuration.WindupConfiguration;
import org.jboss.windup.exec.configuration.options.InputPathOption;
import org.jboss.windup.exec.configuration.options.OutputPathOption;
import org.jboss.windup.exec.configuration.options.OverwriteOption;
import org.jboss.windup.rules.apps.java.config.ExcludePackagesOption;
import org.jboss.windup.rules.apps.java.config.ScanPackagesOption;
import org.jboss.windup.web.services.model.AdvancedOption;

import javax.inject.Inject;
import java.io.File;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

/**
 * @author <a href="mailto:jesse.sightler@gmail.com">Jesse Sightler</a>
 */
public class ConfigurationOptionsEndpointImpl implements ConfigurationOptionsEndpoint
{
    private static final Set<String> optionsToSkip = new HashSet<>(Arrays.asList(new String[] {
            InputPathOption.NAME,
            OutputPathOption.NAME,
            OverwriteOption.NAME,
            ScanPackagesOption.NAME,
            ExcludePackagesOption.NAME,
    }));

    @Inject
    private Furnace furnace;

    @Override
    public List<ConfigurationOption> getAdvancedOptions()
    {
        ArrayList<ConfigurationOption> result = new ArrayList<>();

        for (ConfigurationOption option : WindupConfiguration.getWindupConfigurationOptions(furnace))
        {
            if (!optionsToSkip.contains(option.getName()))
                result.add(option);
        }

        return result;
    }

    @Override
    public ValidationResult validateOption(AdvancedOption advancedOption)
    {
        if (advancedOption == null)
            return new ValidationResult(ValidationResult.Level.ERROR, "No option specified");

        if (advancedOption.getName() == null)
            return new ValidationResult(ValidationResult.Level.ERROR, "No option name specified");

        for (ConfigurationOption option : WindupConfiguration.getWindupConfigurationOptions(furnace))
        {
            if (StringUtils.equals(option.getName(), advancedOption.getName()))
                return option.validate(convertType(option, advancedOption.getValue()));
        }

        return new ValidationResult(ValidationResult.Level.ERROR, "Option not found!");
    }

    private Object convertType(ConfigurationOption option, String value) {
        if (String.class.isAssignableFrom(option.getType()))
            return value;
        else if (Boolean.class.isAssignableFrom(option.getType()))
            return Boolean.parseBoolean(value);
        else if (File.class.isAssignableFrom(option.getType()))
            return new File(value);
        else if (Path.class.isAssignableFrom(option.getType()))
            return Paths.get(value);
        else if (Integer.class.isAssignableFrom(option.getType()))
            return Integer.valueOf(value);
        else
            return value;
    }
}
