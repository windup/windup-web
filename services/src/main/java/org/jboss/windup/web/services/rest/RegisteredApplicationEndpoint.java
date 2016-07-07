package org.jboss.windup.web.services.rest;

import org.jboss.windup.web.addons.websupport.model.RegisteredApplicationModel;
import org.jboss.windup.web.services.dto.RegisteredApplicationDto;
import org.jboss.windup.web.services.validators.FileExistsConstraint;

import javax.validation.Valid;
import javax.ws.rs.Consumes;
import javax.ws.rs.DELETE;
import javax.ws.rs.GET;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import java.util.Collection;

/**
 * Defines methods for managing {@link RegisteredApplicationModel}s via the {@link RegisteredApplicationDto} DTO.
 *
 * @author <a href="mailto:jesse.sightler@gmail.com">Jesse Sightler</a>
 */
@Path("registeredApplications")
@Consumes("application/json")
@Produces("application/json")
public interface RegisteredApplicationEndpoint
{
    /**
     * Returns a list of all {@link RegisteredApplicationDto}s registered in the system.
     */
    @GET
    @Path("list")
    Collection<RegisteredApplicationDto> getRegisteredApplications();

    /**
     * Register a new application and validate it during registration.
     */
    @PUT
    @Path("register")
    RegisteredApplicationDto registerApplication(@Valid RegisteredApplicationDto applicationDto);

    /**
     * Unregister the given application.
     */
    @DELETE
    @Path("unregister")
    void unregisterApplication(RegisteredApplicationDto application);
}
