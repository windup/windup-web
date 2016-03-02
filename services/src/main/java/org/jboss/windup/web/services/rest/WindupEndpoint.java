package org.jboss.windup.web.services.rest;

import org.jboss.windup.web.services.WindupWebProgressMonitor;
import org.jboss.windup.web.services.dto.ProgressStatusDto;

import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;

/**
 * @author <a href="mailto:jesse.sightler@gmail.com">Jesse Sightler</a>
 */
@Path("windup")
@Produces("application/json")
public interface WindupEndpoint
{
    @GET
    @Path("status")
    ProgressStatusDto getStatus(@QueryParam("inputPath") String inputPath);

    @POST
    @Path("execute")
    void executeWindup(@QueryParam("inputPath") String inputPath, @QueryParam("outputPath") String outputPath);
}