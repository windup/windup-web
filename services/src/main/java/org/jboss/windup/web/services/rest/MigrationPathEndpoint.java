package org.jboss.windup.web.services.rest;

import org.jboss.windup.web.services.model.MigrationPath;

import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import java.util.Collection;

/**
 * @author <a href="mailto:jesse.sightler@gmail.com">Jesse Sightler</a>
 */
@Path("/migration-paths")
@Consumes("application/json")
@Produces("application/json")
public interface MigrationPathEndpoint
{
    /**
     * Returns all available {@link MigrationPath} configurations.
     */
    @GET
    Collection<MigrationPath> getAvailablePaths();
}
