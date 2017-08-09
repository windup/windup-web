package org.jboss.windup.web.addons.websupport.rest.graph;

import org.jboss.windup.web.addons.websupport.rest.FurnaceRESTGraphAPI;

import javax.ws.rs.Consumes;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import java.util.Map;

/**
 * @author <a href="mailto:jesse.sightler@gmail.com">Jesse Sightler</a>
 */
@Path("reports/{executionId}/hardcodedIP")
@Consumes("application/json")
@Produces("application/json")
public interface HardcodedIPResource extends FurnaceRESTGraphAPI
{
    /**
     * Returns a high level summary of all issues.
     */
    @POST
    Object get(@PathParam("executionId") Long reportID, Map<String, Object> filterAsMap);

}
