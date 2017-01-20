package org.jboss.windup.web.services;

import java.util.GregorianCalendar;
import java.util.logging.Level;
import java.util.logging.Logger;

import javax.annotation.Resource;
import javax.enterprise.concurrent.ManagedExecutorService;
import javax.jms.JMSContext;
import javax.jms.JMSException;
import javax.jms.Message;
import javax.transaction.Status;
import javax.transaction.UserTransaction;

import org.jboss.windup.exec.WindupProgressMonitor;
import org.jboss.windup.util.exception.WindupException;
import org.jboss.windup.web.services.messaging.MessagingConstants;
import org.jboss.windup.web.services.model.ExecutionState;
import org.jboss.windup.web.services.model.WindupExecution;

/**
 * This passes status updates from the Windup core over JMS so that the Windup service can monitor progress.
 *
 * @author <a href="mailto:jesse.sightler@gmail.com">Jesse Sightler</a>
 * @author <a href="mailto:zizka@seznam.cz">Ondrej Zizka</a>
 */
public class WindupWebProgressMonitor implements WindupProgressMonitor
{
    private static final Logger LOG = Logger.getLogger(WindupWebProgressMonitor.class.getName());

    @Resource
    private ManagedExecutorService managedExecutorService;

    private WindupExecution execution;

    // Keeps track of the last status update JMS message sent.
    private long lastSendTime = 0L;
    private long lastGetUpdateTime = 0L;


    /**
     * Send the execution to the queue from where it's picked up and stored to a database.
     * Effectively, the execution state is duplicated here and in the database.
     */
    private void sendUpdate(WindupExecution execution, String from)
    {
        /*
         * If execution is not done and we have sent an update very recently, then don't send another one right now.
         * This prevents overloading the JMS queue with unnecessary updates that slow down processing.
         */
        if (!execution.getState().isDone() && (System.currentTimeMillis() - lastSendTime) < 1000L)
        {
            return;
        }

        if (execution.getState() == ExecutionState.QUEUED)
            execution.setState(ExecutionState.STARTED);

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
                try (JMSContext messaging = ServiceUtil.getJMSContext()) {
                    javax.jms.Queue statusUpdateQueue = ServiceUtil.getJMSQueue("java:/queues/" + MessagingConstants.STATUS_UPDATE_QUEUE);
                    messaging.createProducer()
                            .setProperty("from", WindupWebProgressMonitor.class.getSimpleName() + " " + from)
                            .send(statusUpdateQueue, execution);
                }

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


    /**
     * Checks the topic for execution change requests.
     */
    private void getStatusChangeRequestIfAvailable()
    {
        if (!execution.getState().isDone() && (System.currentTimeMillis() - lastGetUpdateTime) < 1000L)
            return;

        try (JMSContext messaging = ServiceUtil.getJMSContext()) {
            javax.jms.Topic statusUpdateTopic = ServiceUtil.getJMSTopic("java:/topics/" + MessagingConstants.EXEC_CHANGE_REQUEST_TOPIC);
            do {
                Message changeRequest = messaging.createConsumer(statusUpdateTopic).receiveNoWait();
                if (changeRequest == null)
                    return;
                WindupExecution execution = changeRequest.getBody(WindupExecution.class);
                if (!this.execution.getId().equals(execution.getId()))
                    return;

                // Currently, we only handle state change requests so we can stop Windup execution through isCancelled().
                if (execution.getState() == ExecutionState.CANCELLING)
                    setCancelled(true);
            } while (true);
        }
        catch (JMSException ex)
        {
            Logger.getLogger(WindupWebProgressMonitor.class.getName()).log(Level.SEVERE, null, ex);
        }
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
        sendUpdate(execution, "setFailed()");
    }

    @Override
    public void beginTask(String name, int totalWork)
    {
        execution.setTotalWork(totalWork);
        execution.setCurrentTask(name);
        sendUpdate(execution, "beginTask()");

        String message = String.format("[%d/%d] %s", execution.getWorkCompleted(), totalWork, name);
        LOG.info(message);
    }

    @Override
    public boolean isCancelled()
    {
        LOG.info("isCancelled() called, execution #" + execution.getId() + " is " + execution.getState());
        this.getStatusChangeRequestIfAvailable();
        return this.execution.getState() == ExecutionState.CANCELLING;
    }

    @Override
    public void setCancelled(boolean cancelled)
    {
        LOG.info("setCancelled() called");
        if (cancelled)
            execution.setState(ExecutionState.CANCELLING);
        sendUpdate(execution, "setCancelled()");
    }

    @Override
    public void setTaskName(String name)
    {
        execution.setCurrentTask(name);
        sendUpdate(execution, "setTaskName()");

        String message = String.format("[%d/%d] %s", execution.getWorkCompleted(), execution.getTotalWork(), name);
        LOG.info(message);
    }

    @Override
    public void subTask(String subTask)
    {
        execution.setCurrentTask(subTask);
        sendUpdate(execution, "subTask()");

        String message = String.format("[%d/%d] %s", execution.getWorkCompleted(), execution.getTotalWork(), subTask);
        LOG.info(message);
    }

    @Override
    public void worked(int work)
    {
        execution.setWorkCompleted(execution.getWorkCompleted() + work);
        sendUpdate(execution, "worked()");
    }

    @Override
    public void done()
    {
        LOG.log(Level.INFO, "done() called for " + execution);

        if (execution.getState() == ExecutionState.CANCELLING)
            execution.setState(ExecutionState.CANCELLED);
        else if (execution.getState() == ExecutionState.STARTED)
            execution.setState(ExecutionState.COMPLETED);
        else
            throw new IllegalStateException("done() called from wrong state: " + execution);
        execution.setTimeCompleted(new GregorianCalendar());
        sendUpdate(execution, "done()");
    }
}
