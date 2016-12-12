package org.jboss.windup.web.addons.websupport.rest.graph;

import org.jboss.windup.graph.model.resource.FileModel;
import org.jboss.windup.web.addons.websupport.rest.FurnaceRESTGraphAPI;

import java.util.List;
import java.util.Map;

import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;

/**
 * @author <a href="mailto:jesse.sightler@gmail.com">Jesse Sightler</a>
 */
@Path(FileModelResource.FILE_MODEL_RESOURCE_URL)
@Consumes(MediaType.APPLICATION_JSON)
@Produces(MediaType.APPLICATION_JSON)
public interface FileModelResource extends FurnaceRESTGraphAPI
{
    String FILE_MODEL_RESOURCE_URL = "/graph/filemodel";

    /**
     * Returns a list of Vertices by filename search.
     */
    @GET
    @Path("/{executionID}/by-filename/{filename}")
    List<Map<String, Object>> get(@PathParam("executionID") Long executionID, @PathParam("filename") String filename);

    /**
     * Returns the source code for a particular {@link FileModel}.
     */
    @GET
    @Path("/{executionID}/source/{vertexID}")
    String getSource(@PathParam("executionID") Long executionID, @PathParam("vertexID") Integer vertexID);
}
