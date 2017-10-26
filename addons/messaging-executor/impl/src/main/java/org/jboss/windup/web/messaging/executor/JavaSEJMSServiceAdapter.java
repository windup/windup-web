package org.jboss.windup.web.messaging.executor;

import java.util.logging.Level;
import java.util.logging.Logger;

import javax.inject.Inject;
import javax.jms.ConnectionFactory;
import javax.jms.JMSContext;
import javax.jms.Message;
import javax.jms.Queue;
import javax.jms.Topic;

import org.jboss.windup.web.addons.websupport.WebPathUtil;
import org.jboss.windup.web.services.model.WindupExecution;

/**
 * @author <a href="mailto:jesse.sightler@gmail.com">Jesse Sightler</a>
 */
public class JavaSEJMSServiceAdapter implements JMSServiceAdapter
{
    private static Logger LOG = Logger.getLogger(JavaSEJMSServiceAdapter.class.getName());

    @Inject
    private WebPathUtil webPathUtil;

    @Inject
    private ExecutionSerializerRegistry executionSerializerRegistry;

    private ConnectionFactory connectionFactory;
    private JMSContext jmsContext;
    private Queue executorQueue;
    private Queue statusUpdateQueue;
    private Topic cancellationTopic;

    public JavaSEJMSServiceAdapter()
    {

    }

    public void init(ConnectionFactory connectionFactory, JMSContext jmsContext, Queue executorQueue, Queue statusUpdateQueue,
                Topic cancellationTopic)
    {
        this.connectionFactory = connectionFactory;
        this.jmsContext = jmsContext;
        this.executorQueue = executorQueue;
        this.statusUpdateQueue = statusUpdateQueue;
        this.cancellationTopic = cancellationTopic;
    }

    @Override
    public void sendStatusUpdate(Long projectId, WindupExecution execution)
    {
        try
        {
            Message message = this.executionSerializerRegistry.getDefaultSerializer()
                    .serializeStatusUpdate(jmsContext, projectId, execution, false);

            jmsContext.createProducer().send(getStatusUpdateQueue(), message);
        }
        catch (Throwable e)
        {
            LOG.log(Level.WARNING, "Could not serialize execution update message due to: " + e.getMessage(), e);
        }
    }

    @Override
    public void sendCompleted(Long projectID, WindupExecution execution)
    {
        try
        {
            Message message = this.executionSerializerRegistry.getDefaultSerializer()
                    .serializeStatusUpdate(jmsContext, projectID, execution, true);
            jmsContext.createProducer().send(getStatusUpdateQueue(), message);
        }
        catch (Exception e)
        {
            LOG.log(Level.WARNING, "Could not send JMS update message due to: " + e.getMessage(), e);
        }
    }

    public ConnectionFactory getConnectionFactory()
    {
        return this.connectionFactory;
    }

    public JMSContext getJmsContext()
    {
        return this.jmsContext;
    }

    public Queue getExecutorQueue()
    {
        return this.executorQueue;
    }

    public Queue getStatusUpdateQueue()
    {
        return this.statusUpdateQueue;
    }

    public Topic getCancellationTopic()
    {
        return this.cancellationTopic;
    }

}
