package org.jboss.windup.web.services.rest;

import java.util.Collection;

import javax.inject.Inject;
import javax.validation.Valid;

import org.jboss.resteasy.plugins.providers.multipart.MultipartFormDataInput;
import org.jboss.windup.web.services.model.MigrationProject;
import org.jboss.windup.web.services.model.RegisteredApplication;
import org.jboss.windup.web.services.service.MigrationProjectService;
import org.jboss.windup.web.services.service.RegisteredApplicationService;

/**
 * @author <a href="mailto:dklingenberg@gmail.com">David Klingenberg</a>
 */
public class MigrationProjectRegisteredApplicationsEndpointImpl implements MigrationProjectRegisteredApplicationsEndpoint
{
    @Inject
    private RegisteredApplicationService registeredApplicationService;

    @Inject
    private MigrationProjectService migrationProjectService;

    @Override
    public Collection<RegisteredApplication> getRegisteredApplications(long projectId)
    {
        MigrationProject project = this.migrationProjectService.getMigrationProject(projectId);

        return project.getApplications();
    }

    @Override
    public RegisteredApplication uploadApplication(MultipartFormDataInput data, long projectId)
    {
        MigrationProject project = this.migrationProjectService.getMigrationProject(projectId);

        return this.registeredApplicationService.registerApplication(data, project);
    }

    @Override
    public RegisteredApplication registerApplicationByPath(long projectId, @Valid RegisteredApplication application)
    {
        MigrationProject project = this.migrationProjectService.getMigrationProject(projectId);

        return this.registeredApplicationService.registerApplicationByPath(project, application);
    }

    @Override
    public Collection<RegisteredApplication> registerApplicationsInDirectoryByPath(long projectId, String directoryPath)
    {
        MigrationProject project = this.migrationProjectService.getMigrationProject(projectId);

        return this.registeredApplicationService.registerApplicationsInDirectoryByPath(project, directoryPath);
    }

    @Override
    public Collection<RegisteredApplication> uploadMultipleApplications(MultipartFormDataInput data, long projectId)
    {
        MigrationProject project = this.migrationProjectService.getMigrationProject(projectId);

        return this.registeredApplicationService.registerMultipleApplications(data, project);
    }
}
