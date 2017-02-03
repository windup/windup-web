package org.jboss.windup.web.services.rest;

import java.util.Collection;

import javax.inject.Inject;
import javax.validation.Valid;

import org.jboss.resteasy.plugins.providers.multipart.MultipartFormDataInput;
import org.jboss.windup.web.services.model.RegisteredApplication;
import org.jboss.windup.web.services.service.RegisteredApplicationService;

/**
 * @author <a href="mailto:dklingenberg@gmail.com">David Klingenberg</a>
 */
public class MigrationProjectRegisteredApplicationsEndpointImpl implements MigrationProjectRegisteredApplicationsEndpoint
{
    @Inject
    private RegisteredApplicationService registeredApplicationService;

    @Override
    public Collection<RegisteredApplication> getRegisteredApplications(long projectId)
    {
        return null;
    }

    @Override
    public RegisteredApplication uploadApplication(MultipartFormDataInput data, long projectId)
    {
        return this.registeredApplicationService.registerApplication(data, projectId);
    }

    @Override
    public RegisteredApplication registerApplicationByPath(long projectId, @Valid RegisteredApplication application)
    {
        return this.registeredApplicationService.registerApplicationByPath(projectId, application);
    }

    @Override
    public Collection<RegisteredApplication> registerApplicationsInDirectoryByPath(long projectId, String directoryPath)
    {
        return this.registeredApplicationService.registerApplicationsInDirectoryByPath(projectId, directoryPath);
    }

    @Override
    public Collection<RegisteredApplication> uploadMultipleApplications(MultipartFormDataInput data, long projectId)
    {
        return this.registeredApplicationService.registerMultipleApplications(data, projectId);
    }
}
