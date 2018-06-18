package org.jboss.windup.web.services.rest;

import java.io.BufferedInputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.net.URL;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Collection;
import java.util.Enumeration;
import java.util.List;
import java.util.Map;
import java.util.Properties;
import java.util.jar.Manifest;
import java.util.logging.Level;
import java.util.logging.Logger;

import javax.ejb.Stateless;
import javax.inject.Inject;
import javax.persistence.EntityManager;
import javax.persistence.OptimisticLockException;
import javax.persistence.PersistenceContext;
import javax.ws.rs.BadRequestException;
import javax.ws.rs.NotFoundException;

import org.apache.commons.lang3.StringUtils;
import org.jboss.resteasy.plugins.providers.multipart.InputPart;
import org.jboss.resteasy.plugins.providers.multipart.MultipartFormDataInput;
import org.jboss.windup.config.GraphRewrite;
import org.jboss.windup.util.TarUtil;
import org.jboss.windup.web.addons.websupport.WebPathUtil;
import org.jboss.windup.web.addons.websupport.services.LogService;
import org.jboss.windup.web.furnaceserviceprovider.FromFurnace;
import org.jboss.windup.web.services.json.WindupExecutionJSONUtil;
import org.jboss.windup.web.services.model.AnalysisContext;
import org.jboss.windup.web.services.model.MigrationProject;
import org.jboss.windup.web.services.model.RegisteredApplication;
import org.jboss.windup.web.services.model.WindupExecution;
import org.jboss.windup.web.services.service.WindupExecutionService;
import org.kamranzafar.jtar.TarEntry;
import org.kamranzafar.jtar.TarOutputStream;

@Stateless
public class WindupEndpointImpl implements WindupEndpoint
{
    private static Logger LOG = Logger.getLogger(WindupEndpointImpl.class.getSimpleName());

    private static int MAX_LOG_SIZE = 1024 * 1024 * 3; // 3 Megabytes
    private static String cachedCoreVersion = null;
    private static String cachedCoreScmRevision = null;

    @PersistenceContext
    private EntityManager entityManager;
    @Inject
    private WindupExecutionService windupExecutionService;
    @Inject
    @FromFurnace
    private LogService logService;
    @Inject
    @FromFurnace
    private WebPathUtil webPathUtil;

    /**
     * @see org.jboss.windup.web.services.messaging.ExecutorMDB
     */
    @Override
    public WindupExecution executeProjectWithContext(AnalysisContext originalContext, Long projectId)
    {
        if (originalContext == null)
        {
            throw new BadRequestException("AnalysisContext must be provided");
        }

        if (originalContext.getApplications().size() == 0)
        {
            throw new BadRequestException("Cannot execute windup without selected applications");
        }

        return this.windupExecutionService.executeProjectWithContext(originalContext, projectId);
    }

    @Override
    public Collection<WindupExecution> getAllExecutions()
    {
        return this.entityManager.createQuery("SELECT ex from " + WindupExecution.class.getSimpleName() + " ex").getResultList();
    }

    @Override
    public WindupExecution getExecution(Long executionId)
    {
        return this.windupExecutionService.get(executionId);
    }

    @Override
    public void cancelExecution(Long executionID)
    {
        for (int i = 0; i < 10; i++)
        {
            try
            {
                this.windupExecutionService.cancelExecution(executionID);
                return;
            }
            catch (Exception e)
            {
                if (!isOptimisticLockException(e))
                    return;

                LOG.info("Optimistic lock on first cancellation attempt for execution: " + executionID + "... trying again.");
                try
                {
                    Thread.sleep(5000L);
                }
                catch (Exception ignored)
                {
                }
            }
        }
    }

    private boolean isOptimisticLockException(Throwable e)
    {
        if (e instanceof OptimisticLockException)
            return true;
        else
            return isOptimisticLockException(e.getCause());
    }

    @Override
    public Collection<WindupExecution> getProjectExecutions(Long projectId)
    {
        if (projectId == null)
        {
            throw new BadRequestException("Invalid projectId");
        }

        MigrationProject project = this.entityManager.find(MigrationProject.class, projectId);

        if (project == null)
        {
            throw new NotFoundException("Migration project with id: " + projectId + " not found");
        }

        return this.entityManager.createQuery("SELECT ex FROM WindupExecution ex WHERE ex.project = :project", WindupExecution.class)
                    .setParameter("project", project)
                    .getResultList();
    }

    @Override
    public InputStream getExecutionRequestTar(long executionId)
    {
        WindupExecution execution = this.getExecution(executionId);

        Path outputDirectory = this.webPathUtil.createWindupReportOutputPath(execution.getProject().getId().toString(), execution.getId().toString());
        try
        {
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
        catch (IOException e)
        {
            throw new RuntimeException("Error creating request data: " + e.getMessage(), e);
        }
    }

    private void addFileToTar(TarOutputStream tarOutputStream, String path) throws IOException
    {
        File file = new File(path);
        tarOutputStream.putNextEntry(new TarEntry(file, file.getName()));
        try (BufferedInputStream origin = new BufferedInputStream(new FileInputStream(file)))
        {
            int count;
            byte data[] = new byte[32768];

            while ((count = origin.read(data)) != -1)
            {
                tarOutputStream.write(data, 0, count);
            }
            tarOutputStream.flush();
        }
    }

    @Override
    public void uploadResults(MultipartFormDataInput data, long executionId)
    {
        LOG.info("Receiving execution results for execution: " + executionId);
        // 1. Get the existing execution
        WindupExecution execution = this.getExecution(executionId);

        // 2. Load the tar data from the request and untar it to the execution's output directory
        Map<String, List<InputPart>> uploadForm = null;
        List<InputPart> inputParts = null;

        try
        {
            uploadForm = data.getFormDataMap();
            inputParts = uploadForm.get("file");
        }
        catch (Throwable e)
        {
            String message = "Failed to process uploadResults request data due to: " + e.getMessage();
            LOG.log(Level.SEVERE, message, e);
            throw new RuntimeException(message, e);
        }

        if (inputParts == null || inputParts.size() == 0)
        {
            throw new BadRequestException("Report file is missing");
        }
        else if (inputParts.size() > 1)
        {
            throw new BadRequestException("There can only be one report file");
        }
        try
        {
            InputPart inputPart = inputParts.get(0);
            // convert the uploaded file to inputstream
            InputStream inputStream = inputPart.getBody(InputStream.class, null);
            TarUtil.untar(Paths.get(execution.getOutputPath()), inputStream);
            LOG.info("Completed receiving execution results for: " + executionId);
        }
        catch (Throwable e)
        {
            String message = "Failed to process file due to: " + e.getMessage();
            LOG.log(Level.SEVERE, message, e);
            throw new RuntimeException(message, e);
        }
    }

    @Override
    public void deleteExecution(Long executionID)
    {
        this.windupExecutionService.deleteExecution(executionID);
    }

    @Override
    public List<String> getExecutionLogs(Long executionID)
    {
        WindupExecution execution = this.getExecution(executionID);

        Path reportPath = Paths.get(execution.getOutputPath());
        return this.logService.getLogData(reportPath, MAX_LOG_SIZE);
    }

    @Override
    public VersionAndRevision getCoreVersion()
    {
        if (cachedCoreVersion == null)
        {
            try
            {
                Properties props = new Properties();
                props.load(WindupEndpointImpl.class.getClassLoader().getResourceAsStream("/META-INF/windup-web-services.build.properties"));
                cachedCoreVersion = props.getProperty("version.windup.core");

                /*
                 * Get GraphRewrite (a class in windup config api) and use it to get the windup core manifest.
                 *
                 * Then use that to get the scmversion.
                 */
                Enumeration<URL> resources = GraphRewrite.class.getClassLoader().getResources("META-INF/MANIFEST.MF");
                while (resources.hasMoreElements())
                {
                    try
                    {
                        Manifest manifest = new Manifest(resources.nextElement().openStream());
                        // check that this is your manifest and do what you need or get the next one
                        String vendorID = manifest.getMainAttributes().getValue("Implementation-Vendor-Id");
                        if (!StringUtils.equals(vendorID, "org.jboss.windup.config"))
                            continue;

                        cachedCoreScmRevision = manifest.getMainAttributes().getValue("Scm-Revision");
                    }
                    catch (IOException E)
                    {
                        // handle
                    }
                }
            }
            catch (IOException ex)
            {
                LOG.severe("Couldn't read build.properties.");
                cachedCoreVersion = "(failed to read)";
            }
        }
        return new VersionAndRevision(cachedCoreVersion, cachedCoreScmRevision);
    }
}
