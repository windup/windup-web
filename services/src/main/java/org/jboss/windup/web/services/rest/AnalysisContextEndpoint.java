package org.jboss.windup.web.services.rest;

import org.jboss.windup.web.services.model.AnalysisContext;

import javax.validation.Valid;
import javax.validation.constraints.NotNull;
import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;

/**
 * Provides methods for retrieving and updating {@link AnalysisContext}s.
 *
 * @author <a href="mailto:jesse.sightler@gmail.com">Jesse Sightler</a>
 * @author <a href="http://ondra.zizka.cz/">Ondrej Zizka, zizka@seznam.cz</a>
 */
@Path("analysis-context")
@Consumes("application/json")
@Produces("application/json")
public interface AnalysisContextEndpoint
{
    @GET
    @Path("{id}")
    AnalysisContext get(@PathParam("id") Long id);


    @PUT
    @Path("storeDefaultConfigForProject/{projectId}")
    AnalysisContext storeDefaultConfigForProject(@Valid AnalysisContext analysisContext, @PathParam("projectId") @NotNull Long projectId);

    @POST
    @Path("migrationProjects/{projectId}")
    AnalysisContext create(@Valid AnalysisContext analysisContext, @PathParam("projectId") Long projectId);

    @PUT
    @Path("{id}")
    AnalysisContext update(@PathParam("id") Long id, @Valid AnalysisContext analysisContext);
}
