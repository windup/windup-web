package org.jboss.windup.web.services.service;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.Map;
import java.util.logging.Level;
import java.util.logging.Logger;

import javax.annotation.Resource;
import javax.inject.Inject;
import javax.jms.JMSContext;
import javax.jms.Queue;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.transaction.Transactional;
import javax.ws.rs.BadRequestException;
import javax.ws.rs.InternalServerErrorException;
import javax.ws.rs.NotFoundException;
import javax.ws.rs.core.MultivaluedMap;

import org.jboss.resteasy.plugins.providers.multipart.InputPart;
import org.jboss.resteasy.plugins.providers.multipart.MultipartFormDataInput;
import org.jboss.windup.web.addons.websupport.WebPathUtil;
import org.jboss.windup.web.addons.websupport.services.FileNameSanitizer;
import org.jboss.windup.web.furnaceserviceprovider.FromFurnace;
import org.jboss.windup.web.services.messaging.MessagingConstants;
import org.jboss.windup.web.services.model.AnalysisContext;
import org.jboss.windup.web.services.model.MigrationProject;
import org.jboss.windup.web.services.model.PackageMetadata;
import org.jboss.windup.web.services.model.RegisteredApplication;

/**
 * Manages {@link RegisteredApplication}s
 *
 * @author <a href="mailto:dklingenberg@gmail.com">David Klingenberg</a>
 */
public class RegisteredApplicationService
{
    private static Logger LOG = Logger.getLogger(RegisteredApplicationService.class.getSimpleName());

    @Inject
    @FromFurnace
    private WebPathUtil webPathUtil;

    @Inject
    @FromFurnace
    private FileNameSanitizer fileNameSanitizer;

    @PersistenceContext
    private EntityManager entityManager;

    @Inject
    private JMSContext messaging;

    @Resource(lookup = "java:/queues/" + MessagingConstants.PACKAGE_DISCOVERY_QUEUE)
    private Queue packageDiscoveryQueue;

    public Collection<RegisteredApplication> getAllApplications()
    {
        return entityManager.createQuery("select app from " + RegisteredApplication.class.getSimpleName() + " app", RegisteredApplication.class)
                    .getResultList();
    }

    public Collection<RegisteredApplication> getApplicationsFromProject(long projectId)
    {
        String jql = "SELECT app FROM " + RegisteredApplication.class.getSimpleName() + " app WHERE app.migrationProject.id = " + projectId;
        return entityManager.createQuery(jql, RegisteredApplication.class).getResultList();
    }

    public RegisteredApplication getApplication(long id)
    {
        RegisteredApplication application = this.entityManager.find(RegisteredApplication.class, id);

        if (application == null)
        {
            throw new NotFoundException("RegisteredApplication with id " + id + "not found");
        }

        return application;
    }

    @Transactional
    public RegisteredApplication registerApplicationByUpload(MultipartFormDataInput data, MigrationProject project)
    {
        Map<String, List<InputPart>> uploadForm = data.getFormDataMap();
        List<InputPart> inputParts = uploadForm.get("file");

        int uploadedFiles = inputParts.size();

        if (uploadedFiles > 1)
        {
            throw new BadRequestException("Use endpoint /multiple to register multiple applications");
        }
        else if (uploadedFiles == 0)
        {
            throw new BadRequestException("Please provide a file");
        }

        RegisteredApplication application = this.createApplication(project);
        application.setRegistrationType(RegisteredApplication.RegistrationType.UPLOADED);
        project.addApplication(application);

        this.uploadApplicationFile(inputParts.get(0), application, false);
        this.entityManager.merge(application);
        this.entityManager.merge(project);

        return application;
    }

    @Transactional
    public Collection<RegisteredApplication> registerApplicationsInDirectoryByPath(MigrationProject project, String path)
    {
        File directory = new File(path);

        if (!directory.exists())
        {
            throw new BadRequestException("Path not found!");
        }
        else if (!directory.isDirectory())
        {
            throw new BadRequestException("Expecting directory, got file path");
        }

        String[] allowedExtensions = new String[] { ".jar", ".war", ".ear" };

        List<RegisteredApplication> registeredApplicationList = new ArrayList<>();

        for (File file : this.getFilesFromDirectory(directory, allowedExtensions))
        {
            RegisteredApplication application = this.registerApplicationByPath(project, file.getPath());
            registeredApplicationList.add(application);
        }

        this.entityManager.merge(project);

        return registeredApplicationList;
    }

    private File[] getFilesFromDirectory(File directory, String[] allowedExtensions)
    {
        return directory.listFiles((dir, name) -> {
            for (String ext : allowedExtensions)
            {
                if (name.endsWith(ext))
                {
                    return true;
                }
            }

            return false;
        });
    }

    @Transactional
    public RegisteredApplication registerApplicationByPath(MigrationProject project, String path)
    {
        LOG.info("Registering an application at: " + path);

        for (RegisteredApplication alreadyRegistered : project.getApplications())
        {
            if (alreadyRegistered.getInputPath() != null && alreadyRegistered.getInputPath().equals(path))
            {
                return alreadyRegistered;
            }
        }

        File file = new File(path);

        RegisteredApplication application = this.createApplication(project);
        application.setInputPath(path);
        application.setTitle(file.getName());

        application.setMigrationProject(project);
        project.addApplication(application);

        application.setRegistrationType(RegisteredApplication.RegistrationType.PATH);

        PackageMetadata packageMetadata = new PackageMetadata();
        entityManager.persist(packageMetadata);
        application.setPackageMetadata(packageMetadata);
        entityManager.persist(application);

        this.enqueuePackageDiscovery(application);

        return application;
    }

    @Transactional
    public RegisteredApplication updateApplicationPath(RegisteredApplication application)
    {
        RegisteredApplication previousApplication = getApplication(application.getId());

        if (previousApplication != null)
        {
            this.deleteApplicationFileIfUploaded(previousApplication);
        }

        application.setRegistrationType(RegisteredApplication.RegistrationType.PATH);
        application = this.entityManager.merge(application);
        this.enqueuePackageDiscovery(application);

        return application;
    }

    private RegisteredApplication createApplication(MigrationProject project)
    {
        RegisteredApplication application = new RegisteredApplication(project);

        // need to get ID, set dummy title and path, it will be replaced
        application.setTitle("dummy-title");
        application.setInputPath("dummy-path");

        PackageMetadata packageMetadata = new PackageMetadata();
        application.setPackageMetadata(packageMetadata);

        this.entityManager.persist(packageMetadata);
        this.entityManager.persist(application);

        return application;
    }

    @Transactional
    public RegisteredApplication updateApplicationByUpload(RegisteredApplication application, MultipartFormDataInput data)
    {
        Map<String, List<InputPart>> uploadForm = data.getFormDataMap();
        List<InputPart> inputParts = uploadForm.get("file");

        if (inputParts == null || inputParts.size() == 0)
        {
            throw new BadRequestException("Please provide a file");
        }
        else if (inputParts.size() > 1)
        {
            throw new BadRequestException("Application can have only one file");
        }

        this.deleteApplicationFileIfUploaded(application);

        application.setRegistrationType(RegisteredApplication.RegistrationType.UPLOADED);
        this.uploadApplicationFile(inputParts.get(0), application, true);

        return application;
    }

    @Transactional
    public void deleteApplication(RegisteredApplication application)
    {
        MigrationProject project = application.getMigrationProject();

        if (project != null)
        {
            application.setMigrationProject(null);
            project.removeApplication(application);
            application = this.entityManager.merge(application);

            this.entityManager.merge(project);
        }

        String query = "SELECT ctxt FROM AnalysisContext ctxt WHERE :app MEMBER OF ctxt.applications";
        Collection<AnalysisContext> contexts = this.entityManager.createQuery(query, AnalysisContext.class)
                .setParameter("app", application)
                .getResultList();

        if (contexts.isEmpty())
        {
            /*
             * Delete application if it is not used in any context
             */
            this.entityManager.remove(application);
            this.entityManager.flush();
        }
        else
        {
            /*
             * Do not delete application if it is used for some analysis context
             * Keep the record in database (for reference in applications used in execution)
             */
            application.setInputPath(null);
            application.setDeleted(true);
            this.entityManager.merge(application);
        }

        this.deleteApplicationFileIfUploaded(application);
    }

    private void deleteApplicationFileIfUploaded(RegisteredApplication application)
    {
        if (application.getRegistrationType() != RegisteredApplication.RegistrationType.UPLOADED)
        {
            return;
        }

        File file = new File(application.getInputPath());

        if (file.exists())
        {
            file.delete();
        }
    }

    @Transactional
    public Collection<RegisteredApplication> registerMultipleApplicationsByUpload(MultipartFormDataInput data, MigrationProject project)
    {
        Map<String, List<InputPart>> uploadForm = data.getFormDataMap();
        List<InputPart> inputParts = uploadForm.get("file");

        if (inputParts.size() == 0)
        {
            throw new BadRequestException("Please provide files for applications");
        }

        List<RegisteredApplication> registeredApplications = new ArrayList<>();

        for (InputPart inputPart : inputParts)
        {
            RegisteredApplication application = this.createApplication(project);
            application.setRegistrationType(RegisteredApplication.RegistrationType.UPLOADED);
            project.addApplication(application);

            this.uploadApplicationFile(inputPart, application, false);
            this.entityManager.merge(application);
            registeredApplications.add(application);
        }

        this.entityManager.merge(project);

        return registeredApplications;
    }

    protected RegisteredApplication uploadApplicationFile(InputPart inputPart, RegisteredApplication application, boolean rewrite)
    {
        try
        {
            MultivaluedMap<String, String> header = inputPart.getHeaders();
            String fileName = this.fileNameSanitizer.cleanFileName(this.getFileName(header));
            fileName = this.fileNameSanitizer.shortenFileName(fileName, 255);

            // convert the uploaded file to inputstream
            InputStream inputStream = inputPart.getBody(InputStream.class, null);

            MigrationProject project = application.getMigrationProject();

            String filePath = Paths.get(
                        this.webPathUtil.getGlobalWindupDataPath().toString(),
                        project.getId().toString(),
                        "apps",
                        fileName).toString();

            File file = new File(filePath);

            if (file.exists() && !rewrite)
            {
                LOG.warning("File in path: " + filePath + " already exists, but it should not");
                throw new BadRequestException("File with name: '" + fileName + "' already exists");
            }

            this.saveFileTo(inputStream, filePath);

            application.setTitle(fileName);
            this.updateApplicationInputPath(application, filePath);

            return application;
        }
        catch (IOException ex)
        {
            Logger.getLogger(RegisteredApplicationService.class.getName()).log(Level.SEVERE, null, ex);
            throw new InternalServerErrorException("Error during file upload");
        }
    }

    /**
     * Updates application inputPath and enqueues application for package discovery
     *
     * @param application Application
     * @param newInputPath New input path
     */
    private void updateApplicationInputPath(RegisteredApplication application, String newInputPath)
    {
        application.setInputPath(newInputPath);
        this.enqueuePackageDiscovery(application);
    }

    protected String getFileName(MultivaluedMap<String, String> header)
    {
        String[] contentDisposition = header.getFirst("Content-Disposition").split(";");

        for (String filename : contentDisposition)
        {
            if ((filename.trim().startsWith("filename")))
            {

                String[] name = filename.split("=");

                return name[1].trim().replaceAll("\"", "");
            }
        }

        throw new BadRequestException("Missing file name");
    }

    protected void saveFileTo(InputStream inputStream, String filePath) throws IOException
    {
        File file = new File(filePath);

        file.getParentFile().mkdirs();

        OutputStream os = new FileOutputStream(file);
        byte[] buffer = new byte[256];
        int bytes = 0;
        while ((bytes = inputStream.read(buffer)) != -1)
        {
            os.write(buffer, 0, bytes);
        }
    }

    protected void enqueuePackageDiscovery(RegisteredApplication application)
    {
        this.messaging.createProducer().send(this.packageDiscoveryQueue, application);
    }
}
