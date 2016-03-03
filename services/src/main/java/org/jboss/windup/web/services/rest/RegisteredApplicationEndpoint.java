package org.jboss.windup.web.services.rest;

import org.jboss.forge.furnace.util.Sets;
import org.jboss.windup.web.addons.websupport.dto.RegisteredApplicationDto;
import org.jboss.windup.web.addons.websupport.model.RegisteredApplicationModel;

import javax.ws.rs.FormParam;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import java.util.Collection;

/**
 * @author <a href="mailto:jesse.sightler@gmail.com">Jesse Sightler</a>
 */
@Path("registeredApplications")
@Produces("application/json")
public interface RegisteredApplicationEndpoint
{
    @GET
    @Path("list")
    Collection<RegisteredApplicationDto> getRegisteredApplications();

    @POST
    @Path("register")
    RegisteredApplicationDto registerApplication(@FormParam("path") String path);
}
