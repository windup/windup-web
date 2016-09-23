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
@Path("registeredApplications")
@Consumes("application/json")
@Produces("application/json")
public interface RegisteredApplicationEndpoint
{
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
     * Updates existing application
     */
    @Path("/{id}")
    @PUT
    @Consumes(MediaType.MULTIPART_FORM_DATA)
    RegisteredApplication updateApplication(MultipartFormDataInput data, @PathParam("id") long appId);

    /**
     * Registers a multiple applications with Windup.
     */
    @Path("appGroup/{appGroupId}/multiple")
    @POST
    @Consumes(MediaType.MULTIPART_FORM_DATA)
    @Produces("application/json")
    Collection<RegisteredApplication> registerMultipleApplications(MultipartFormDataInput data, @PathParam("appGroupId") long appGroupId);

    /**
     * Removes a application from Windup.
     */
    @DELETE
    @Path("unregister")
    void unregisterApplication(RegisteredApplication application);
}
