package org.jboss.windup.web.services.rest.graph;

import java.util.List;
import java.util.Map;

import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;

/**
 * @author <a href="mailto:jesse.sightler@gmail.com">Jesse Sightler</a>
 */
@Path("/graph/filemodel")
@Consumes("application/json")
@Produces("application/json")
public interface FileModelResource
{
    @GET
    @Path("/{executionID}/by-filename/{filename}")
    List<Map<String, Object>> get(@PathParam("executionID") Long executionID, @PathParam("filename") String filename);
}
