package org.jboss.windup.web.services.rest;

import org.jboss.windup.web.services.SourceTargetTechnologies;
import org.jboss.windup.web.services.model.AnalysisContext;

import javax.validation.Valid;
import javax.ws.rs.Consumes;
import javax.ws.rs.DefaultValue;
import javax.ws.rs.GET;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;

/**
 * Provides methods for retrieving and updating {@link AnalysisContext}s.
 *
 * @author <a href="mailto:jesse.sightler@gmail.com">Jesse Sightler</a>
 */
@Path("analysis-context")
@Consumes("application/json")
@Produces("application/json")
public interface AnalysisContextEndpoint
{
    @GET
    @Path("{id}")
    AnalysisContext get(@PathParam("id") Long id);

    @GET
    @Path("{id}/custom-technologies")
    SourceTargetTechnologies getCustomTechnologies(@PathParam("id") Long id);

    /**
     * Saves default analysis context for project
     *
     * Each project should have default context by default,
     * so it should update it.
     *
     * But in very rare situation, it creates new default context,
     * if project doesn't have any (that should never happen)
     *
     */
    @PUT
    @Path("migrationProjects/{projectId}")
    AnalysisContext saveAsProjectDefault(
            @Valid AnalysisContext analysisContext,
            @PathParam("projectId") Long projectId,
            @QueryParam("skipChangeToProvisional") @DefaultValue("false") boolean skipChangeToProvisional,
            @QueryParam("synchronizeTechnologiesWithCustomRules") @DefaultValue("false") boolean synchronizeTechnologiesWithCustomRules
    );
}
