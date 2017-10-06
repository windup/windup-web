package org.jboss.windup.web.messaging.executor;

import org.jboss.windup.config.ConfigurationOption;

import java.util.List;

/**
 * Contains methods for querying options, validating data against options, and converting data to the correct format that Windup expects.
 *
 * @author <a href="mailto:jesse.sightler@gmail.com">Jesse Sightler</a>
 */
public interface ConfigurationOptionsService
{
    /**
     * Gets all options supported by Windup.
     */
    List<ConfigurationOption> getAllOptions();

    /**
     * Finds the Windup core option with the given name.
     */
    ConfigurationOption findConfigurationOption(String name);

    /**
     * Converts the given String into the type required by Windup core.
     */
    Object convertType(ConfigurationOption option, String value);
}
