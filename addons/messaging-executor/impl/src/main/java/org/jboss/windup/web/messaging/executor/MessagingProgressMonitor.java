package org.jboss.windup.web.messaging.executor;

import java.util.GregorianCalendar;
import java.util.logging.Level;
import java.util.logging.Logger;

import javax.inject.Inject;

import org.jboss.windup.exec.WindupProgressMonitor;
import org.jboss.windup.web.services.model.ExecutionState;
import org.jboss.windup.web.services.model.WindupExecution;

/**
 * This passes status updates from the Windup engine over JMS so that the core Windup service can monitor progress.
 *
 * @author <a href="mailto:jesse.sightler@gmail.com">Jesse Sightler</a>
 */
public class MessagingProgressMonitor implements WindupProgressMonitor
{
    private static final Logger LOG = Logger.getLogger(MessagingProgressMonitor.class.getName());

    @Inject
    private JMSService jmsService;

    @Inject
    private ExecutionStateCache executionStateCache;

    private Long projectID;
    private WindupExecution execution;

    // Keeps track of the last status update JMS message sent.
    private long lastSendTime = 0L;

    public void sendReportData()
    {
        this.jmsService.getServiceAdapter().sendCompleted(this.projectID, this.execution);
    }

    private void sendUpdate(WindupExecution execution)
    {
        /*
         * If execution is not done and we have sent an update very recently, then don't send another one right now.
         *
         * This prevents overloading the JMS queue with unnecessary updates that slow down processing.
         */
        if (!execution.getState().isDone() && (System.currentTimeMillis() - lastSendTime) < 1000L)
        {
            return;
        }
        execution.setLastModified(new GregorianCalendar());

        if (execution.getState() == ExecutionState.QUEUED)
        {
            execution.setTimeStarted(new GregorianCalendar());
            execution.setState(ExecutionState.STARTED);
        }

        if (this.executionStateCache.isCancelled(execution.getId()))
        {
            this.setCancelled(true);
        }

        try
        {
            lastSendTime = System.currentTimeMillis();

            // The final completion update is sent separately from this (via sendReportData), so don't send it here.
            if (execution.getState() != ExecutionState.COMPLETED)
                jmsService.getServiceAdapter().sendStatusUpdate(this.projectID, execution);
        }
        catch (Exception e)
        {
            LOG.log(Level.WARNING, "Could not send JMS update message due to: " + e.getMessage(), e);
        }
    }

    /**
     * Contains an Entity that keeps the current execution information in storage.
     */
    public void setExecution(Long projectID, WindupExecution execution)
    {
        this.projectID = projectID;
        this.execution = execution;
    }

    public void setFailed()
    {
        execution.setState(ExecutionState.FAILED);
        sendUpdate(execution);
    }

    @Override
    public void beginTask(String name, int totalWork)
    {
        execution.setTotalWork(totalWork);
        execution.setCurrentTask(name);
        sendUpdate(execution);

        String message = String.format("[%d/%d] %s", execution.getWorkCompleted(), totalWork, name);
        LOG.info(message);
    }

    @Override
    public boolean isCancelled()
    {
        if (this.execution.getState() != ExecutionState.CANCELLED && this.executionStateCache.isCancelled(this.execution.getId()))
            this.execution.setState(ExecutionState.CANCELLED);

        return execution.getState() == ExecutionState.CANCELLED;
    }

    @Override
    public void setCancelled(boolean cancelled)
    {
        execution.setState(ExecutionState.CANCELLED);
    }

    @Override
    public void setTaskName(String name)
    {
        if (name.length() > 1024) name = name.substring(0, 1024);
        execution.setCurrentTask(name);
        sendUpdate(execution);

        String message = String.format("[%d/%d] %s", execution.getWorkCompleted(), execution.getTotalWork(), name);
        LOG.info(message);
    }

    @Override
    public void subTask(String subTask)
    {
        execution.setCurrentTask(subTask);
        sendUpdate(execution);

        String message = String.format("[%d/%d] %s", execution.getWorkCompleted(), execution.getTotalWork(), subTask);
        LOG.info(message);
    }

    @Override
    public void worked(int work)
    {
        execution.setWorkCompleted(execution.getWorkCompleted() + work);
        sendUpdate(execution);
    }

    @Override
    public void done()
    {
        execution.setState(ExecutionState.COMPLETED);
        execution.setTimeCompleted(new GregorianCalendar());

        sendUpdate(execution);
    }
}
