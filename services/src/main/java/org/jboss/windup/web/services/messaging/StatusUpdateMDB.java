package org.jboss.windup.web.services.messaging;

import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.GregorianCalendar;
import java.util.Set;
import java.util.logging.Level;
import java.util.logging.Logger;

import javax.annotation.PostConstruct;
import javax.ejb.ActivationConfigProperty;
import javax.ejb.MessageDriven;
import javax.enterprise.event.Event;
import javax.inject.Inject;
import javax.jms.Message;
import javax.jms.MessageListener;
import javax.naming.NamingException;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.transaction.HeuristicMixedException;
import javax.transaction.HeuristicRollbackException;
import javax.transaction.NotSupportedException;
import javax.transaction.RollbackException;
import javax.transaction.SystemException;

import org.jboss.ejb3.annotation.DeliveryGroup;
import org.jboss.windup.graph.model.resource.FileModel;
import org.jboss.windup.web.addons.websupport.services.ProjectLoaderService;
import org.jboss.windup.web.addons.websupport.services.WindupExecutorService;
import org.jboss.windup.web.furnaceserviceprovider.FromFurnace;
import org.jboss.windup.web.messaging.executor.AMQConstants;
import org.jboss.windup.web.messaging.executor.ExecutionSerializer;
import org.jboss.windup.web.messaging.executor.ExecutionSerializerRegistry;
import org.jboss.windup.web.services.model.AnalysisContext;
import org.jboss.windup.web.services.model.ExecutionState;
import org.jboss.windup.web.services.model.FilterApplication;
import org.jboss.windup.web.services.model.RegisteredApplication;
import org.jboss.windup.web.services.model.ReportFilter;
import org.jboss.windup.web.services.model.WindupExecution;
import org.jboss.windup.web.services.service.DefaultGraphPathLookup;
import org.jboss.windup.web.services.service.WindupExecutionService;
import org.jboss.windup.web.services.websocket.WSJMSMessage;

/**
 * This receives updates from the Windup execution backend processes and persists the current state to the database.
 *
 * @author <a href="mailto:jesse.sightler@gmail.com">Jesse Sightler</a>
 */
@MessageDriven(activationConfig = {
            @ActivationConfigProperty(propertyName = "destinationType", propertyValue = "javax.jms.Queue"),
            @ActivationConfigProperty(propertyName = "acknowledgeMode", propertyValue = "AUTO_ACKNOWLEDGE"),
            @ActivationConfigProperty(propertyName = "maxSession", propertyValue = "1"),
            @ActivationConfigProperty(propertyName = "destination", propertyValue = AMQConstants.STATUS_UPDATE_QUEUE),
})
@DeliveryGroup(AMQConstants.DELIVERY_GROUP_SERVICES)
public class StatusUpdateMDB extends AbstractMDB implements MessageListener
{
    private static Logger LOG = Logger.getLogger(StatusUpdateMDB.class.getName());
    /**
     * Event sent to WebSocket ExecutionProgressReporter
     */
    @Inject
    @WSJMSMessage
    Event<Message> informWebSocketEvent;

    @PersistenceContext
    private EntityManager entityManager;

    @Inject
    @FromFurnace
    private WindupExecutorService windupExecutorService;

    @Inject
    @FromFurnace
    private ExecutionSerializerRegistry executionSerializerRegistry;

    @Inject
    @FromFurnace
    private ProjectLoaderService projectLoaderService;

    @Inject
    private WindupExecutionService windupExecutionService;

    @PostConstruct
    protected void initialize()
    {
        this.projectLoaderService.setGraphPathLookup(new DefaultGraphPathLookup(this.entityManager));
    }

    @Override
    public void onMessage(Message message)
    {
        ExecutionSerializer executionSerializer = this.executionSerializerRegistry.getDefaultSerializer();

        try
        {
            Long executionID = message.getLongProperty("executionId");
            // Once the run is complete, make sure that we have the correct path information in the execution.
            WindupExecution fromDB = entityManager.find(WindupExecution.class, executionID);
            if (fromDB == null)
            {
                LOG.warning("Received unrecognized status update for execution: " + executionID);
                return;
            }

            WindupExecution execution = executionSerializer.deserializeStatusUpdate(message, fromDB);
            if (fromDB.getState() == ExecutionState.COMPLETED)
            {
                setReportIndexPath(fromDB);
                setApplicationFilters(fromDB);
            }

            if (execution.getState() != ExecutionState.CANCELLED && fromDB.getState() == ExecutionState.CANCELLED)
            {
                // If the update from the engine hasn't been cancelled, try to send another request
                this.windupExecutionService.cancelExecution(fromDB.getId());
            }

            if (fromDB.getState() == ExecutionState.CANCELLED)
            {
                LOG.warning("Not continuing to update state for cancelled status...");
                fromDB.setTimeCompleted(new GregorianCalendar());
                return;
            }

            fromDB.setLastModified(execution.getLastModified());
            fromDB.setTimeStarted(execution.getTimeStarted());

            // Make sure to get an end time for failed executions
            if (execution.getState() == ExecutionState.FAILED && execution.getTimeCompleted() == null && fromDB.getTimeCompleted() == null)
                fromDB.setTimeCompleted(new GregorianCalendar());
            else
                fromDB.setTimeCompleted(execution.getTimeCompleted());

            fromDB.setTotalWork(execution.getTotalWork());
            fromDB.setWorkCompleted(execution.getWorkCompleted());
            fromDB.setCurrentTask(execution.getCurrentTask());

            fromDB.setApplicationListRelativePath(execution.getApplicationListRelativePath());
            fromDB.setOutputPath(execution.getOutputPath());
            fromDB.setState(execution.getState());

            informWebSocketEvent.fire(message);
        }
        catch (Exception e)
        {
            LOG.log(Level.SEVERE, "Error getting status update due to: " + e.getMessage(), e);
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

        Set<RegisteredApplication> applications = context.getApplications();
        applications.removeIf((RegisteredApplication app) -> app.isDeleted());
    }
}
