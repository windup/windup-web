package org.jboss.windup.web.services.rest;

import org.jboss.resteasy.plugins.providers.multipart.MultipartFormDataInput;
import org.jboss.windup.web.services.model.RegisteredApplication;

import javax.validation.Valid;
import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;

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

    @Path("id/{id}")
    @GET
    RegisteredApplication getApplication(@PathParam("id") long id);

    /**
     * Updates an existing application.
     */
    @Path("update-application")
    @PUT
    RegisteredApplication updatePath(@Valid RegisteredApplication application);

    /**
     * Updates existing application
     */
    @Path("{id}")
    @PUT
    @Consumes(MediaType.MULTIPART_FORM_DATA)
    RegisteredApplication reuploadApplication(MultipartFormDataInput data, @PathParam("id") long appId);

    @Path("{id}")
    @DELETE
    void deleteApplication(@PathParam("id") long appId);

    /**
     * Removes the registration entry for an application.
     */
    @Path("unregister/{id}")
    @DELETE
    void unregister(@PathParam("id") long applicationID);
}
