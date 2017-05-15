package org.jboss.windup.web.services.rest;

import org.jboss.windup.web.services.model.MigrationProject;

import java.util.HashMap;
import java.util.List;
import javax.validation.Valid;
import javax.ws.rs.Consumes;
import javax.ws.rs.DELETE;
import javax.ws.rs.GET;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;

/**
 * Provides a service for creating, updating, and deleting migration projects.
 *
 * @author <a href="http://ondra.zizka.cz/">Ondrej Zizka, zizka@seznam.cz</a>
 */
@Path(MigrationProjectEndpoint.MIGRATION_PROJECTS_SUBPATH)
@Consumes("application/json")
@Produces("application/json")
public interface MigrationProjectEndpoint
{
    static final String MIGRATION_PROJECTS_SUBPATH = "migrationProjects";

    /**
     * List all {@link MigrationProject}s.
     */
    @GET
    @Path("list")
    List<ExtendedMigrationProject> getMigrationProjects();

    /**
     * Get a {@link MigrationProject} by id.
     */
    @GET
    @Path("get/{id}")
    MigrationProject getMigrationProject(@PathParam("id") Long id);

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

    /**
     * Delete old provisional projects.
     */
    @DELETE
    @Path("deleteProvisional")
    void deleteOldProvisionalProjects();

    /**
     * Look up a project ID by name.
     */
    @GET
    @Path("id-by-name/{title}")
    Long getProjectIdByName(@PathParam("title") String title);



    /**
     * Adds additional properties to MigrationProject solely for the purpose of this REST API.
     */
    final class ExtendedMigrationProject extends HashMap<String, Object>
    {
        /**
         * This just makes arquillian happy.
         */
        ExtendedMigrationProject()
        {
        }

        public ExtendedMigrationProject(MigrationProject migrationProject, Long applicationCount, Long activeExecutionsCount)
        {
            this.put("migrationProject", migrationProject);
            this.put("applicationCount", applicationCount);
            this.put("activeExecutionsCount", activeExecutionsCount);
            this.put("isDeletable", activeExecutionsCount == 0);
        }

        public ExtendedMigrationProject(MigrationProject migrationProject, HashMap<String, Object> properties)
        {
            this.put("migrationProject", properties);
            this.putAll(properties);
        }
    }
}
