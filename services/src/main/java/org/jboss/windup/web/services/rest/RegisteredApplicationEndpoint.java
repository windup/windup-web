package org.jboss.windup.web.services.rest;

import org.jboss.resteasy.plugins.providers.multipart.MultipartFormDataInput;
import org.jboss.windup.web.services.model.RegisteredApplication;

import javax.validation.Valid;
import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import java.util.Collection;

/**
 * Contains methods for managing applications registered within Windup.
 *
 * @author <a href="mailto:jesse.sightler@gmail.com">Jesse Sightler</a>
 */
@Path(RegisteredApplicationEndpoint.REGISTERED_APPLICATIONS)
@Consumes("application/json")
@Produces("application/json")
public interface RegisteredApplicationEndpoint
{
    String REGISTERED_APPLICATIONS = "/registeredApplications";

    /**
     * Gets the list of all registered applications.
     */
    @GET
    @Path("list")
    Collection<RegisteredApplication> getRegisteredApplications();

    @Path("{id}")
    @GET
    RegisteredApplication getApplication(@PathParam("id") long id);

    /**
     * Registers a new application with Windup.
     */
    @Path("appGroup/{appGroupId}")
    @POST
    @Consumes(MediaType.MULTIPART_FORM_DATA)
    @Produces("application/json")
    RegisteredApplication registerApplication(MultipartFormDataInput data, @PathParam("appGroupId") long appGroupId);

    /**
     * Registers a new application with Windup by its path on the server.
     */
    @POST
    @Path("register-path/{appGroupId}")
    RegisteredApplication registerApplicationByPath(@PathParam("appGroupId") long appGroupId, @Valid RegisteredApplication application);

    /**
     * Registers all applications found in directory path on the server.
     */
    @POST
    @Path("register-directory-path/{appGroupId}")
    Collection<RegisteredApplication> registerApplicationsInDirectoryByPath(@PathParam("appGroupId") long appGroupId, String directoryPath);

    /**
     * Updates an existing application.
     */
    @PUT
    @Path("update-application")
    RegisteredApplication update(@Valid RegisteredApplication application);

    /**
     * Removes the registration entry for an application.
     */
    @DELETE
    @Path("unregister/{id}")
    void unregister(@PathParam("id") long applicationID);

    /**
     * Updates existing application
     */
    @Path("{id}")
    @PUT
    @Consumes(MediaType.MULTIPART_FORM_DATA)
    RegisteredApplication updateApplication(MultipartFormDataInput data, @PathParam("id") long appId);

    @Path("{id}")
    @DELETE
    void deleteApplication(@PathParam("id") long appId);

    /**
     * Registers a multiple applications with Windup.
     */
    @Path("appGroup/{appGroupId}/multiple")
    @POST
    @Consumes(MediaType.MULTIPART_FORM_DATA)
    @Produces("application/json")
    Collection<RegisteredApplication> registerMultipleApplications(MultipartFormDataInput data, @PathParam("appGroupId") long appGroupId);
}
