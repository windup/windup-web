package org.jboss.windup.web.services;

import javax.jms.ConnectionFactory;
import javax.jms.JMSContext;
import javax.jms.Queue;
import javax.jms.Topic;
import javax.naming.InitialContext;
import javax.naming.NamingException;
import javax.transaction.UserTransaction;

/**
 * This contains useful utility methods for the services module.
 *
 * @author <a href="mailto:jesse.sightler@gmail.com">Jesse Sightler</a>
 * @author <a href="mailto:zizka@seznam.cz">Ondrej Zizka</a>
 */
public class ServiceUtil
{

    /**
     * Lookup a JMS Queue.
     */
    public static Queue getJMSQueue(String jndiName)
    {
        return lookup("JMSQueue", Queue.class, jndiName);
    }

    /**
     * Lookup a JMS topic.
     */
    public static Topic getJMSTopic(String jndiName)
    {
        return lookup("JMSTopic", Topic.class, jndiName);
    }

    /**
     * Lookup the JMSContext from JNDI.
     */
    public static JMSContext getJMSContext()
    {
        ConnectionFactory connectionFactory = lookup("JMSContext", ConnectionFactory.class, "java:/ConnectionFactory");
        return connectionFactory.createContext();
    }

    /**
     * Lookup the {@link UserTransaction} manually from the container.
     */
    public static UserTransaction getUserTransaction()
    {
        return lookup("UserTransaction", UserTransaction.class, "java:jboss/UserTransaction");
    }

    private static <T> T lookup(String description, Class<T> clazz, String jndiName)
    {
        try
        {
            // Begin of task
            InitialContext ctx = new InitialContext();
            return (T) ctx.lookup(jndiName);
        }
        catch (NamingException e)
        {
            throw new RuntimeException("Failed to lookup " + description + " due to: " + e.getMessage());
        }
    }
}
