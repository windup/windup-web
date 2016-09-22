package org.jboss.windup.web.services.rest;

import org.jboss.resteasy.plugins.providers.multipart.InputPart;
import org.jboss.resteasy.plugins.providers.multipart.MultipartFormDataInput;
import org.jboss.windup.web.addons.websupport.WebPathUtil;
import org.jboss.windup.web.furnaceserviceprovider.FromFurnace;
import org.jboss.windup.web.services.model.ApplicationGroup;
import org.jboss.windup.web.services.model.RegisteredApplication;

import javax.ejb.Stateless;
import javax.inject.Inject;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.ws.rs.BadRequestException;
import javax.ws.rs.InternalServerErrorException;
import javax.ws.rs.NotFoundException;
import javax.ws.rs.core.MultivaluedMap;
import java.io.*;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.Map;
import java.util.logging.Level;
import java.util.logging.Logger;

/**
 * @author <a href="mailto:jesse.sightler@gmail.com">Jesse Sightler</a>
 */
@Stateless
public class RegisteredApplicationEndpointImpl implements RegisteredApplicationEndpoint
{
    private static Logger LOG = Logger.getLogger(RegisteredApplicationEndpointImpl.class.getSimpleName());

    @Inject @FromFurnace
    private WebPathUtil webPathUtil;

    @PersistenceContext
    private EntityManager entityManager;

    @Override
    @SuppressWarnings("unchecked")
    public Collection<RegisteredApplication> getRegisteredApplications()
    {
        return entityManager.createQuery("select app from " + RegisteredApplication.class.getSimpleName() + " app").getResultList();
    }

    @Override
    public RegisteredApplication getApplication(int id) {
        RegisteredApplication application = this.entityManager.find(RegisteredApplication.class, id);

        if (application == null) {
            throw new NotFoundException();
        }

        return application;
    }

    @Override
    public RegisteredApplication registerApplication(MultipartFormDataInput data, long appGroupId) {
        Map<String, List<InputPart>> uploadForm = data.getFormDataMap();
        List<InputPart> inputParts = uploadForm.get("file");

        int uploadedFiles = inputParts.size();

        if (uploadedFiles > 1) {
            throw new BadRequestException("Use endpoint /multiple to register multiple applications");
        } else if (uploadedFiles== 0) {
            throw new BadRequestException("Please provide a file");
        }

        return this.createApplicationFromInputPart(inputParts.get(0), appGroupId);
    }

    @Override
    public Collection<RegisteredApplication> registerMultipleApplications(MultipartFormDataInput data, long appGroupId)
    {
        Map<String, List<InputPart>> uploadForm = data.getFormDataMap();
        List<InputPart> inputParts = uploadForm.get("file");

        List<RegisteredApplication> registeredApplications = new ArrayList<>();

        for (InputPart inputPart : inputParts) {
            RegisteredApplication application = this.createApplicationFromInputPart(inputPart, appGroupId);
            registeredApplications.add(application);
        }

        return registeredApplications;
    }

    protected RegisteredApplication createApplicationFromInputPart(InputPart inputPart, long appGroupId) {
        ApplicationGroup group = this.entityManager.find(ApplicationGroup.class, appGroupId);

        if (group == null) {
            throw new BadRequestException("Application group not found");
        }

        try {
            RegisteredApplication application = new RegisteredApplication();

            MultivaluedMap<String, String> header = inputPart.getHeaders();
            String fileName = this.getFileName(header);

            //convert the uploaded file to inputstream
            InputStream inputStream = inputPart.getBody(InputStream.class,null);

            String filePath = Paths.get(this.webPathUtil.getAppPath().toString(), fileName).toString();

            this.saveFileTo(inputStream, filePath);

            application.setInputFilename(fileName);
            application.setInputPath(filePath);

            group.getApplications().add(application);

            this.entityManager.persist(application);
            this.entityManager.merge(group);

            return application;
        } catch (IOException ex) {
            Logger.getLogger(FileEndpointImpl.class.getName()).log(Level.SEVERE, null, ex);
            throw new InternalServerErrorException("Error during file upload");
        }
    }


    protected String getFileName(MultivaluedMap<String, String> header)
    {
        String[] contentDisposition = header.getFirst("Content-Disposition").split(";");

        for (String filename : contentDisposition) {
            if ((filename.trim().startsWith("filename"))) {

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
        while ((bytes = inputStream.read(buffer)) != -1) {
            os.write(buffer, 0, bytes);
        }
    }

    @Override
    public void unregisterApplication(RegisteredApplication application)
    {
        entityManager.remove(application);
    }
}
