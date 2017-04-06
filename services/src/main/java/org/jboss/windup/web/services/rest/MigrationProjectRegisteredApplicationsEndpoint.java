package org.jboss.windup.web.services.rest;

import java.util.Collection;

import javax.validation.Valid;
import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;

import org.jboss.resteasy.plugins.providers.multipart.MultipartFormDataInput;
import org.jboss.windup.web.services.model.MigrationProject;
import org.jboss.windup.web.services.model.RegisteredApplication;

/**
 * Contains method for getting and adding {@link RegisteredApplication}s to {@link MigrationProject}
 *
 * @author <a href="mailto:dklingenberg@gmail.com">David Klingenberg</a>
 */
@Path(MigrationProjectRegisteredApplicationsEndpoint.PROJECT_APPLICATIONS)
@Consumes("application/json")
@Produces("application/json")
public interface MigrationProjectRegisteredApplicationsEndpoint
{
    String PROJECT_APPLICATIONS = "migrationProjects/{projectId}/registeredApplications";

    /**
     * Gets the list of all registered applications.
     */
    @GET
    Collection<RegisteredApplication> getRegisteredApplications(@PathParam("projectId") long projectId);

    /**
     * Registers a new application with Windup.
     */
    @Path("upload")
    @POST
    @Consumes(MediaType.MULTIPART_FORM_DATA)
    @Produces("application/json")
    RegisteredApplication uploadApplication(MultipartFormDataInput data, @PathParam("projectId") long projectId);

    @Path("register-path")
    @POST
    RegisteredApplication registerApplicationByPath(@PathParam("projectId") long projectId, String path);

    /**
     * Registers all applications found in directory path on the server.
     */
    @Path("register-directory-path")
    @POST
    Collection<RegisteredApplication> registerApplicationsInDirectoryByPath(@PathParam("projectId") long projectId, String directoryPath);

    /**
     * Uploads multiple applications with Windup.
     */
    @Path("upload-multiple")
    @POST
    @Consumes(MediaType.MULTIPART_FORM_DATA)
    @Produces("application/json")
    Collection<RegisteredApplication> uploadMultipleApplications(MultipartFormDataInput data, @PathParam("projectId") long projectId);
}
