package org.jboss.windup.web.services.service;

import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Collections;
import java.util.GregorianCalendar;
import java.util.List;
import java.util.logging.Level;
import java.util.logging.Logger;
import java.util.stream.Collectors;

import javax.enterprise.inject.Instance;
import javax.inject.Inject;
import javax.naming.InitialContext;
import javax.naming.NamingException;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.transaction.HeuristicMixedException;
import javax.transaction.HeuristicRollbackException;
import javax.transaction.NotSupportedException;
import javax.transaction.RollbackException;
import javax.transaction.SystemException;
import javax.transaction.UserTransaction;

import org.jboss.windup.web.addons.websupport.services.WindupExecutorService;
import org.jboss.windup.web.furnaceserviceprovider.FromFurnace;
import org.jboss.windup.web.furnaceserviceprovider.WebProperties;
import org.jboss.windup.web.services.WindupWebProgressMonitor;
import org.jboss.windup.web.services.model.AnalysisContext;
import org.jboss.windup.web.services.model.ApplicationGroup;
import org.jboss.windup.web.services.model.Configuration;
import org.jboss.windup.web.services.model.MigrationPath;
import org.jboss.windup.web.services.model.RegisteredApplication;
import org.jboss.windup.web.services.model.WindupExecution;

/**
 * Contains code for executing Windup and managing the status information from the process.
 *
 * @author <a href="mailto:jesse.sightler@gmail.com">Jesse Sightler</a>
 */
public class WindupExecutionTask implements Runnable
{
    private static Logger LOG = Logger.getLogger(WindupExecutionTask.class.getName());

    @PersistenceContext
    private EntityManager entityManager;

    @Inject
    @FromFurnace
    private WindupExecutorService windupExecutorService;


    @Inject
    private Instance<WindupWebProgressMonitor> progressMonitorInstance;

    private Configuration configuration;
    private WindupExecution execution;
    private ApplicationGroup group;

    /**
     * The {@link ApplicationGroup} to execute.
     */
    public void init(WindupExecution execution, Configuration configuration, ApplicationGroup group)
    {
        this.configuration = configuration;
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
            Collection<Path> rulesPaths = this.configuration.getRulesPaths().stream()
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

            if (analysisContext != null)
            {
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
            }

            windupExecutorService.execute(
                        progressMonitor,
                        rulesPaths,
                        inputPaths,
                        Paths.get(group.getOutputPath()),
                        packages,
                        excludePackages,
                        source,
                        target);

            // reload the current state
            execution = entityManager.find(WindupExecution.class, execution.getId());
            execution.setTimeCompleted(new GregorianCalendar());

            setReportIndexPath(execution);
        }
        catch (Exception e)
        {
            progressMonitor.setFailed();
            execution.setTimeCompleted(new GregorianCalendar());
            LOG.log(Level.WARNING, "Processing of " + group + " failed due to: " + e.getMessage(), e);
            throw new RuntimeException(e);
        }
    }

    private void setReportIndexPath(WindupExecution execution)
                throws HeuristicMixedException, HeuristicRollbackException, NamingException, NotSupportedException, RollbackException, SystemException
    {
        InitialContext ic = new InitialContext();
        UserTransaction userTransaction = (UserTransaction) ic.lookup("java:comp/UserTransaction");

        userTransaction.begin();

        ApplicationGroup group = execution.getGroup();
        Path reportDirectory = Paths.get(group.getOutputPath());
        for (RegisteredApplication application : group.getApplications())
        {
            Path applicationPath = Paths.get(application.getInputPath());

            /*
             * FIXME - This is a little bit of a hack to just get the relative path for the web client.
             *
             * Could potentially be moved into a service inside of the Windup Furnace API?
             */
            String reportDirectoryName = reportDirectory.getFileName().toString();
            String reportIndexFilename = windupExecutorService.getReportIndexPath(reportDirectory, applicationPath);

            application.setReportIndexPath(reportDirectoryName + "/reports/" + reportIndexFilename);
            entityManager.merge(application);
            // END FIXME
        }
        userTransaction.commit();
    }
}
