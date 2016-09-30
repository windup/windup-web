package org.jboss.windup.web.services.service;

import org.apache.commons.lang3.StringUtils;
import org.jboss.forge.furnace.Furnace;
import org.jboss.windup.config.ConfigurationOption;
import org.jboss.windup.config.InputType;
import org.jboss.windup.config.ValidationResult;
import org.jboss.windup.exec.configuration.WindupConfiguration;
import org.jboss.windup.web.services.model.AdvancedOption;

import javax.inject.Inject;
import java.io.File;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

/**
 * Contains methods for querying options, validating data against options, and converting data to the correct format that Windup expects.
 *
 * @author <a href="mailto:jesse.sightler@gmail.com">Jesse Sightler</a>
 */
public class ConfigurationOptionsService
{
    @Inject
    private Furnace furnace;

    /**
     * Gets all options supported by Windup.
     */
    public List<ConfigurationOption> getAllOptions()
    {
        ArrayList<ConfigurationOption> result = new ArrayList<>();

        for (ConfigurationOption option : WindupConfiguration.getWindupConfigurationOptions(furnace))
        {
            result.add(option);
        }

        return result;
    }

    /**
     * Finds the Windup core option with the given name.
     */
    public ConfigurationOption findConfigurationOption(String name)
    {
        for (ConfigurationOption option : WindupConfiguration.getWindupConfigurationOptions(furnace))
        {
            if (StringUtils.equals(option.getName(), name))
                return option;
        }
        return null;
    }

    /**
     * Converts the given String into the type required by Windup core.
     */
    public Object convertType(ConfigurationOption option, String value)
    {
        Object converted;

        if (String.class.isAssignableFrom(option.getType()))
            converted = value;
        else if (Boolean.class.isAssignableFrom(option.getType()))
            converted = Boolean.parseBoolean(value);
        else if (File.class.isAssignableFrom(option.getType()))
            converted = new File(value);
        else if (Path.class.isAssignableFrom(option.getType()))
            converted = Paths.get(value);
        else if (Integer.class.isAssignableFrom(option.getType()))
            converted = Integer.valueOf(value);
        else
            converted = value;

        if (InputType.MANY.equals(option.getUIType()) || InputType.SELECT_MANY.equals(option.getUIType()))
            return Collections.singletonList(converted);
        else
            return converted;
    }
}
