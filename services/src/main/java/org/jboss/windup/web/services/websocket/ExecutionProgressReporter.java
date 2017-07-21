package org.jboss.windup.web.services.websocket;

import java.io.IOException;
import java.io.Serializable;
import java.util.Collections;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;
import java.util.logging.Level;
import java.util.logging.Logger;

import javax.enterprise.event.Observes;
import javax.inject.Inject;
import javax.jms.JMSException;
import javax.jms.Message;
import javax.jms.ObjectMessage;
import javax.websocket.CloseReason;
import javax.websocket.OnClose;
import javax.websocket.OnMessage;
import javax.websocket.Session;
import javax.websocket.server.PathParam;
import javax.websocket.server.ServerEndpoint;

import org.hawkular.accounts.websocket.Authenticator;
import org.hawkular.accounts.websocket.WebsocketAuthenticationException;
import org.jboss.windup.web.services.messaging.AbstractMDB;
import org.jboss.windup.web.services.model.WindupExecution;

import com.fasterxml.jackson.databind.ObjectMapper;

/**
 * @author <a href="mailto:dklingenberg@gmail.com">David Klingenberg</a>
 */
@ServerEndpoint("/websocket/execution-progress/{executionId}")
public class ExecutionProgressReporter extends AbstractMDB implements Serializable
{

    @Inject
    private Authenticator authenticator;

    // server endpoint (per JVM)
    private static final Map<Long, Set<Session>> sessions = Collections.synchronizedMap(new HashMap<Long, Set<Session>>());

    // private static final Set<Session> sessions = Collections.synchronizedSet(new HashSet<Session>());
    private static final Logger LOG = Logger.getLogger(ExecutionProgressReporter.class.getName());

    @OnClose
    public void onClose(Session session, CloseReason reason, @PathParam("executionId") Long executionId)
    {
        if (sessions.containsKey(executionId))
        {
            Set<Session> executionSessions = sessions.get(executionId);

            executionSessions.remove(session);

            if (executionSessions.isEmpty())
            {
                sessions.remove(executionId);
            }
        }
    }

    @OnMessage
    public void onMessage(Session session, String message, @PathParam("executionId") Long executionId)
    {
        authenticate(session, message);

        if (!sessions.containsKey(executionId))
        {
            sessions.put(executionId, Collections.synchronizedSet(new HashSet<>()));
        }

        sessions.get(executionId).add(session);
    }

    private void authenticate(Session session, String message)
    {

        try
        {
            authenticator.authenticateWithMessage(message, session);
        }
        catch (WebsocketAuthenticationException e)
        {
            try
            {
                session.close(new CloseReason(CloseReason.CloseCodes.CLOSED_ABNORMALLY, e.getLocalizedMessage()));
            }
            catch (IOException e1)
            {
                LOG.warning(e.getMessage());
            }
        }
    }

    /**
     * Listens to JMS events from StatusUpdateMDB
     * 
     * @see org.jboss.windup.web.services.messaging.StatusUpdateMDB
     * 
     * @param msg
     */
    public void onJMSMessage(@Observes @WSJMSMessage Message msg)
    {
        if (!validatePayload(WindupExecution.class, msg))
        {
            return;
        }

        try
        {
            WindupExecution execution = (WindupExecution) ((ObjectMessage) msg).getObject();

            for (Session session : sessions.getOrDefault(execution.getId(), new HashSet<>()))
            {
                ObjectMapper objectMapper = new ObjectMapper();
                String serializedObject = objectMapper.writeValueAsString(execution);

                session.getBasicRemote().sendText(serializedObject);
            }
        }
        catch (IOException | JMSException ex)
        {
            LOG.log(Level.SEVERE, "Exception during receiving JMS message", ex);
        }
    }
}
