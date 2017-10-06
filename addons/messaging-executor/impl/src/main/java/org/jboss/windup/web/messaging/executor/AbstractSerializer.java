package org.jboss.windup.web.messaging.executor;

import org.jboss.windup.web.services.json.WindupExecutionJSONUtil;
import org.jboss.windup.web.services.model.WindupExecution;

import javax.jms.JMSContext;
import javax.jms.JMSException;
import javax.jms.Message;
import javax.jms.StreamMessage;
import javax.jms.TextMessage;
import java.io.BufferedOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.HashSet;
import java.util.Set;

/**
 * @author <a href="mailto:jesse.sightler@gmail.com">Jesse Sightler</a>
 */
public abstract class AbstractSerializer implements ExecutionSerializer
{
    @Override
    public Message serializeExecutionRequest(JMSContext context, WindupExecution execution)
    {
        // Zip up the input files
        TextMessage executionRequestMessage = context.createTextMessage();
        try
        {
            executionRequestMessage.setLongProperty("projectId", execution.getProjectId());
            executionRequestMessage.setLongProperty("executionId", execution.getId());
            String json = WindupExecutionJSONUtil.serializeToString(execution);
            executionRequestMessage.setText(json);
            return executionRequestMessage;
        }
        catch (JMSException | IOException e)
        {
            throw new RuntimeException("Failed to create WindupExecution stream message!", e);
        }
    }

    @Override
    public ExecutionRequest deserializeExecutionRequest(Message message)
    {
        try
        {
            TextMessage textMessage = (TextMessage) message;
            Long projectID = textMessage.getLongProperty("projectId");

            WindupExecution execution = WindupExecutionJSONUtil.readJSON(textMessage.getText());
            return new ExecutionRequest(projectID, execution);
        }
        catch (Exception e)
        {
            throw new RuntimeException("Failed to deserialize message due to: " + e.getMessage(), e);
        }
    }

    @Override
    public Message serializeStatusUpdate(JMSContext context, Long projectId, WindupExecution execution, boolean includeReportOutput)
    {
        try
        {
            String json = WindupExecutionJSONUtil.serializeToString(execution);
            TextMessage textMessage = context.createTextMessage(json);
            textMessage.setLongProperty("projectId", projectId);
            textMessage.setLongProperty("executionId", execution.getId());
            return textMessage;
        }
        catch (Exception e)
        {
            throw new RuntimeException("Failed to create status update textmessage due to: " + e.getMessage(), e);
        }
    }

    @Override
    public WindupExecution deserializeStatusUpdate(Message message, WindupExecution lastStatusFromDB)
    {
        if (message instanceof TextMessage)
        {
            return deserializeStatusUpdateFromText((TextMessage) message);
        }
        else
        {
            throw new RuntimeException("Unrecognized message type for received message: " + message);
        }
    }

    private WindupExecution deserializeStatusUpdateFromText(TextMessage textMessage)
    {
        try
        {
            return WindupExecutionJSONUtil.readJSON(textMessage.getText());
        }
        catch (Exception e)
        {
            throw new RuntimeException("Error deserializing message due to: " + e.getMessage(), e);
        }
    }
}
