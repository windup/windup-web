package org.jboss.windup.web.services.messaging;

import java.util.logging.Level;
import java.util.logging.Logger;

import javax.annotation.Resource;
import javax.enterprise.concurrent.ManagedExecutorService;
import javax.inject.Inject;
import javax.jms.JMSContext;
import javax.jms.Message;
import javax.transaction.Status;
import javax.transaction.UserTransaction;

import org.jboss.forge.furnace.proxy.Proxies;
import org.jboss.windup.web.addons.websupport.WebPathUtil;
import org.jboss.windup.web.furnaceserviceprovider.FromFurnace;
import org.jboss.windup.web.messaging.executor.AMQConstants;
import org.jboss.windup.web.messaging.executor.ExecutionSerializerRegistry;
import org.jboss.windup.web.messaging.executor.JMSServiceAdapter;
import org.jboss.windup.web.services.ServiceUtil;
import org.jboss.windup.web.services.model.WindupExecution;

/**
 * @author <a href="mailto:jesse.sightler@gmail.com">Jesse Sightler</a>
 */
public class JavaEEJMSServiceAdapter implements JMSServiceAdapter
{
    private static Logger LOG = Logger.getLogger(JavaEEJMSServiceAdapter.class.getName());

    @Resource
    private ManagedExecutorService managedExecutorService;

    @Inject
    @FromFurnace
    private WebPathUtil webPathUtil;

    @Inject
    @FromFurnace
    private ExecutionSerializerRegistry executionSerializerRegistry;

    @Override
    public void sendStatusUpdate(Long projectId, WindupExecution execution)
    {
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

                JMSContext messaging = ServiceUtil.getJMSContext();
                try
                {
                    javax.jms.Queue statusUpdateQueue = ServiceUtil.getJMSQueue("java:/queues/" + AMQConstants.STATUS_UPDATE_QUEUE);
                    Message message = this.executionSerializerRegistry.getDefaultSerializer().serializeStatusUpdate(messaging, projectId, execution, false);

                    if (Proxies.isForgeProxy(message))
                        message = Proxies.unwrap(message);

                    messaging.createProducer().send(statusUpdateQueue, message);
                }
                finally
                {
                    messaging.close();
                }

                if (manualTransactions)
                    userTransaction.commit();
            }
            catch (Throwable e1)
            {
                LOG.log(Level.WARNING, "Could not send JMS update message due to: " + e1.getMessage(), e1);
                try
                {
                    if (manualTransactions)
                        userTransaction.rollback();
                }
                catch (Throwable e2)
                {
                    LOG.log(Level.WARNING, "Could not rollback transaction due to: " + e2.getMessage(), e2);
                }
            }
        });

    }

    @Override
    public void sendCompleted(Long projectID, WindupExecution execution)
    {
        JMSContext jmsContext = null;
        try
        {
            jmsContext = ServiceUtil.getJMSContext();

            Message message = this.executionSerializerRegistry.getDefaultSerializer()
                    .serializeStatusUpdate(jmsContext, projectID, execution, true);
            jmsContext.createProducer().send(ServiceUtil.getJMSQueue("java:/queues/" + AMQConstants.STATUS_UPDATE_QUEUE), message);
        }
        catch (Exception e)
        {
            LOG.log(Level.WARNING, "Could not send JMS update message due to: " + e.getMessage(), e);
        }
        finally
        {
            if (jmsContext != null)
                jmsContext.close();
        }
    }

}
