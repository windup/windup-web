package org.jboss.windup.web.services.rest;

import org.jboss.windup.web.services.model.ApplicationGroup;

import javax.validation.Valid;
import javax.ws.rs.Consumes;
import javax.ws.rs.DELETE;
import javax.ws.rs.GET;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import java.util.Collection;

/**
 * Contains methods for managing {@link ApplicationGroup}s.
 *
 * @author <a href="mailto:jesse.sightler@gmail.com">Jesse Sightler</a>
 */
@Path("applicationGroups")
@Consumes("application/json")
@Produces("application/json")
public interface ApplicationGroupEndpoint
{
    /**
     * List all {@link ApplicationGroup}s.
     */
    @GET
    @Path("list")
    Collection<ApplicationGroup> getApplicationGroups();

    /**
     * List {@link ApplicationGroup}s by @{link MigrationProject} id.
     */
    @GET
    @Path("by-project/{projectID}")
    Collection<ApplicationGroup> getApplicationGroups(@PathParam("projectID") Long projectID);

    /**
     * Gets a {@link ApplicationGroup} by id.
     */
    @GET
    @Path("get/{id}")
    ApplicationGroup getApplicationGroup(@PathParam("id") Long id);

    /**
     * Create a new {@link ApplicationGroup}.
     */
    @PUT
    @Path("create")
    ApplicationGroup create(@Valid ApplicationGroup applicationGroup);

    /**
     * Update the given {@link ApplicationGroup}.
     */
    @PUT
    @Path("update")
    ApplicationGroup update(@Valid ApplicationGroup applicationGroup);

    /**
     * Delete the given {@link ApplicationGroup}.
     */
    @DELETE
    @Path("delete")
    void delete(ApplicationGroup applicationGroup);
}
