package org.jboss.windup.web.addons.websupport.rest.graph;

import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;

import org.jboss.windup.web.addons.websupport.rest.FurnaceRESTGraphAPI;

/**
 * Resource for dependencies report
 *
 * @author <a href="mailto:dklingenberg@gmail.com">David Klingenberg</a>
 */
@Path("graph/{executionId}/dependencies")
@Consumes(MediaType.APPLICATION_JSON)
@Produces(MediaType.APPLICATION_JSON)
public interface DependenciesReportResource extends FurnaceRESTGraphAPI
{
    /**
     * Gets library dependencies
     */
    @GET
    Object getDependencies(@PathParam("executionId") Long executionId);

    @Path("technologies")
    @GET
    Object getTechnologiesDependencies(@PathParam("executionId") Long executionId);
}
