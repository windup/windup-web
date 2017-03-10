package org.jboss.windup.web.services.rest;

import org.jboss.resteasy.plugins.providers.multipart.MultipartFormDataInput;
import org.jboss.windup.web.services.model.Package;
import org.jboss.windup.web.services.model.PackageMetadata;
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

    @GET
    Collection<RegisteredApplication> getAllApplications();

    @Path("by-project/{projectId}")
    @GET
    Collection<RegisteredApplication> getProjectApplications(@PathParam("projectId") Long projectId);

    @Path("{id}")
    @GET
    RegisteredApplication getApplication(@PathParam("id") long id);

    /**
     * Updates an existing application.
     */
    @Path("{id}/update-path")
    @PUT
    RegisteredApplication updatePath(@Valid RegisteredApplication application);

    /**
     * Updates existing application
     */
    @Path("{id}/reupload")
    @PUT
    @Consumes(MediaType.MULTIPART_FORM_DATA)
    RegisteredApplication reuploadApplication(@PathParam("id") long appId, MultipartFormDataInput data);

    /**
     * Removes the registration entry for an application.
     */
    @Path("{id}")
    @DELETE
    void deleteApplication(@PathParam("id") long appId);


    @Path("{id}/packages")
    @GET
    PackageMetadata getPackages(@PathParam("id") Long appId);
}
