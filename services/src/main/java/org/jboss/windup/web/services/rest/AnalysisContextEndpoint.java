package org.jboss.windup.web.services.rest;

import org.jboss.windup.web.services.model.AnalysisContext;

import javax.validation.Valid;
import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;

/**
 * Provides methods for retrieving and updating {@link AnalysisContext}s.
 *
 * @author <a href="mailto:jesse.sightler@gmail.com">Jesse Sightler</a>
 */
@Path("/analysis-context")
@Consumes("application/json")
@Produces("application/json")
public interface AnalysisContextEndpoint
{
    @GET
    @Path("/get/{id}")
    AnalysisContext get(@PathParam("id") Long id);

    @PUT
    @Path("/create")
    AnalysisContext create(@Valid AnalysisContext analysisContext);

    @PUT
    @Path("/update")
    AnalysisContext update(@Valid AnalysisContext analysisContext);
}
