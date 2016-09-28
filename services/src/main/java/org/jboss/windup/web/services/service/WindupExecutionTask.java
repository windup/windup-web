package org.jboss.windup.web.services.service;

import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Collections;
import java.util.GregorianCalendar;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.logging.Level;
import java.util.logging.Logger;
import java.util.stream.Collectors;

import javax.enterprise.inject.Instance;
import javax.inject.Inject;

import org.jboss.windup.web.addons.websupport.services.WindupExecutorService;
import org.jboss.windup.web.furnaceserviceprovider.FromFurnace;
import org.jboss.windup.web.services.WindupWebProgressMonitor;
import org.jboss.windup.web.services.model.AdvancedOption;
import org.jboss.windup.web.services.model.AnalysisContext;
import org.jboss.windup.web.services.model.ApplicationGroup;
import org.jboss.windup.web.services.model.MigrationPath;
import org.jboss.windup.web.services.model.WindupExecution;

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

    private WindupExecution execution;
    private ApplicationGroup group;

    /**
     * The {@link ApplicationGroup} to execute.
     */
    public void init(WindupExecution execution, ApplicationGroup group)
    {
        this.execution = execution;
        this.group = group;
    }

    @Override
    public void run()
    {
        if (this.group == null)
            throw new IllegalArgumentException("The group must be initialized by calling setGroup() with a non-null value first!");

        WindupWebProgressMonitor progressMonitor = progressMonitorInstance.get();
        progressMonitor.setExecution(this.execution);

        AnalysisContext analysisContext = group.getAnalysisContext();
        try
        {
            Collection<Path> rulesPaths = analysisContext.getRulesPaths().stream()
                        .map((rulesPath) -> Paths.get(rulesPath.getPath()))
                        .collect(Collectors.toList());

            List<Path> inputPaths = group
                        .getApplications()
                        .stream()
                        .map(application -> Paths.get(application.getInputPath()))
                        .collect(Collectors.toList());

            List<String> packages = Collections.emptyList();
            List<String> excludePackages = Collections.emptyList();
            String source = null;
            String target = null;

            if (analysisContext.getPackages() != null)
                packages = new ArrayList<>(analysisContext.getPackages());

            if (analysisContext.getExcludePackages() != null)
                excludePackages = new ArrayList<>(analysisContext.getExcludePackages());

            MigrationPath migrationPath = analysisContext.getMigrationPath();
            if (migrationPath != null)
            {
                if (migrationPath.getSource() != null)
                    source = migrationPath.getSource().toString();

                if (migrationPath.getTarget() != null)
                    target = migrationPath.getTarget().toString();
            }

            Map<String, Object> otherOptions = new HashMap<>();
            if (analysisContext.getAdvancedOptions() != null)
            {
                for (AdvancedOption advancedOption : analysisContext.getAdvancedOptions())
                {
                    String name = advancedOption.getName();
                    Object value = advancedOption.getValue();

                    Object previousValue = otherOptions.get(name);
                    if (previousValue != null)
                    {
                        if (!(previousValue instanceof List))
                        {
                            previousValue = new ArrayList<>(Collections.singleton(previousValue));
                            otherOptions.put(name, previousValue);
                        }
                        ((List<Object>) previousValue).add(value);
                    }
                    else
                    {
                        otherOptions.put(name, value);
                    }
                }
            }

            windupExecutorService.execute(
                        progressMonitor,
                        rulesPaths,
                        inputPaths,
                        Paths.get(group.getOutputPath()),
                        packages,
                        excludePackages,
                        source,
                        target,
                        otherOptions);

            // reload the current state
            progressMonitor.done();
        }
        catch (Exception e)
        {
            progressMonitor.setFailed();
            execution.setTimeCompleted(new GregorianCalendar());
            LOG.log(Level.WARNING, "Processing of " + group + " failed due to: " + e.getMessage(), e);
            throw new RuntimeException(e);
        }
    }

}
