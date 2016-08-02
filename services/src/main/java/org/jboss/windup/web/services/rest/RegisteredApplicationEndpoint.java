package org.jboss.windup.web.services.rest;

import org.jboss.windup.web.services.model.RegisteredApplication;

import javax.validation.Valid;
import javax.ws.rs.Consumes;
import javax.ws.rs.DELETE;
import javax.ws.rs.GET;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
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

    /**
     * Registers a new application with Windup.
     */
    @PUT
    @Path("register")
    RegisteredApplication registerApplication(@Valid RegisteredApplication applicationDto);

    /**
     * Removes a application from Windup.
     */
    @DELETE
    @Path("unregister")
    void unregisterApplication(RegisteredApplication application);
}
