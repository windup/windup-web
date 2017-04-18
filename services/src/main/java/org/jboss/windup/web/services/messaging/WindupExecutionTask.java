package org.jboss.windup.web.services.messaging;

import java.io.File;
import java.io.IOException;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.*;
import java.util.logging.Level;
import java.util.logging.Logger;
import java.util.stream.Collectors;

import javax.enterprise.inject.Instance;
import javax.inject.Inject;

import org.apache.commons.io.FileUtils;
import org.jboss.forge.furnace.Furnace;
import org.jboss.windup.config.ConfigurationOption;
import org.jboss.windup.web.addons.websupport.WebPathUtil;
import org.jboss.windup.web.addons.websupport.services.WindupExecutorService;
import org.jboss.windup.web.furnaceserviceprovider.FromFurnace;
import org.jboss.windup.web.services.WindupWebProgressMonitor;
import org.jboss.windup.web.services.model.*;
import org.jboss.windup.web.services.model.Package;
import org.jboss.windup.web.services.service.ConfigurationOptionsService;

/**
 * Contains code for executing Windup and managing the status information from the process.
 *
 * @author <a href="mailto:jesse.sightler@gmail.com">Jesse Sightler</a>
 */
public class WindupExecutionTask implements Runnable
{
    private static Logger LOG = Logger.getLogger(WindupExecutionTask.class.getName());

    @Inject
    @FromFurnace
    private WindupExecutorService windupExecutorService;

    @Inject
    private Instance<WindupWebProgressMonitor> progressMonitorInstance;

    @Inject
    @FromFurnace
    private WebPathUtil webPathUtil;

    @Inject
    private Furnace furnace;


    @Inject
    private ConfigurationOptionsService configurationOptionsService;

    private WindupExecution execution;
    private AnalysisContext analysisContext;

    public void init(WindupExecution execution, AnalysisContext context)
    {
        this.execution = execution;
        this.analysisContext = context;
    }

    @Override
    public void run()
    {
        if (this.execution.getState() == ExecutionState.CANCELLED) {
            return;
        }

        if (this.analysisContext == null)
        {
            throw new IllegalArgumentException("AnalysisContext must be initialized first");
        }

        WindupWebProgressMonitor progressMonitor = progressMonitorInstance.get();
        progressMonitor.setExecution(this.execution);

        try
        {
            Path reportOutputPath = Paths.get(this.execution.getOutputPath());

            // Clean out the output directory first
            try
            {
                FileUtils.deleteDirectory(new File(this.execution.getOutputPath()));
            }
            catch (IOException e)
            {
                LOG.warning("Failed to delete output directory: " + this.execution.getOutputPath() + ", due to: " + e.getMessage());
            }

            Collection<Path> rulesPaths = analysisContext.getRulesPaths().stream()
                        .map((rulesPath) -> Paths.get(rulesPath.getPath()))
                        .collect(Collectors.toList());

            List<Path> inputPaths = this.analysisContext
                        .getApplications()
                        .stream()
                        .map(application -> Paths.get(application.getInputPath()))
                        .collect(Collectors.toList());

            if (inputPaths.size() == 0)
            {
                throw new RuntimeException("InputPaths collection is empty - cannot execute windup without any input.");
            }

            List<String> includePackages = Collections.emptyList();
            List<String> excludePackages = Collections.emptyList();
            String source = null;
            String target = null;

            if (analysisContext.getIncludePackages() != null)
            {
                includePackages = this.getPackagesAsString(analysisContext.getIncludePackages());
            }

            if (analysisContext.getExcludePackages() != null)
            {
                excludePackages = this.getPackagesAsString(analysisContext.getExcludePackages());
            }

            MigrationPath migrationPath = analysisContext.getMigrationPath();
            if (migrationPath != null)
            {
                if (migrationPath.getSource() != null)
                    source = migrationPath.getSource().toString();

                if (migrationPath.getTarget() != null)
                    target = migrationPath.getTarget().toString();
            }

            Map<String, Object> otherOptions = getOtherOptions(analysisContext);

            boolean generateStaticReports = analysisContext.getGenerateStaticReports();

            windupExecutorService.execute(
                        progressMonitor,
                        rulesPaths,
                        inputPaths,
                        reportOutputPath,
                        includePackages,
                        excludePackages,
                        source,
                        target,
                        otherOptions,
                        generateStaticReports);

            // reload the current state
            progressMonitor.done();
        }
        catch (Exception e)
        {
            progressMonitor.setFailed();
            execution.setTimeCompleted(new GregorianCalendar());
            LOG.log(Level.WARNING, "Processing of execution " + this.execution + " failed due to: " + e.getMessage(), e);
            throw new RuntimeException(e);
        }
    }

    private List<String> getPackagesAsString(Collection<Package> packages) {
        return packages.stream().map(Package::getFullName)
                .collect(Collectors.toList());
    }

    private Map<String, Object> getOtherOptions(AnalysisContext analysisContext)
    {
        if (analysisContext == null || analysisContext.getAdvancedOptions() == null)
            return Collections.emptyMap();

        Map<String, Object> result = new HashMap<>();
        for (AdvancedOption advancedOption : analysisContext.getAdvancedOptions())
        {
            String name = advancedOption.getName();
            ConfigurationOption configurationOption = this.configurationOptionsService.findConfigurationOption(name);
            if (configurationOption == null)
            {
                LOG.warning("Ignoring unrecognized advanced option: " + name);
                continue;
            }

            /*
             * This item could be either a single item or an iterable (with a single item).
             */
            Object value = this.configurationOptionsService.convertType(configurationOption, advancedOption.getValue());

            Object previousValue = result.get(name);
            if (previousValue != null)
            {
                /*
                 * We have seen an item of this value before, so it must be switched to a list now.
                 */
                if (!(previousValue instanceof List))
                {
                    List<Object> list = new ArrayList<>();
                    list.add(previousValue);
                    result.put(name, list);
                }

                /*
                 * The new item is also a list, so add all of them to the previous one.
                 */
                if (value instanceof Iterable)
                {
                    for (Object iterableItem : (Iterable)value)
                    {
                        ((List<Object>) previousValue).add(iterableItem);
                    }
                } else
                {
                    // Single item to add to previous list.
                    ((List<Object>) previousValue).add(value);
                }
            }
            else
            {
                result.put(name, value);
            }
        }
        return result;
    }

}
