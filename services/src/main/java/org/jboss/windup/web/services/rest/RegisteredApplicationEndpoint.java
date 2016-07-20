package org.jboss.windup.web.services.rest;

import org.jboss.windup.web.services.dto.RegisteredApplicationDto;

import javax.validation.Valid;
import javax.ws.rs.Consumes;
import javax.ws.rs.DELETE;
import javax.ws.rs.GET;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import java.util.Collection;

/**
 * @author <a href="mailto:jesse.sightler@gmail.com">Jesse Sightler</a>
 */
@Path("registeredApplications")
@Consumes("application/json")
@Produces("application/json")
public interface RegisteredApplicationEndpoint
{
    @GET
    @Path("list")
    Collection<RegisteredApplicationDto> getRegisteredApplications();

    @PUT
    @Path("register")
    RegisteredApplicationDto registerApplication(@Valid RegisteredApplicationDto applicationDto);

    @DELETE
    @Path("unregister")
    void unregisterApplication(RegisteredApplicationDto application);
}
