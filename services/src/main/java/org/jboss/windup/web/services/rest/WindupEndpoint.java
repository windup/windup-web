package org.jboss.windup.web.services.rest;

import org.jboss.windup.web.services.model.WindupExecution;

import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import java.util.Collection;

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
     * Initiates a Windup execution for a particular AnalysisContext.
     */
    @POST
    @Path("execute-with-context")
    WindupExecution executeWithContext(Long contextID);

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
