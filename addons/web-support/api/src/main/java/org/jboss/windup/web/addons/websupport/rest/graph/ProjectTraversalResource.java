package org.jboss.windup.web.addons.websupport.rest.graph;

import java.util.List;
import java.util.Map;

import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;

import org.jboss.windup.web.addons.websupport.model.PersistedProjectModelTraversalModel;
import org.jboss.windup.web.addons.websupport.rest.FurnaceRESTGraphAPI;

/**
 * Contains methods for loading data regarding {@link PersistedProjectModelTraversalModel}. This is primarily useful
 * for pages that contain a large amount of windup data, such as the project details page.
 *
 * @author <a href="mailto:jesse.sightler@gmail.com">Jesse Sightler</a>
 */
@Path(ProjectTraversalResource.BASE_URL)
@Consumes(MediaType.APPLICATION_JSON)
@Produces(MediaType.APPLICATION_JSON)
public interface ProjectTraversalResource extends FurnaceRESTGraphAPI
{
    String BASE_URL = "/graph/project-traversal";

    /**
     * Returns a list of traversals based upon the traversal type.
     */
    @GET
    @Path("/{executionID}/by-traversal-type/{traversalType}")
    List<Map<String, Object>> getTraversalsByType(@PathParam("executionID") Long executionID,
                @PathParam("traversalType") PersistedProjectModelTraversalModel.PersistedTraversalType persistedTraversalType);
}
