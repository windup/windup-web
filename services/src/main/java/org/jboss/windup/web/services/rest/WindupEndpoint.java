package org.jboss.windup.web.services.rest;

import org.jboss.windup.web.services.model.WindupExecution;

import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import java.util.Collection;
import javax.validation.Valid;
import javax.validation.constraints.NotNull;
import org.jboss.windup.web.services.model.AnalysisContext;

/**
 * Contains methods for executing Windup and querying the current status of an execution run.
 *
 * @author <a href="mailto:jesse.sightler@gmail.com">Jesse Sightler</a>
 */
@Path("windup")
@Consumes("application/json")
@Produces("application/json")
public interface WindupEndpoint
{
    /**
     * Gets the execution based upon the execution ID.
     */
    @GET
    @Path("executions/{executionID}")
    WindupExecution getExecution(@PathParam("executionID") Long executionID);

    /**
     * Initiates a Windup execution for the given existing AnalysisContext.
     */
    @POST
    @Path("execute-with-context")
    WindupExecution executeWithContext(Long contextID);

    /**
     * Initiates a Windup execution for the given AnalysisContext.
     * The context is persisted as a new instance, and attached to the new execution.
     */
    @POST
    @Path("execute-project-with-context/{projectId}")
    WindupExecution executeProjectWithContext(@Valid AnalysisContext analysisContext, @PathParam("projectId") @NotNull Long projectId);

    @GET
    @Path("executions")
    Collection<WindupExecution> getAllExecutions();

    @GET
    @Path("by-project/{projectId}")
    Collection<WindupExecution> getProjectExecutions(@PathParam("projectId") Long projectId);

    @POST
    @Path("executions/{executionId}/cancel")
    void cancelExecution(@PathParam("executionId") Long executionID);
}
