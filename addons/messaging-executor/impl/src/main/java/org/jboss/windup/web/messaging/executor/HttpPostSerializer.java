package org.jboss.windup.web.messaging.executor;

import java.io.BufferedOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.net.URL;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.HashSet;
import java.util.Set;
import java.util.logging.Level;
import java.util.logging.Logger;

import javax.inject.Inject;
import javax.jms.JMSContext;
import javax.jms.Message;

import org.apache.commons.io.FileUtils;
import org.apache.commons.lang3.StringUtils;
import org.apache.http.HttpEntity;
import org.apache.http.HttpResponse;
import org.apache.http.client.HttpClient;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.entity.ContentType;
import org.apache.http.entity.mime.MultipartEntityBuilder;
import org.apache.http.entity.mime.content.InputStreamBody;
import org.apache.http.impl.client.HttpClientBuilder;
import org.apache.http.protocol.BasicHttpContext;
import org.apache.http.protocol.HttpContext;
import org.jboss.windup.web.addons.websupport.WebPathUtil;
import org.jboss.windup.web.services.model.ExecutionState;
import org.jboss.windup.web.services.model.WindupExecution;
import org.kamranzafar.jtar.TarEntry;
import org.kamranzafar.jtar.TarInputStream;

/**
 * @author <a href="mailto:jesse.sightler@gmail.com">Jesse Sightler</a>
 */
public class HttpPostSerializer extends AbstractSerializer implements ExecutionSerializer
{
    public static final String SYSTEM_PROPERTY_HTTP_POST_URL = "windup.result.post.url";
    public static final String SYSTEM_PROPERTY_HTTP_DOWNLOAD_URL = "windup.result.get.url";

    private static Logger LOG = Logger.getLogger(HttpPostSerializer.class.getCanonicalName());

    @Inject
    private WebPathUtil webPathUtil;

    @Override
    public String getName()
    {
        return ExecutionSerializerRegistry.HTTP_POST_SERIALIZER;
    }

    @Override
    public ExecutionRequest deserializeExecutionRequest(Message message)
    {
        ExecutionRequest executionRequest = super.deserializeExecutionRequest(message);
        // Download the tar file and deserialize it locally
        try
        {
            downloadRequestFiles(executionRequest);
        }
        catch (IOException e)
        {
            throw new RuntimeException(e);
        }

        return executionRequest;
    }

    @Override
    public Message serializeStatusUpdate(JMSContext context, Long projectId, WindupExecution execution, boolean includeReportOutput)
    {
        if (includeReportOutput)
        {
            LOG.info("Creating results archive for: " + projectId);
            Path outputDirectory = this.webPathUtil.createWindupReportOutputPath(String.valueOf(projectId),
                        String.valueOf(execution.getId()));

            // This contains the input and output files
            Path analysisDirectory = outputDirectory.getParent();

            Path resultsArchivePath = this.createResultArchive(projectId, execution, outputDirectory);
            File resultsArchivePathFile = resultsArchivePath.toFile();
            LOG.info("Completed generating result archive (" + (resultsArchivePathFile.length() / 1048576) + " MB), posting results to the server...");

            // Send the post data to the rhamt core service
            try (FileInputStream fileInputStream = new FileInputStream(resultsArchivePathFile))
            {
                sendResults(execution.getId(), fileInputStream);
                LOG.info("Results posted, analysis is now complete!");
            }
            catch (Throwable e)
            {
                // Make sure to set it to failed if there was a failure posting the results.
                execution.setState(ExecutionState.FAILED);
                String errorMessage = "Failed to post results due to: " + e.getMessage();
                execution.setCurrentTask(errorMessage);

                LOG.log(Level.SEVERE, errorMessage, e);
            }
            finally
            {
                try
                {
                    LOG.info("Cleaning up analysis directory: " + analysisDirectory.toFile());
                    FileUtils.deleteDirectory(analysisDirectory.toFile());
                    analysisDirectory.toFile().delete();
                }
                catch (IOException e)
                {
                    LOG.warning("Failed to purge analysis directory: " + analysisDirectory.toString());
                }

                try
                {
                    Path inputFilesDirectory = outputDirectory.getParent().resolve("input_files")
                            .resolve(String.valueOf(execution.getId()));
                    LOG.info("Cleaning up analysis directory: " + inputFilesDirectory.toFile());
                    FileUtils.deleteDirectory(inputFilesDirectory.toFile());
                    inputFilesDirectory.toFile().delete();
                }
                catch (IOException e)
                {
                    LOG.warning("Failed to purge analysis directory: " + analysisDirectory.toString());
                }
            }
        }

        // Do this last, to insure that we have sent the data before sending the final status update message
        Message resultMessage = super.serializeStatusUpdate(context, projectId, execution, includeReportOutput);
        return resultMessage;
    }

    private void downloadRequestFiles(ExecutionRequest request) throws IOException
    {
        Path outputDirectory = this.webPathUtil.createWindupReportOutputPath(String.valueOf(request.getProjectID()),
                    String.valueOf(request.getExecution().getId()));
        Files.createDirectories(outputDirectory);

        Path inputFilesDirectory = outputDirectory.getParent().resolve("input_files")
                    .resolve(String.valueOf(request.getExecution().getId()));
        Files.createDirectories(inputFilesDirectory);
        Set<String> newInputFiles = new HashSet<>();

        String url = System.getProperty(SYSTEM_PROPERTY_HTTP_DOWNLOAD_URL);
        LOG.info("Getting execution request data from: " + url);
        if (StringUtils.isBlank(url))
            throw new RuntimeException("No '" + SYSTEM_PROPERTY_HTTP_DOWNLOAD_URL + "' System Property specified!");

        url = url + "/" + request.getExecution().getId();

        try (InputStream httpIS = new URL(url).openStream())
        {
            TarInputStream tarInputStream = new TarInputStream(httpIS);
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

        request.getExecution().getAnalysisContext().getApplications()
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
    }

    private void sendResults(long executionId, InputStream inputStream) throws IOException
    {
        String url = System.getProperty(SYSTEM_PROPERTY_HTTP_POST_URL);
        LOG.info("Posting results to: " + url);
        if (StringUtils.isBlank(url))
            throw new RuntimeException("No '" + SYSTEM_PROPERTY_HTTP_POST_URL + "' System Property specified!");

        url = url + "/" + executionId;

        HttpClient httpClient = HttpClientBuilder.create().build();
        HttpContext httpContext = new BasicHttpContext();

        String fileName = "execution_files.tar";

        HttpPost httpPost = new HttpPost(url);
        HttpEntity entity = MultipartEntityBuilder.create()
                    .addPart("file", new InputStreamBody(inputStream, ContentType.APPLICATION_OCTET_STREAM, fileName))
                    .build();
        httpPost.setEntity(entity);
        HttpResponse postResponse = httpClient.execute(httpPost, httpContext);
        int responseCode = postResponse.getStatusLine().getStatusCode();
        if (responseCode < 200 || responseCode >= 300)
        {
            throw new RuntimeException("Failed to post results due to error: " + postResponse.getStatusLine().getReasonPhrase());
        }
    }
}
