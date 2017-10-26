package org.jboss.windup.web.services.messaging;

import java.util.logging.Level;
import java.util.logging.Logger;

import javax.ejb.ActivationConfigProperty;
import javax.ejb.MessageDriven;
import javax.ejb.TransactionAttribute;
import javax.ejb.TransactionAttributeType;
import javax.inject.Inject;
import javax.jms.Message;
import javax.jms.MessageListener;
import javax.jms.ObjectMessage;
import javax.jms.TextMessage;

import org.jboss.ejb3.annotation.DeliveryGroup;
import org.jboss.forge.furnace.Furnace;
import org.jboss.windup.web.messaging.executor.AMQConstants;
import org.jboss.windup.web.messaging.executor.ExecutionStateCache;
import org.jboss.windup.web.services.json.WindupExecutionJSONUtil;
import org.jboss.windup.web.services.model.WindupExecution;

/**
 * This receives requests to run Windup and executes them.
 *
 * @author <a href="mailto:jesse.sightler@gmail.com">Jesse Sightler</a>
 */
@MessageDriven(activationConfig = {
        @ActivationConfigProperty(propertyName = "destinationType", propertyValue = "javax.jms.Topic"),
        @ActivationConfigProperty(propertyName = "acknowledgeMode", propertyValue = "AUTO_ACKNOWLEDGE"),
        @ActivationConfigProperty(propertyName = "maxSession", propertyValue = "10"),
        @ActivationConfigProperty(propertyName = "destination", propertyValue = AMQConstants.CANCELLATION_TOPIC)
})
@TransactionAttribute(TransactionAttributeType.NOT_SUPPORTED)
@DeliveryGroup(AMQConstants.DELIVERY_GROUP_EXECUTOR)
public class ExecutionCancellationMDB extends AbstractMDB implements MessageListener
{
    private static Logger LOG = Logger.getLogger(ExecutorMDB.class.getName());

    @Inject
    private Furnace furnace;

    @Override
    public void onMessage(Message message)
    {
        try
        {
            TextMessage textMessage = (TextMessage) message;
            WindupExecution execution = WindupExecutionJSONUtil.readJSON(textMessage.getText());
            LOG.info("Marking execution for cancellation: " + execution.getId());
            furnace.getAddonRegistry().getServices(ExecutionStateCache.class).get().setCancelled(execution.getId());
        }
        catch (Throwable e)
        {
            LOG.log(Level.SEVERE, "Failed to execute windup due to: " + e.getMessage(), e);
        }
    }
}
