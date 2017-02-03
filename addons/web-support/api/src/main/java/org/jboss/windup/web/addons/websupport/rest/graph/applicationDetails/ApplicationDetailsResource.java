package org.jboss.windup.web.addons.websupport.rest.graph.applicationDetails;

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
@Path(ApplicationDetailsResource.BASE_URL)
@Consumes(MediaType.APPLICATION_JSON)
@Produces(MediaType.APPLICATION_JSON)
public interface ApplicationDetailsResource extends FurnaceRESTGraphAPI
{
    String BASE_URL = "/graph/application-details";

    /**
     * Returns a list of traversals based upon the traversal type.
     *
     * NOTE: In this case, the filter associated with the execution will only be applied at the application level.
     *       Hints and Classifications will not be automatically filtered by the group filter.
     *
     */
    @GET
    @Path("/{executionID}")
    ApplicationDetailsDTO getApplicationDetailsData(@PathParam("executionID") Long executionID);
}
