package org.jboss.windup.web.services.rest;

import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.Collection;
import java.util.logging.Logger;

import javax.ejb.Stateless;
import javax.inject.Inject;
import javax.validation.Valid;
import javax.ws.rs.ServerErrorException;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import org.jboss.resteasy.plugins.providers.multipart.MultipartFormDataInput;
import org.jboss.windup.web.services.model.PackageMetadata;
import org.jboss.windup.web.services.model.RegisteredApplication;
import org.jboss.windup.web.services.service.RegisteredApplicationService;

/**
 * @author <a href="mailto:jesse.sightler@gmail.com">Jesse Sightler</a>
 */
@Stateless
public class RegisteredApplicationEndpointImpl implements RegisteredApplicationEndpoint
{
    private static Logger LOG = Logger.getLogger(RegisteredApplicationEndpointImpl.class.getName());

    @Inject
    private RegisteredApplicationService registeredApplicationService;

    @Override
    public Collection<RegisteredApplication> getAllApplications()
    {
        return this.registeredApplicationService.getAllApplications();
    }

    @Override
    public Collection<RegisteredApplication> getProjectApplications(Long projectId)
    {
        return this.registeredApplicationService.getApplicationsFromProject(projectId);
    }

    @Override
    public RegisteredApplication getApplication(long id)
    {
        return this.registeredApplicationService.getApplication(id);
    }

    @Override
    public RegisteredApplication updatePath(@Valid RegisteredApplication application)
    {
        return this.registeredApplicationService.updateApplicationPath(application);
    }

    @Override
    public RegisteredApplication reuploadApplication(long appId, MultipartFormDataInput data)
    {
        RegisteredApplication application = this.getApplication(appId);

        return this.registeredApplicationService.updateApplicationByUpload(application, data);
    }

    @Override
    public void deleteApplication(long appId)
    {
        RegisteredApplication application = this.registeredApplicationService.getApplication(appId);

        this.registeredApplicationService.deleteApplication(application);
    }

    @Override
    public PackageMetadata getPackages(Long appId)
    {
        RegisteredApplication app = this.registeredApplicationService.getApplication(appId);
        PackageMetadata packageMetadata = app.getPackageMetadata();
        packageMetadata.getId(); // should force hibernate lazy loader to load data

        return packageMetadata;
    }

    @Override
    public Response downloadApplication(long id)
    {
        RegisteredApplication application = this.getApplication(id);

        try
        {
            InputStream is = new FileInputStream(application.getInputPath());

            return Response
                    .ok(is)
                    .type(MediaType.APPLICATION_OCTET_STREAM_TYPE)
                    .header("content-disposition","attachment; filename = " + application.getInputFilename())
                    .build();
        }
        catch (IOException e)
        {
            LOG.warning(e.getMessage());

            throw new ServerErrorException("Error reading file", Response.Status.INTERNAL_SERVER_ERROR);
        }
    }
}
