package org.jboss.windup.web.services.messaging;

import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.GregorianCalendar;
import java.util.logging.Level;
import java.util.logging.Logger;

import javax.annotation.PostConstruct;
import javax.ejb.ActivationConfigProperty;
import javax.ejb.MessageDriven;
import javax.inject.Inject;
import javax.jms.Message;
import javax.jms.MessageListener;
import javax.jms.ObjectMessage;
import javax.naming.NamingException;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.transaction.HeuristicMixedException;
import javax.transaction.HeuristicRollbackException;
import javax.transaction.NotSupportedException;
import javax.transaction.RollbackException;
import javax.transaction.SystemException;

import org.jboss.windup.graph.model.resource.FileModel;
import org.jboss.windup.web.addons.websupport.services.ProjectLoaderService;
import org.jboss.windup.web.addons.websupport.services.WindupExecutorService;
import org.jboss.windup.web.furnaceserviceprovider.FromFurnace;
import org.jboss.windup.web.services.model.AnalysisContext;
import org.jboss.windup.web.services.model.ExecutionState;
import org.jboss.windup.web.services.model.FilterApplication;
import org.jboss.windup.web.services.model.RegisteredApplication;
import org.jboss.windup.web.services.model.ReportFilter;
import org.jboss.windup.web.services.model.WindupExecution;
import org.jboss.windup.web.services.service.DefaultGraphPathLookup;

/**
 * This receives updates from the Windup execution backend processes and persists the current state to the database.
 *
 * @author <a href="mailto:jesse.sightler@gmail.com">Jesse Sightler</a>
 */
@MessageDriven(activationConfig = {
            @ActivationConfigProperty(propertyName = "destinationType", propertyValue = "javax.jms.Queue"),
            @ActivationConfigProperty(propertyName = "acknowledgeMode", propertyValue = "AUTO_ACKNOWLEDGE"),
            @ActivationConfigProperty(propertyName = "maxSession", propertyValue = "1"),
            @ActivationConfigProperty(propertyName = "destination", propertyValue = MessagingConstants.STATUS_UPDATE_QUEUE),
})
public class StatusUpdateMDB extends AbstractMDB implements MessageListener
{
    private static Logger LOG = Logger.getLogger(StatusUpdateMDB.class.getName());

    @PersistenceContext
    private EntityManager entityManager;

    @Inject
    @FromFurnace
    private WindupExecutorService windupExecutorService;

    @Inject
    @FromFurnace
    private ProjectLoaderService projectLoaderService;

    @PostConstruct
    protected void initialize()
    {
        this.projectLoaderService.setGraphPathLookup(new DefaultGraphPathLookup(this.entityManager));
    }

    @Override
    public void onMessage(Message message)
    {
        // Make sure that we are receiving the correct type of message
        if (!validatePayload(WindupExecution.class, message))
            return;

        try
        {
            WindupExecution execution = (WindupExecution) ((ObjectMessage) message).getObject();
            LOG.info("Received execution update event: " + execution);

            // Update the DB with this information
            WindupExecution fromDB = entityManager.find(WindupExecution.class, execution.getId());

            if (fromDB == null)
                LOG.warning("Received unrecognized status update for execution: " + fromDB);

            fromDB.setLastModified(new GregorianCalendar());
            fromDB.setTimeStarted(execution.getTimeStarted());

            fromDB.setTimeCompleted(execution.getTimeCompleted());

            fromDB.setTotalWork(execution.getTotalWork());
            fromDB.setWorkCompleted(execution.getWorkCompleted());
            fromDB.setCurrentTask(execution.getCurrentTask());

            fromDB.setApplicationListRelativePath(execution.getApplicationListRelativePath());
            fromDB.setOutputPath(execution.getOutputPath());
            fromDB.setState(execution.getState());

            // Once the run is complete, make sure that we have the correct path information in the execution.
            if (fromDB.getState() == ExecutionState.COMPLETED)
            {
                setReportIndexPath(fromDB);
                setApplicationFilters(fromDB);
            }
        }
        catch (Throwable e)
        {
            LOG.log(Level.SEVERE, "Failed to execute windup due to: " + e.getMessage(), e);
        }
    }

    private void setApplicationFilters(WindupExecution execution)
    {
        if (execution.getFilterApplications().size() > 0)
        {
            // this method is executed twice, prevent having duplicities
            return;
        }

        Iterable<FileModel> data = this.projectLoaderService.getTopLevelProjects(execution.getId());

        ReportFilter reportFilter = execution.getReportFilter();
        reportFilter.clear();

        for (FileModel fileModel : data)
        {
            FilterApplication filterApplication = new FilterApplication(fileModel.getFileName());
            filterApplication.setMd5Hash(fileModel.getMD5Hash());
            filterApplication.setSha1Hash(fileModel.getSHA1Hash());
            filterApplication.setInputPath(fileModel.getFilePath());

            this.entityManager.persist(filterApplication);

            execution.addFilterApplication(filterApplication);
        }
    }

    private void setReportIndexPath(WindupExecution execution)
                throws HeuristicMixedException, HeuristicRollbackException,
                NamingException, NotSupportedException, RollbackException, SystemException
    {
        AnalysisContext context = execution.getAnalysisContext();
        Path reportDirectory = Paths.get(execution.getOutputPath());

        for (RegisteredApplication application : context.getApplications())
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
    }
}
