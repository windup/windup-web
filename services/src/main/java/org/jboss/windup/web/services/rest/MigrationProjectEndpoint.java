package org.jboss.windup.web.services.rest;

import org.jboss.windup.web.services.model.MigrationProject;

import java.util.Collection;
import javax.validation.Valid;
import javax.ws.rs.Consumes;
import javax.ws.rs.DELETE;
import javax.ws.rs.GET;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;


/**
 *  Provides a service for creating, updating, and deleting migration projects.
 *
 *  @author <a href="http://ondra.zizka.cz/">Ondrej Zizka, zizka@seznam.cz</a>
 */
@Path("migrationProjects")
@Consumes("application/json")
@Produces("application/json")
public interface MigrationProjectEndpoint
{
    /**
     * List all {@link MigrationProject}s.
     */
    @GET
    @Path("list")
    Collection<MigrationProject> getMigrationProjects();

    /**
     * Create a new {@link MigrationProject}.
     */
    @PUT
    @Path("create")
    MigrationProject createMigrationProject(@Valid MigrationProject migrationProject);

    /**
     * Update the given {@link MigrationProject}.
     */
    @PUT
    @Path("update")
    MigrationProject updateMigrationProject(@Valid MigrationProject migrationProject);

    /**
     * Delete the given {@link MigrationProject}.
     */
    @DELETE
    @Path("delete")
    void deleteProject(MigrationProject migration);
}
