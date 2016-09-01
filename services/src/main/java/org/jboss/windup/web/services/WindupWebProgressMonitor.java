package org.jboss.windup.web.services;

import java.util.GregorianCalendar;
import java.util.logging.Logger;

import javax.annotation.Resource;
import javax.inject.Inject;
import javax.jms.JMSContext;

import org.jboss.windup.exec.WindupProgressMonitor;
import org.jboss.windup.web.services.messaging.MessagingConstants;
import org.jboss.windup.web.services.model.ExecutionState;
import org.jboss.windup.web.services.model.WindupExecution;

/**
 * @author <a href="mailto:jesse.sightler@gmail.com">Jesse Sightler</a>
 */
public class WindupWebProgressMonitor implements WindupProgressMonitor
{
    private static final Logger LOG = Logger.getLogger(WindupWebProgressMonitor.class.getName());

    @Inject
    private JMSContext messaging;


    @Resource(lookup = "java:/queues/" + MessagingConstants.STATUS_UPDATE_QUEUE)
    private javax.jms.Queue statusUpdateQueue;

    private WindupExecution execution;

    private void sendUpdate(WindupExecution execution)
    {
        messaging.createProducer().send(statusUpdateQueue, execution);
    }

    /**
     * Contains an Entity that keeps the current execution information in storage.
     */
    public void setExecution(WindupExecution execution)
    {
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
        return execution.getState() == ExecutionState.CANCELLED;
    }

    @Override
    public void setCancelled(boolean cancelled)
    {
        execution.setState(ExecutionState.CANCELLED);
        sendUpdate(execution);
    }

    @Override
    public void setTaskName(String name)
    {
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
