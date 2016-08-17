package org.jboss.windup.web.services.rest;

import org.jboss.windup.web.services.model.ApplicationGroup;
import org.jboss.windup.web.services.model.RegisteredApplication;
import org.jboss.windup.web.services.dto.ProgressStatusDto;

import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;

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
     * Gets the status of an execution for a particular {@link RegisteredApplication}. This will only work
     * for executions that were triggered at the application level.
     */
    @POST
    @Path("status")
    ProgressStatusDto getStatus(RegisteredApplication registeredApplication);

    /**
     * Execute Windup analysis on the provided application.
     */
    @POST
    @Path("execute")
    void executeWindup(RegisteredApplication registeredApplication);

    /**
     * Gets the status of an execution for a particular group.
     */
    @GET
    @Path("statusGroup/{groupID}")
    ProgressStatusDto getStatus(@PathParam("groupID") Long groupID);

    /**
     * Initiates a Windup execution for a particular group.
     */
    @POST
    @Path("executeGroup")
    void executeGroup(Long groupID);
}