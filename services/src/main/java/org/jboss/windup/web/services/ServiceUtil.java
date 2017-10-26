package org.jboss.windup.web.services;

import javax.jms.ConnectionFactory;
import javax.jms.JMSContext;
import javax.jms.Queue;
import javax.naming.InitialContext;
import javax.naming.NamingException;
import javax.transaction.UserTransaction;
import java.util.logging.Logger;

/**
 * This contains useful utility methods for the services module.
 *
 * @author <a href="mailto:jesse.sightler@gmail.com">Jesse Sightler</a>
 */
public class ServiceUtil
{
    private static Logger LOG = Logger.getLogger(ServiceUtil.class.getSimpleName());

    /**
     * Lookup a JMS Queue.
     */
    public static Queue getJMSQueue(String jndiName)
    {
        return lookup("JMSQueue", Queue.class, jndiName);
    }

    /**
     * Lookup the JMSContext from JNDI.
     */
    public static JMSContext getJMSContext()
    {
        String localCF = "java:/ConnectionFactory";
        LOG.info("Getting local connection factory: " + localCF);
        ConnectionFactory connectionFactory = lookup("JMSContext", ConnectionFactory.class, localCF);
        return connectionFactory.createContext();
    }

    /**
     * Lookup the JMSContext from JNDI.
     */
    public static JMSContext getJMSContextRemote()
    {
        String remoteCF = "java:/jms/remoteCF";
        LOG.info("Getting remote connection factory: " + remoteCF);
        ConnectionFactory connectionFactory = lookup("JMSContext", ConnectionFactory.class, remoteCF);
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
