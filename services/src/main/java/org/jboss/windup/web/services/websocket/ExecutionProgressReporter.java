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
import javax.jms.JMSException;
import javax.jms.Message;
import javax.jms.TextMessage;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.websocket.CloseReason;
import javax.websocket.EndpointConfig;
import javax.websocket.OnClose;
import javax.websocket.OnMessage;
import javax.websocket.OnOpen;
import javax.websocket.Session;
import javax.websocket.server.PathParam;
import javax.websocket.server.ServerEndpoint;

import org.apache.commons.lang3.StringUtils;
import org.jboss.windup.web.services.KeycloakAuthenticationException;
import org.jboss.windup.web.services.KeycloakAuthenticator;
import org.jboss.windup.web.services.json.WindupExecutionJSONUtil;
import org.jboss.windup.web.services.messaging.AbstractMDB;
import org.jboss.windup.web.services.model.WindupExecution;
import org.json.JSONException;
import org.json.JSONObject;

import io.undertow.websockets.core.WebSocketChannel;
import io.undertow.websockets.jsr.UndertowSession;

/**
 * @author <a href="mailto:dklingenberg@gmail.com">David Klingenberg</a>
 */
@ServerEndpoint(value = "/websocket/execution-progress/{executionId}")
public class ExecutionProgressReporter extends AbstractMDB implements Serializable
{

    // server endpoint (per JVM)
    private static final Map<Long, Set<Session>> sessions = Collections.synchronizedMap(new HashMap<Long, Set<Session>>());

    // private static final Set<Session> sessions = Collections.synchronizedSet(new HashSet<Session>());
    private static final Logger LOG = Logger.getLogger(ExecutionProgressReporter.class.getName());

    @PersistenceContext
    private EntityManager entityManager;

    @OnClose
    public void onClose(Session session, CloseReason reason, @PathParam("executionId") Long executionId)
    {
        LOG.fine("Closing session: " + session + " reason: " + reason + " executionId: " + executionId);
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

    @OnOpen
    public void open(Session session, EndpointConfig config)
    {
        // Get the thread local context (created by WebSocketContextConfigurator) and attach the
        // data to the session
        LOG.fine("Opening session: " + session);

        if (session instanceof UndertowSession)
        {
            UndertowSession undertowSession = (UndertowSession) session;
            WebSocketChannel webSocketChannel = undertowSession.getWebSocketChannel();
            String url = webSocketChannel.getUrl();
            String propertiesHost = System.getProperty("keycloak.token.verify.host");
            if (StringUtils.isBlank(propertiesHost) && !StringUtils.isBlank(url) && (url.startsWith("ws://") || url.startsWith("wss://")))
            {
                try
                {
                    String serverHost = url.substring(5);
                    if (serverHost.startsWith("/"))
                        serverHost = serverHost.substring(1);

                    serverHost = serverHost.substring(0, serverHost.indexOf("/"));
                    session.getUserProperties().put("Host", serverHost);
                    session.getUserProperties().put("isSSL", url.startsWith("wss://"));
                }
                catch (Exception e)
                {
                    LOG.warning("Could not parse ws url (" + url + ") due to: " + e.getMessage());
                }
            }
            else
            {
                String propertiesPort = System.getProperty("keycloak.token.verify.port");
                if (!StringUtils.isBlank(propertiesPort))
                    propertiesHost += ":" + propertiesPort;

                session.getUserProperties().put("Host", propertiesHost);
                session.getUserProperties().put("isSSL", false);
            }
            LOG.fine("URL: " + url + " host " + session.getUserProperties().get("Host") + " isSSL: " + session.getUserProperties().get("isSSL"));
        }

    }

    @OnMessage
    public void onMessage(Session session, String message, @PathParam("executionId") Long executionId)
    {
        LOG.fine("Execution id: " + executionId + " message received: " + message);
        Boolean isSSL = (Boolean) session.getUserProperties().get("isSSL");
        String serverHost = (String) session.getUserProperties().get("Host");
        authenticate(isSSL, serverHost, session, message);

        if (!sessions.containsKey(executionId))
        {
            sessions.put(executionId, Collections.synchronizedSet(new HashSet<>()));
        }

        sessions.get(executionId).add(session);
    }

    private void authenticate(boolean ssl, String serverHost, Session session, String message)
    {
        LOG.fine("Authenticating request, ssl: " + ssl + ", serverHost: " + serverHost + ", message: " + message);
        try
        {
            String token = null;
            try
            {
                JSONObject jsonObject = new JSONObject(message);
                JSONObject authenticationObject = jsonObject.getJSONObject("authentication");
                if (authenticationObject == null)
                    throw new KeycloakAuthenticationException("Authentication message did not contain a token");

                token = authenticationObject.getString("token");
                if (token == null)
                    throw new KeycloakAuthenticationException("Authentication message did not contain a token");
            }
            catch (JSONException e)
            {
                throw new KeycloakAuthenticationException("Unable to parse message due to: " + e.getMessage());
            }

            LOG.fine("Sending authentication request...");
            KeycloakAuthenticator.validateToken(ssl, serverHost, token);
            LOG.fine("Authentication successful!");
        }
        catch (KeycloakAuthenticationException e)
        {
            LOG.log(Level.WARNING, "Received a request with an invalid token", e);
            try
            {
                String errorMessage = e.getLocalizedMessage();

                // Shorten the message to meet the standards for "CloseReason" (only allows 122 chars)
                if (StringUtils.isNotBlank(errorMessage) && errorMessage.length() >= 122)
                    errorMessage = errorMessage.substring(0, 122);

                session.close(new CloseReason(CloseReason.CloseCodes.CLOSED_ABNORMALLY, errorMessage));
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
        if (!(msg instanceof TextMessage))
        {
            // We only care about text messages.
            return;
        }

        try
        {
            TextMessage textMessage = (TextMessage) msg;
            WindupExecution execution = WindupExecutionJSONUtil.readJSON(textMessage.getText());

            // Refresh from the DB for the latest data
            execution = this.entityManager.find(WindupExecution.class, execution.getId());
            LOG.fine("Sending status update message for execution id: " + execution);

            for (Session session : sessions.getOrDefault(execution.getId(), new HashSet<>()))
            {
                LOG.fine("Sending status update message for execution id: " + execution + " to session: " + session);
                String serializedObject = WindupExecutionJSONUtil.serializeToString(execution);
                session.getBasicRemote().sendText(serializedObject);
            }
        }
        catch (IOException | JMSException ex)
        {
            LOG.log(Level.SEVERE, "Exception during receiving JMS message", ex);
        }
    }
}
