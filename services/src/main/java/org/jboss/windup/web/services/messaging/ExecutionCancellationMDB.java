package org.jboss.windup.web.services.messaging;

import java.util.logging.Level;
import java.util.logging.Logger;

import javax.ejb.ActivationConfigProperty;
import javax.ejb.MessageDriven;
import javax.ejb.TransactionAttribute;
import javax.ejb.TransactionAttributeType;
import javax.enterprise.inject.Instance;
import javax.inject.Inject;
import javax.jms.Message;
import javax.jms.MessageListener;
import javax.jms.ObjectMessage;

import org.jboss.windup.web.services.model.WindupExecution;

/**
 * This receives requests to run Windup and executes them.
 *
 * The WindupExecutor is given a WindupWebProgressMonitor instance when launched in WindupExecutionTask.
 * That monitor is later called through WindupProgressMonitor interface in DefaultRuleLifecycleListener.
 *
 * @author <a href="mailto:jesse.sightler@gmail.com">Jesse Sightler</a>
 */
@MessageDriven(activationConfig = {
        @ActivationConfigProperty(propertyName = "destinationType", propertyValue = "javax.jms.Topic"),
        @ActivationConfigProperty(propertyName = "acknowledgeMode", propertyValue = "AUTO_ACKNOWLEDGE"),
        @ActivationConfigProperty(propertyName = "maxSession", propertyValue = "10"),
        @ActivationConfigProperty(propertyName = "destination", propertyValue = MessagingConstants.CANCELLATION_TOPIC)
})
@TransactionAttribute(TransactionAttributeType.NOT_SUPPORTED)
public class ExecutionCancellationMDB extends AbstractMDB implements MessageListener
{
    private static Logger LOG = Logger.getLogger(ExecutorMDB.class.getName());

    @Inject
    private Instance<WindupExecutionTask> windupExecutionTaskInstance;

    @Override
    public void onMessage(Message message)
    {
        if (!validatePayload(WindupExecution.class, message))
            return;

        try
        {
            WindupExecution execution = (WindupExecution)((ObjectMessage) message).getObject();
            LOG.info("Marking execution for cancellation: " + execution.getId());
            ExecutionStateCache.setCancelled(execution);
        }
        catch (Throwable e)
        {
            LOG.log(Level.SEVERE, "Failed to execute windup due to: " + e.getMessage(), e);
        }
    }
}
