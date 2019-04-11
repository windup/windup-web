package org.jboss.windup.web.messaging.executor;

import java.io.File;
import java.io.IOException;
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

import javax.enterprise.inject.Instance;
import javax.inject.Inject;

import org.apache.commons.io.FileUtils;
import org.jboss.forge.furnace.Furnace;
import org.jboss.windup.config.ConfigurationOption;
import org.jboss.windup.exec.configuration.options.ExplodedAppInputOption;
import org.jboss.windup.util.PathUtil;
import org.jboss.windup.web.addons.websupport.WebPathUtil;
import org.jboss.windup.web.addons.websupport.services.WindupExecutorService;
import org.jboss.windup.web.services.model.AdvancedOption;
import org.jboss.windup.web.services.model.AnalysisContext;
import org.jboss.windup.web.services.model.ExecutionState;
import org.jboss.windup.web.services.model.MigrationPath;
import org.jboss.windup.web.services.model.Package;
import org.jboss.windup.web.services.model.RegisteredApplication;
import org.jboss.windup.web.services.model.RulesPath;
import org.jboss.windup.web.services.model.WindupExecution;

/**
 * @author <a href="mailto:jesse.sightler@gmail.com">Jesse Sightler</a>
 */
public class DefaultWindupExecutionTask implements WindupExecutionTask
{
    private static Logger LOG = Logger.getLogger(WindupExecutionTask.class.getName());

    private static String CLOUD_TARGET = "cloud-readiness";
    private static String LINUX_TARGET = "linux";
    private static String OPEN_JDK_TARGET = "openjdk";

    @Inject
    private WindupExecutorService windupExecutorService;

    @Inject
    private Instance<MessagingProgressMonitor> progressMonitorInstance;

    @Inject
    private WebPathUtil webPathUtil;

    @Inject
    private Furnace furnace;

    @Inject
    private ConfigurationOptionsService configurationOptionsService;

    private Long projectID;
    private WindupExecution execution;
    private AnalysisContext analysisContext;

    @Override
    public void init(Long projectID, WindupExecution execution, AnalysisContext context)
    {
        this.projectID = projectID;
        this.execution = execution;
        this.analysisContext = context;
    }

    @Override
    public void run()
    {
        if (this.execution.getState() == ExecutionState.CANCELLED)
        {
            return;
        }

        if (this.analysisContext == null)
        {
            throw new IllegalArgumentException("AnalysisContext must be initialized first");
        }

        MessagingProgressMonitor progressMonitor = progressMonitorInstance.get();
        progressMonitor.setExecution(this.projectID, this.execution);

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

            List<Path> rulesPaths = new ArrayList<>();
            for (RulesPath rulesPath : analysisContext.getRulesPaths())
            {
                if (rulesPath.getRulesPathType() != RulesPath.RulesPathType.SYSTEM_PROVIDED)
                {
                    rulesPaths.add(Paths.get(rulesPath.getPath()));
                }
                else
                {
                    // Make sure to use the latest and local rules path... the system path doesn't
                    // have to come from the request itself and may actually vary from node to node.
                    rulesPaths.add(PathUtil.getWindupRulesDir());
                }
            }

            List<Path> inputPaths = new ArrayList<>();
            for (RegisteredApplication registeredApplication : this.analysisContext.getApplications())
            {
                if (registeredApplication.isDeleted())
                    continue;

                inputPaths.add(Paths.get(registeredApplication.getInputPath()));
            }

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

            List<String> targets = new ArrayList<>();

            MigrationPath migrationPath = analysisContext.getMigrationPath();
            if (migrationPath != null)
            {
                if (migrationPath.getSource() != null)
                    source = migrationPath.getSource().toString();

                if (migrationPath.getTarget() != null)
                {
                    target = migrationPath.getTarget().toString();
                    targets.add(target);
                }
            }

            if (analysisContext.isCloudTargetsIncluded())
            {
                targets.add(CLOUD_TARGET);
            }
            if (analysisContext.isLinuxTargetsIncluded())
            {
                targets.add(LINUX_TARGET);
            }
            if (analysisContext.isOpenJdkTargetsIncluded())
            {
                targets.add(OPEN_JDK_TARGET);
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
                        targets,
                        otherOptions,
                        generateStaticReports);

            progressMonitor.sendReportData();
        }
        catch (Exception e)
        {
            progressMonitor.setFailed();
            execution.setTimeCompleted(new GregorianCalendar());
            LOG.log(Level.WARNING, "Processing of execution " + this.execution + " failed due to: " + e.getMessage(), e);
            throw new RuntimeException(e);
        }
    }

    private List<String> getPackagesAsString(Collection<Package> packages)
    {
        List<String> result = new ArrayList<>();
        for (Package pkg : packages)
        {
            result.add(pkg.getFullName());
        }
        return result;
    }

    private Map<String, Object> getOtherOptions(AnalysisContext analysisContext)
    {
        if (analysisContext == null || analysisContext.getAdvancedOptions() == null)
            return Collections.emptyMap();

        Map<String, Object> result = new HashMap<>();

        // Windup Core can actually only treat all dirs as exploded or not - there is only a global option for that.
        // That makes this a per-execution option. See WindupExecutionTask for what's the workaround.
        boolean isSomePathExplodedApp = false;
        for (RegisteredApplication registeredApplication : analysisContext.getApplications())
        {
            if (registeredApplication.isExploded())
            {
                isSomePathExplodedApp = true;
                break;
            }
        }
        if (isSomePathExplodedApp)
        {
            LOG.info("This execution will treat all registered directories as exploded applications since at least one registered application has that setting.");
            result.put(ExplodedAppInputOption.NAME, true);
        }

        // Process the map of advanced options stored for the analysis context (execution configuration).
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

                    previousValue = list;
                } else
                {
                    /*
                     * Unfortunately, it may be an immutable list, so make a copy of it in this case as well
                     */
                    List<Object> list = new ArrayList<>();
                    list.addAll((List)previousValue);
                    result.put(name, list);

                    previousValue = list;
                }

                /*
                 * The new item is also a list, so add all of them to the previous one.
                 */
                if (value instanceof Iterable)
                {
                    for (Object item : (Iterable) value)
                    {
                        ((List<Object>) previousValue).add(item);
                    }
                }
                else
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
