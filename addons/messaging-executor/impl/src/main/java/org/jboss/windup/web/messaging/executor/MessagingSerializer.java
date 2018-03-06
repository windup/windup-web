package org.jboss.windup.web.messaging.executor;

import java.io.BufferedInputStream;
import java.io.BufferedOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.HashSet;
import java.util.Set;
import java.util.logging.Level;
import java.util.logging.Logger;

import javax.inject.Inject;
import javax.jms.JMSContext;
import javax.jms.JMSException;
import javax.jms.Message;
import javax.jms.StreamMessage;
import javax.jms.TextMessage;

import org.jboss.windup.util.TarUtil;
import org.jboss.windup.web.addons.websupport.WebPathUtil;
import org.jboss.windup.web.services.json.WindupExecutionJSONUtil;
import org.jboss.windup.web.services.model.RegisteredApplication;
import org.jboss.windup.web.services.model.WindupExecution;
import org.kamranzafar.jtar.TarEntry;
import org.kamranzafar.jtar.TarInputStream;
import org.kamranzafar.jtar.TarOutputStream;

/**
 * Implements the given serialization and deserialization method using the message bus and A-MQ large message support to transmit and receive
 * messages.
 *
 * @author <a href="mailto:jesse.sightler@gmail.com">Jesse Sightler</a>
 */
public class MessagingSerializer extends AbstractSerializer implements ExecutionSerializer
{
    private static Logger LOG = Logger.getLogger(MessagingSerializer.class.getName());

    @Inject
    private WebPathUtil webPathUtil;

    @Override
    public String getName()
    {
        return ExecutionSerializerRegistry.AMQ_LARGE_MESSAGE_SERIALIZER;
    }

    @Override
    public Message serializeExecutionRequest(JMSContext context, WindupExecution execution)
    {
        // Zip up the input files
        StreamMessage executionRequestMessage = context.createStreamMessage();
        try
        {
            executionRequestMessage.setLongProperty("projectId", execution.getProjectId());
            executionRequestMessage.setLongProperty("executionId", execution.getId());
            executionRequestMessage.setObjectProperty(AMQConstants.AMQ_LARGE_MESSAGE_INPUTSTREAM_PROPERTY, getOutputFiles(execution));
            executionRequestMessage.reset();
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
            StreamMessage streamMessage = (StreamMessage) message;
            Long projectID = streamMessage.getLongProperty("projectId");
            Long executionID = streamMessage.getLongProperty("executionId");

            Path outputDirectory = this.webPathUtil.createWindupReportOutputPath(String.valueOf(projectID),
                        String.valueOf(executionID));
            Files.createDirectories(outputDirectory);
            Path tempFile = outputDirectory.resolve("execution_files.tar");
            message.setObjectProperty(AMQConstants.AMQ_LARGE_MESSAGE_SAVESTREAM_PROPERTY, new FileOutputStream(tempFile.toFile()));

            Path inputFilesDirectory = outputDirectory.getParent().resolve("input_files")
                        .resolve(String.valueOf(executionID));
            Files.createDirectories(inputFilesDirectory);
            Set<String> newInputFiles = new HashSet<>();

            try (FileInputStream tarFIS = new FileInputStream(tempFile.toFile()))
            {
                TarInputStream tarInputStream = new TarInputStream(tarFIS);
                TarEntry tarEntry;
                while ((tarEntry = tarInputStream.getNextEntry()) != null)
                {
                    int count;
                    byte data[] = new byte[32768];
                    String outputFile = inputFilesDirectory + "/" + tarEntry.getName();
                    newInputFiles.add(outputFile);
                    LOG.info("Creating output file: " + outputFile);
                    FileOutputStream fos = new FileOutputStream(outputFile);
                    try (BufferedOutputStream dest = new BufferedOutputStream(fos))
                    {
                        while ((count = tarInputStream.read(data)) != -1)
                        {
                            dest.write(data, 0, count);
                        }
                    }
                }
            }

            File executionJsonFile = inputFilesDirectory.resolve("execution.json").toFile();
            WindupExecution execution = WindupExecutionJSONUtil.readJSONFromFile(executionJsonFile);

            execution.getAnalysisContext().getApplications()
                        .forEach(application -> {
                            for (String newInputFile : newInputFiles)
                            {
                                if (Paths.get(newInputFile).getFileName().toString()
                                            .equals(Paths.get(application.getInputPath()).getFileName().toString()))
                                {
                                    application.setInputPath(newInputFile);
                                }
                            }
                        });

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
        if (includeReportOutput)
        {
            // Analysis is complete, so send it along with the report data
            return serializeStatusUpdateAndReportData(context, projectId, execution);
        }
        else
        {
            // Just use the default behavior in this case
            return super.serializeStatusUpdate(context, projectId, execution, includeReportOutput);
        }
    }

    private Message serializeStatusUpdateAndReportData(JMSContext context, Long projectId, WindupExecution execution)
    {
        try
        {
            Path outputDirectory = this.webPathUtil.createWindupReportOutputPath(String.valueOf(projectId),
                    String.valueOf(execution.getId()));
            Path resultsArchivePath = this.createResultArchive(projectId, execution, outputDirectory);

            StreamMessage streamMessage = context.createStreamMessage();
            streamMessage.setObjectProperty(AMQConstants.AMQ_LARGE_MESSAGE_INPUTSTREAM_PROPERTY, new FileInputStream(resultsArchivePath.toFile()));
            streamMessage.setLongProperty("projectId", projectId);
            streamMessage.setLongProperty("executionId", execution.getId());
            return streamMessage;
        }
        catch (Exception e)
        {
            LOG.log(Level.WARNING, "Could not send JMS update message due to: " + e.getMessage(), e);
            throw new RuntimeException(e);
        }
    }

    @Override
    public WindupExecution deserializeStatusUpdate(Message message, WindupExecution lastStatusFromDB)
    {
        if (message instanceof StreamMessage)
        {
            return deserializeStatusUpdateFromStream((StreamMessage) message, lastStatusFromDB);
        }
        else if (message instanceof TextMessage)
        {
            return super.deserializeStatusUpdate(message, lastStatusFromDB);
        }
        else
        {
            throw new RuntimeException("Unrecognized message type for received message: " + message);
        }
    }

    private WindupExecution deserializeStatusUpdateFromStream(StreamMessage streamMessage, WindupExecution lastStatusFromDB)
    {
        // this is a results message with final result contents, untar the results
        try
        {
            Path outputPath = Paths.get(lastStatusFromDB.getOutputPath());

            Path tempFile = outputPath.resolve("report_files.tar");
            streamMessage.setObjectProperty(AMQConstants.AMQ_LARGE_MESSAGE_SAVESTREAM_PROPERTY, new FileOutputStream(tempFile.toFile()));

            TarUtil.untar(outputPath, tempFile);
        }
        catch (Exception e)
        {
            LOG.log(Level.SEVERE, "Error handling status result with contents due to: " + e.getMessage(), e);
        }
        return lastStatusFromDB;
    }

    private InputStream getOutputFiles(WindupExecution execution) throws IOException
    {
        Path outputDirectory = this.webPathUtil.createWindupReportOutputPath(execution.getProject().getId().toString(), execution.getId().toString());
        Files.createDirectories(outputDirectory);
        Path tempFile = outputDirectory.resolve("execution_files.tar");
        try (FileOutputStream tempFileOS = new FileOutputStream(tempFile.toFile()))
        {
            TarOutputStream tarOutputStream = new TarOutputStream(tempFileOS);

            File executionJsonFile = outputDirectory.resolve("execution.json").toFile();
            WindupExecutionJSONUtil.serializeToFile(executionJsonFile, execution);
            addFileToTar(tarOutputStream, executionJsonFile.getAbsolutePath());

            for (RegisteredApplication application : execution.getAnalysisContext().getApplications())
            {
                addFileToTar(tarOutputStream, application.getInputPath());
            }
            tarOutputStream.flush();
            tarOutputStream.close();
        }

        return new FileInputStream(tempFile.toFile());
    }

    private void addFileToTar(TarOutputStream tarOutputStream, String path) throws IOException
    {
        File file = new File(path);
        tarOutputStream.putNextEntry(new TarEntry(file, file.getName()));
        try (BufferedInputStream origin = new BufferedInputStream(new FileInputStream(file)))
        {
            int count;
            byte data[] = new byte[2048];

            while ((count = origin.read(data)) != -1)
            {
                tarOutputStream.write(data, 0, count);
            }
            tarOutputStream.flush();
        }
    }
}
