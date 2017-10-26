package org.jboss.windup.web.services.messaging;

import javax.jms.Message;
import javax.jms.ObjectMessage;
import java.util.logging.Logger;

/**
 * @author <a href="mailto:jesse.sightler@gmail.com">Jesse Sightler</a>
 */
public class AbstractMDB {
    private static Logger LOG = Logger.getLogger(AbstractMDB.class.getName());

    protected boolean validatePayload(Class<?> expectedPayloadType, Message message)
    {
        if (!(message instanceof ObjectMessage))
        {
            LOG.severe("Unrecognized message type received: " + message + " and expected ObjectMessage!");
            return false;
        }

        ObjectMessage objectMessage = (ObjectMessage) message;
        try
        {
            if (objectMessage.getObject() == null || !expectedPayloadType.isAssignableFrom(objectMessage.getObject().getClass()))
            {
                LOG.severe("Unrecognized payload type received!");
                return false;
            }
        }
        catch (Throwable t)
        {
            LOG.severe("Could not get wrapped object due to: " + t.getMessage());
            return false;
        }

        return true;
    }
}
