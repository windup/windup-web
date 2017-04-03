package org.jboss.windup.web.services.rest;

import org.jboss.windup.web.services.model.MigrationProject;

import java.util.List;
import javax.validation.Valid;
import javax.ws.rs.Consumes;
import javax.ws.rs.DELETE;
import javax.ws.rs.GET;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import org.jboss.windup.web.services.model.AnalysisContext;


/**
 *  Provides a service for creating, updating, and deleting migration projects.
 *
 *  @author <a href="http://ondra.zizka.cz/">Ondrej Zizka, zizka@seznam.cz</a>
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
    List<MigrationProjectAndAppCount> getMigrationProjects();

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
     * Get the default analysis context for given project.
     * When a new execution is being launched, some config needs to be used.
     * Same when user navigates to the analysis context page - needs some default data.
     * This will be the one.
     */
    @GET
    @Path("get/{id}/getDefaultAnalysisContext")
    AnalysisContext getDefaultAnalysisContext(@PathParam("id") Long projectId);


    /**
     * Adds app count to MigrationProject solely for the purpose of this REST API.
     */
    final class MigrationProjectAndAppCount
    {
        MigrationProject migrationProject;

        Long applicationCount;

        /**
         * This just makes arquillian happy.
         */
        MigrationProjectAndAppCount()
        {
        }

        public MigrationProjectAndAppCount(MigrationProject migrationProject, Long applicationCount)
        {
            this.migrationProject = migrationProject;
            this.applicationCount = applicationCount;
        }


        public MigrationProject getMigrationProject()
        {
            return migrationProject;
        }

        public void setMigrationProject(MigrationProject migrationProject)
        {
            this.migrationProject = migrationProject;
        }


        public Long getApplicationCount()
        {
            return applicationCount;
        }

        public void setApplicationCount(Long applicationCount)
        {
            this.applicationCount = applicationCount;
        }
    }
}
