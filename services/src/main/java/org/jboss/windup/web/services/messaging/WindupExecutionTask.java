package org.jboss.windup.web.services.messaging;

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
import java.util.stream.Collectors;

import javax.annotation.Resource;
import javax.enterprise.concurrent.ManagedExecutorService;
import javax.enterprise.inject.Instance;
import javax.inject.Inject;
import javax.persistence.EntityManager;
import javax.persistence.EntityNotFoundException;
import javax.persistence.PersistenceContext;
import javax.transaction.Status;
import javax.transaction.UserTransaction;

import org.apache.commons.io.FileUtils;
import org.jboss.windup.config.ConfigurationOption;
import org.jboss.windup.web.addons.websupport.WebPathUtil;
import org.jboss.windup.web.addons.websupport.services.WindupExecutorService;
import org.jboss.windup.web.furnaceserviceprovider.FromFurnace;
import org.jboss.windup.web.services.ServiceUtil;
import org.jboss.windup.web.services.WindupWebProgressMonitor;
import org.jboss.windup.web.services.model.AdvancedOption;
import org.jboss.windup.web.services.model.AnalysisContext;
import org.jboss.windup.web.services.model.ApplicationGroup;
import org.jboss.windup.web.services.model.ExecutionState;
import org.jboss.windup.web.services.model.MigrationPath;
import org.jboss.windup.web.services.model.Package;
import org.jboss.windup.web.services.model.WindupExecution;
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
    private ConfigurationOptionsService configurationOptionsService;

    @PersistenceContext
    private EntityManager entityManager;

    @Resource
    private ManagedExecutorService managedExecutorService;

    private WindupExecution execution;
    private ApplicationGroup group;

    /**
     * The {@link ApplicationGroup} to execute.
     */
    public void init(Long executionId)
    {
        this.execution = this.entityManager.find(WindupExecution.class, executionId);

        if (this.execution == null)
        {
            throw new EntityNotFoundException("WindupExecution with id " + executionId + " was not found");
        }

        this.group = this.execution.getGroup();
    }

    protected void updateState(WindupExecution execution, ExecutionState state)
    {
        managedExecutorService.submit(() -> {
            UserTransaction userTransaction = ServiceUtil.getUserTransaction();

            boolean manualTransactions = false;
            try
            {
                if (userTransaction.getStatus() == Status.STATUS_NO_TRANSACTION)
                {
                    manualTransactions = true;
                    userTransaction.begin();
                }

                this.execution.setState(state);
                this.entityManager.merge(this.execution);

                if (manualTransactions)
                    userTransaction.commit();
            }
            catch (Exception e)
            {
                LOG.warning("Could not send JMS update message due to: " + e.getMessage());
                try
                {
                    if (manualTransactions)
                        userTransaction.rollback();
                }
                catch (Throwable t)
                {
                    LOG.warning("Could not rollback transaction due to: " + t.getMessage());
                }
            }
        });
    }

    @Override
    public void run()
    {
        if (this.execution.getState() == ExecutionState.CANCELLED) {
            return;
        }

        if (this.group == null)
            throw new IllegalArgumentException("The group must be initialized by calling setGroup() with a non-null value first!");

        this.updateState(this.execution, ExecutionState.STARTED);

        WindupWebProgressMonitor progressMonitor = progressMonitorInstance.get();
        progressMonitor.setExecution(this.execution);

        AnalysisContext analysisContext = group.getAnalysisContext();
        try
        {
            Path reportOutputPath = Paths.get(this.execution.getOutputPath());

            // Clean out the output directory first
            try
            {
                FileUtils.deleteDirectory(new File(this.execution.getOutputPath()));
            } catch (IOException e)
            {
                LOG.warning("Failed to delete output directory: " + this.execution.getOutputPath() + ", due to: " + e.getMessage());
            }

            Collection<Path> rulesPaths = analysisContext.getRulesPaths().stream()
                        .map((rulesPath) -> Paths.get(rulesPath.getPath()))
                        .collect(Collectors.toList());

            List<Path> inputPaths = group
                        .getApplications()
                        .stream()
                        .map(application -> Paths.get(application.getInputPath()))
                        .collect(Collectors.toList());

            List<String> includePackages = Collections.emptyList();
            List<String> excludePackages = Collections.emptyList();
            String source = null;
            String target = null;

            if (analysisContext.getIncludePackages() != null) {
                includePackages = this.getPackagesAsString(analysisContext.getIncludePackages());
            }

            if (analysisContext.getExcludePackages() != null) {
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

            windupExecutorService.execute(
                        progressMonitor,
                        rulesPaths,
                        inputPaths,
                        reportOutputPath,
                        includePackages,
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
