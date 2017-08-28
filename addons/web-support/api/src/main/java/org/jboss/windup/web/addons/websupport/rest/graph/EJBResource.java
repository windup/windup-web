package org.jboss.windup.web.addons.websupport.rest.graph;

import org.jboss.windup.web.addons.websupport.rest.FurnaceRESTGraphAPI;

import javax.ws.rs.*;
import java.util.Map;

@Path("reports/{reportId}/ejb")
@Consumes("application/json")
@Produces("application/json")
public interface EJBResource extends FurnaceRESTGraphAPI {

    @POST
    @Path("/mdb")
    Object getMDB(@PathParam("reportId") final Long reportID, Map<String, Object> filterAsMap);

    @POST
    @Path("/ejb")
    Object getEJB(@PathParam("reportId") final Long reportID, @QueryParam("sessionType") final String sessionType, Map<String, Object> filterAsMap);

    @POST
    @Path("/entity")
    Object getEntity(@PathParam("reportId") final Long reportID, Map<String, Object> filterAsMap);
}
