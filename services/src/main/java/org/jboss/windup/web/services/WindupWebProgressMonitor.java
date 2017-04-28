package org.jboss.windup.web.services;

import java.util.GregorianCalendar;
import java.util.logging.Logger;

import javax.annotation.Resource;
import javax.enterprise.concurrent.ManagedExecutorService;
import javax.jms.JMSContext;
import javax.transaction.Status;
import javax.transaction.UserTransaction;

import org.jboss.windup.exec.WindupProgressMonitor;
import org.jboss.windup.web.services.messaging.ExecutionStateCache;
import org.jboss.windup.web.services.messaging.MessagingConstants;
import org.jboss.windup.web.services.model.ExecutionState;
import org.jboss.windup.web.services.model.WindupExecution;

/**
 * This passes status updates from the Windup engine over JMS so that the core Windup service can monitor progress.
 *
 * @author <a href="mailto:jesse.sightler@gmail.com">Jesse Sightler</a>
 */
public class WindupWebProgressMonitor implements WindupProgressMonitor
{
    private static final Logger LOG = Logger.getLogger(WindupWebProgressMonitor.class.getName());

    @Resource
    private ManagedExecutorService managedExecutorService;

    private WindupExecution execution;

    // Keeps track of the last status update JMS message sent.
    private long lastSendTime = 0L;

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

        if (execution.getState() == ExecutionState.QUEUED) {
            execution.setState(ExecutionState.STARTED);
            execution.setTimeStarted(new GregorianCalendar());
        }

        if (ExecutionStateCache.isCancelled(execution))
        {
            this.setCancelled(true);
        }

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

                lastSendTime = System.currentTimeMillis();
                JMSContext messaging = ServiceUtil.getJMSContext();
                try
                {
                    javax.jms.Queue statusUpdateQueue = ServiceUtil.getJMSQueue("java:/queues/" + MessagingConstants.STATUS_UPDATE_QUEUE);

                    messaging.createProducer().send(statusUpdateQueue, execution);
                } finally
                {
                    messaging.close();
                }

                if (manualTransactions)
                    userTransaction.commit();
            } catch (Exception e)
            {
                LOG.warning("Could not send JMS update message due to: " + e.getMessage());
                try
                {
                    if (manualTransactions)
                        userTransaction.rollback();
                } catch (Throwable t)
                {
                    LOG.warning("Could not rollback transaction due to: " + t.getMessage());
                }
            }
        });
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
