package org.jboss.windup.web.services.rest;

import org.jboss.windup.web.services.dto.ProgressStatusDto;

import javax.ws.rs.FormParam;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;

/**
 * @author <a href="mailto:jesse.sightler@gmail.com">Jesse Sightler</a>
 */
@Path("windup")
@Produces("application/json")
public interface WindupEndpoint
{
    @POST
    @Path("status")
    ProgressStatusDto getStatus(@FormParam("path") String inputPath);

    @POST
    @Path("execute")
    void executeWindup(@FormParam("inputPath") String inputPath, @FormParam("outputPath") String outputPath);
}