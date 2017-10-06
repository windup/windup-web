package org.jboss.windup.web.services.messaging;

import java.io.BufferedOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.HashSet;
import java.util.Set;
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
import javax.jms.StreamMessage;

import org.jboss.ejb3.annotation.DeliveryGroup;
import org.jboss.forge.furnace.Furnace;
import org.jboss.windup.web.addons.websupport.WebPathUtil;
import org.jboss.windup.web.furnaceserviceprovider.FromFurnace;
import org.jboss.windup.web.messaging.executor.AMQConstants;
import org.jboss.windup.web.messaging.executor.ExecutionRequest;
import org.jboss.windup.web.messaging.executor.ExecutionSerializer;
import org.jboss.windup.web.messaging.executor.ExecutionSerializerRegistry;
import org.jboss.windup.web.messaging.executor.ExecutionStateCache;
import org.jboss.windup.web.messaging.executor.JMSService;
import org.jboss.windup.web.messaging.executor.WindupExecutionTask;
import org.jboss.windup.web.services.json.WindupExecutionJSONUtil;
import org.jboss.windup.web.services.model.WindupExecution;
import org.kamranzafar.jtar.TarEntry;
import org.kamranzafar.jtar.TarInputStream;

/**
 * This receives requests to run Windup and executes them.
 *
 * @author <a href="mailto:jesse.sightler@gmail.com">Jesse Sightler</a>
 */
@MessageDriven(activationConfig = {
    @ActivationConfigProperty(propertyName = "destinationType", propertyValue = "javax.jms.Queue"),
    @ActivationConfigProperty(propertyName = "acknowledgeMode", propertyValue = "AUTO_ACKNOWLEDGE"),
    @ActivationConfigProperty(propertyName = "maxSession", propertyValue = "1"),
    @ActivationConfigProperty(propertyName = "destination", propertyValue = AMQConstants.EXECUTOR_QUEUE)
})
@TransactionAttribute(TransactionAttributeType.NOT_SUPPORTED)
@DeliveryGroup(AMQConstants.DELIVERY_GROUP_EXECUTOR)
public class ExecutorMDB extends AbstractMDB implements MessageListener
{
    private static Logger LOG = Logger.getLogger(ExecutorMDB.class.getName());

    @Inject
    @FromFurnace
    private WebPathUtil webPathUtil;

    @Inject
    @FromFurnace
    private ExecutionStateCache executionStateCache;

    @Inject
    @FromFurnace
    private ExecutionSerializerRegistry executionSerializerRegistry;

    @Inject
    @FromFurnace
    private JMSService jmsService;

    @Inject
    private Instance<JavaEEJMSServiceAdapter> javaEEJMSServiceAdapter;

    @Inject
    private Furnace furnace;

    @Override
    public void onMessage(Message message)
    {
        this.jmsService.setServiceAdapter(javaEEJMSServiceAdapter.get());

        ExecutionSerializer serializer = this.executionSerializerRegistry.getDefaultSerializer();
        ExecutionRequest executionRequest = serializer.deserializeExecutionRequest(message);
        Long projectID = executionRequest.getProjectID();
        WindupExecution execution = executionRequest.getExecution();

        try
        {
            if (this.executionStateCache.isCancelled(execution.getId()))
            {
                LOG.info("Not executing " + execution.getId() + " as it has been marked cancelled!");
                return;
            }

            LOG.info("Executing: " + execution);
            WindupExecutionTask executionTask = this.furnace.getAddonRegistry().getServices(WindupExecutionTask.class).get();
            executionTask.init(projectID, execution, execution.getAnalysisContext());
            executionTask.run();
        }
        catch (Throwable e)
        {
            LOG.log(Level.SEVERE, "Failed to execute windup due to: " + e.getMessage(), e);
        }
    }

}
