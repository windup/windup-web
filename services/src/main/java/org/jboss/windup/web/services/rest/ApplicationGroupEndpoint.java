package org.jboss.windup.web.services.rest;

import org.jboss.windup.web.addons.websupport.model.ApplicationGroupModel;
import org.jboss.windup.web.services.dto.ApplicationGroupDto;

import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;

/**
 * Managed applications groups and the associations between groups and applications.
 *
 * @author <a href="mailto:jesse.sightler@gmail.com">Jesse Sightler</a>
 */
@Path("registeredApplications")
@Consumes("application/json")
@Produces("application/json")
public interface ApplicationGroupEndpoint
{
    /**
     * Registers a new {@link ApplicationGroupDto} with the given name.
     */
    @PUT
    @Path("create")
    ApplicationGroupDto register(String name);

    /**
     * Gets an existing {@link ApplicationGroupDto} by its id.
     */
    @GET
    @Path("get/{id}")
    ApplicationGroupDto get(@PathParam("id") Integer id);

    /**
     * Updates an existing {@link ApplicationGroupDto}.
     */
    @PUT
    @Path("update")
    void update(ApplicationGroupDto dto);
}
