package org.jboss.windup.web.addons.websupport.rest.graph;

import org.jboss.windup.graph.model.resource.FileModel;
import org.jboss.windup.reporting.model.ClassificationModel;
import org.jboss.windup.web.addons.websupport.rest.FurnaceRESTGraphAPI;

import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import java.util.List;
import java.util.Map;

/**
 * @author <a href="mailto:jesse.sightler@gmail.com">Jesse Sightler</a>
 */
@Path(ClassificationResource.BASE_URL)
@Consumes(MediaType.APPLICATION_JSON)
@Produces(MediaType.APPLICATION_JSON)
public interface ClassificationResource extends FurnaceRESTGraphAPI
{
    String BASE_URL = "/graph/classifications";

    /**
     * Returns a list of {@link ClassificationModel}s for the given {@link FileModel}.
     */
    @GET
    @Path("/{executionID}/by-file/{fileModelID}")
    List<Map<String, Object>> getClassifications(@PathParam("executionID") Long executionID, @PathParam("fileModelID") Integer fileModelID);
}
