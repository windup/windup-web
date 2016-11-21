package org.jboss.windup.web.services.rest;

import java.io.*;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.Map;
import java.util.logging.Level;
import java.util.logging.Logger;

import javax.annotation.Resource;
import javax.ejb.Stateless;
import javax.inject.Inject;
import javax.jms.JMSContext;
import javax.jms.Queue;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.validation.Valid;
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
import org.jboss.windup.web.services.model.ApplicationGroup;
import org.jboss.windup.web.services.model.MigrationProject;
import org.jboss.windup.web.services.model.PackageMetadata;
import org.jboss.windup.web.services.model.RegisteredApplication;

/**
 * @author <a href="mailto:jesse.sightler@gmail.com">Jesse Sightler</a>
 */
@Stateless
public class RegisteredApplicationEndpointImpl implements RegisteredApplicationEndpoint
{
    private static Logger LOG = Logger.getLogger(RegisteredApplicationEndpointImpl.class.getSimpleName());

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

    @Override
    @SuppressWarnings("unchecked")
    public Collection<RegisteredApplication> getRegisteredApplications()
    {
        return entityManager.createQuery("select app from " + RegisteredApplication.class.getSimpleName() + " app").getResultList();
    }

    @Override
    public RegisteredApplication getApplication(long id)
    {
        RegisteredApplication application = this.entityManager.find(RegisteredApplication.class, id);

        if (application == null)
        {
            throw new NotFoundException("RegisteredApplication with id " + id + "not found");
        }

        return application;
    }

    @Override
    public void unregister(long applicationID)
    {
        RegisteredApplication application = this.getApplication(applicationID);

        ApplicationGroup group = application.getApplicationGroup();
        if (group != null)
        {
            application.setApplicationGroup(null);
            group.removeApplication(application);
            application = this.entityManager.merge(application);

            this.entityManager.merge(group);
        }

        this.deleteApplicationFileIfUploaded(application);
        this.entityManager.remove(application);
    }

    @Override
    public RegisteredApplication registerApplication(MultipartFormDataInput data, long appGroupId)
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

        ApplicationGroup appGroup = this.getApplicationGroup(appGroupId);
        RegisteredApplication application = this.createApplication();
        application.setRegistrationType(RegisteredApplication.RegistrationType.UPLOADED);
        appGroup.addApplication(application);

        this.uploadApplicationFile(inputParts.get(0), application, false);
        this.entityManager.merge(application);
        this.entityManager.merge(appGroup);

        return application;
    }

    @Override
    public Collection<RegisteredApplication> registerApplicationsInDirectoryByPath(long appGroupId, String path)
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

        ApplicationGroup group = this.getApplicationGroup(appGroupId);

        String[] allowedExtensions = new String[] { ".jar", ".war", ".ear" };

        List<RegisteredApplication> registeredApplicationList = new ArrayList<>();

        for (File file : directory.listFiles((dir, name) -> {
            for (String ext : allowedExtensions)
            {
                if (name.endsWith(ext))
                {
                    return true;
                }
            }

            return false;
        }))
        {
            RegisteredApplication application = this.createApplication();
            application.setInputPath(file.getPath());
            application.setTitle(file.getName());
            group.addApplication(application);

            this.entityManager.persist(application);
            this.enqueuePackageDiscovery(application);

            registeredApplicationList.add(application);
        }

        this.entityManager.merge(group);

        return registeredApplicationList;
    }

    @Override
    public RegisteredApplication registerApplicationByPath(long appGroupId, @Valid RegisteredApplication application)
    {
        LOG.info("Registering an application at: " + application.getInputPath());

        ApplicationGroup appGroup = appGroupId == 0 ? null : this.getApplicationGroup(appGroupId);

        if (appGroup != null)
        {
            for (RegisteredApplication alreadyRegistered : appGroup.getApplications())
            {
                if (alreadyRegistered.getInputPath() != null && alreadyRegistered.getInputPath().equals(application.getInputPath()))
                    return alreadyRegistered;
            }
            appGroup.getApplications().add(application);
            application.setApplicationGroup(appGroup);
        }

        application.setRegistrationType(RegisteredApplication.RegistrationType.PATH);

        PackageMetadata packageMetadata = new PackageMetadata();
        entityManager.persist(packageMetadata);
        application.setPackageMetadata(packageMetadata);
        entityManager.persist(application);

        this.enqueuePackageDiscovery(application);
        return application;
    }

    @Override
    public RegisteredApplication update(@Valid RegisteredApplication application)
    {
        RegisteredApplication previousApplication = getApplication(application.getId());
        if (previousApplication != null)
            this.deleteApplicationFileIfUploaded(previousApplication);

        application.setRegistrationType(RegisteredApplication.RegistrationType.PATH);
        application = this.entityManager.merge(application);
        this.enqueuePackageDiscovery(application);
        return application;
    }

    private RegisteredApplication createApplication()
    {
        RegisteredApplication application = new RegisteredApplication();

        // need to get ID, set dummy title and path, it will be replaced
        application.setTitle("dummy-title");
        application.setInputPath("dummy-path");

        PackageMetadata packageMetadata = new PackageMetadata();
        application.setPackageMetadata(packageMetadata);

        this.entityManager.persist(packageMetadata);
        this.entityManager.persist(application);

        return application;
    }

    @Override
    public RegisteredApplication updateApplication(MultipartFormDataInput data, long appId)
    {
        RegisteredApplication application = this.getApplication(appId);

        Map<String, List<InputPart>> uploadForm = data.getFormDataMap();
        List<InputPart> inputParts = uploadForm.get("file");

        int uploadedFiles = inputParts.size();

        if (uploadedFiles > 1)
        {
            throw new BadRequestException("Application can have only one file");
        }
        else if (uploadedFiles == 0)
        {
            throw new BadRequestException("Please provide a file");
        }

        this.deleteApplicationFileIfUploaded(application);

        application.setRegistrationType(RegisteredApplication.RegistrationType.UPLOADED);
        this.uploadApplicationFile(inputParts.get(0), application, true);

        return application;
    }

    private void deleteApplicationFileIfUploaded(RegisteredApplication application)
    {
        if (application.getRegistrationType() != RegisteredApplication.RegistrationType.UPLOADED) {
            return;
        }

        File file = new File(application.getInputPath());

        if (file.exists())
        {
            file.delete();
        }
    }

    @Override
    public void deleteApplication(long appId)
    {
        this.unregister(appId);
    }

    @Override
    public Collection<RegisteredApplication> registerMultipleApplications(MultipartFormDataInput data, long appGroupId)
    {
        Map<String, List<InputPart>> uploadForm = data.getFormDataMap();
        List<InputPart> inputParts = uploadForm.get("file");

        if (inputParts.size() == 0)
        {
            throw new BadRequestException("Please provide files for applications");
        }

        List<RegisteredApplication> registeredApplications = new ArrayList<>();

        ApplicationGroup appGroup = this.getApplicationGroup(appGroupId);

        for (InputPart inputPart : inputParts)
        {
            RegisteredApplication application = this.createApplication();
            application.setRegistrationType(RegisteredApplication.RegistrationType.UPLOADED);
            appGroup.addApplication(application);

            this.uploadApplicationFile(inputPart, application, false);
            this.entityManager.merge(application);
            registeredApplications.add(application);
        }

        this.entityManager.merge(appGroup);

        return registeredApplications;
    }

    protected RegisteredApplication uploadApplicationFile(InputPart inputPart, RegisteredApplication application, boolean rewrite)
    {
        ApplicationGroup group = application.getApplicationGroup();

        try
        {
            MultivaluedMap<String, String> header = inputPart.getHeaders();
            String fileName = this.fileNameSanitizer.cleanFileName(this.getFileName(header));
            fileName = this.fileNameSanitizer.shortenFileName(fileName, 255);

            // convert the uploaded file to inputstream
            InputStream inputStream = inputPart.getBody(InputStream.class, null);

            MigrationProject project = group.getMigrationProject();

            String filePath = Paths.get(
                        this.webPathUtil.getAppPath().toString(),
                        project.getId().toString(),
                        group.getId().toString(),
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
            Logger.getLogger(FileEndpointImpl.class.getName()).log(Level.SEVERE, null, ex);
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

    private ApplicationGroup getApplicationGroup(long appGroupId)
    {
        ApplicationGroup group = this.entityManager.find(ApplicationGroup.class, appGroupId);

        if (group == null)
        {
            throw new BadRequestException("Application group not found");
        }

        return group;
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
