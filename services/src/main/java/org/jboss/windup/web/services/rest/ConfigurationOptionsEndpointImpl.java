package org.jboss.windup.web.services.rest;

import org.jboss.forge.furnace.Furnace;
import org.jboss.windup.config.ConfigurationOption;
import org.jboss.windup.config.SkipReportsRenderingOption;
import org.jboss.windup.exec.configuration.WindupConfiguration;
import org.jboss.windup.exec.configuration.options.InputPathOption;
import org.jboss.windup.exec.configuration.options.OutputPathOption;
import org.jboss.windup.exec.configuration.options.OverwriteOption;
import org.jboss.windup.rules.apps.java.config.ExcludePackagesOption;
import org.jboss.windup.rules.apps.java.config.ScanPackagesOption;

import javax.inject.Inject;
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
}
