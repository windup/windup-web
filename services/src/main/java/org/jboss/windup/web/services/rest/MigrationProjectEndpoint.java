package org.jboss.windup.web.services.rest;

import java.util.Collection;
import javax.ws.rs.Consumes;
import javax.ws.rs.DELETE;
import javax.ws.rs.GET;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import org.jboss.windup.web.services.dto.MigrationProjectDto;


/**
 *
 *  @author <a href="http://ondra.zizka.cz/">Ondrej Zizka, zizka@seznam.cz</a>
 */
@Path("migrationProjects")
@Consumes("application/json")
@Produces("application/json")
public interface MigrationProjectEndpoint
{
    @GET
    @Path("list")
    Collection<MigrationProjectDto> getMigrationProjects();

    @PUT
    @Path("create")
    MigrationProjectDto createMigrationProject(MigrationProjectDto migrationProject);

    @DELETE
    @Path("delete")
    void deleteProject(MigrationProjectDto migration);
}
