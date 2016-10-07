package org.jboss.windup.web.services.rest;

import java.util.Collection;

import javax.validation.Valid;
import javax.ws.rs.*;

import org.jboss.windup.web.services.model.ApplicationGroup;
import org.jboss.windup.web.services.model.PackageMetadata;

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

    @GET
    @Path("{id}/packages")
    PackageMetadata getPackages(@PathParam("id") long id);
}
