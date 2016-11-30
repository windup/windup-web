package org.jboss.windup.web.addons.websupport.rest.graph;

import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;

import org.jboss.windup.graph.model.LinkModel;
import org.jboss.windup.graph.model.resource.FileModel;
import org.jboss.windup.web.addons.websupport.rest.FurnaceRESTGraphAPI;

import java.util.List;
import java.util.Map;

/**
 * @author <a href="mailto:jesse.sightler@gmail.com">Jesse Sightler</a>
 */
@Path(LinkResource.BASE_URL)
@Consumes(MediaType.APPLICATION_JSON)
@Produces(MediaType.APPLICATION_JSON)
public interface LinkResource extends FurnaceRESTGraphAPI
{
    String BASE_URL = "/graph/links";

    /**
     * Returns a list of {@link LinkModel}s for the given {@link FileModel}.
     */
    @GET
    @Path("/{executionID}/links-to-transformed-files/{fileModelID}")
    List<Map<String, Object>> getLinksToTransformedFiles(@PathParam("executionID") Long executionID, @PathParam("fileModelID") Integer fileModelID);
}
