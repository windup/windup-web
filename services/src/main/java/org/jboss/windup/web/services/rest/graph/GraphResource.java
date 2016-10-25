package org.jboss.windup.web.services.rest.graph;

import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import java.util.List;
import java.util.Map;

/**
 * @author <a href="mailto:jesse.sightler@gmail.com">Jesse Sightler</a>
 */
@Path(GraphResource.GRAPH_RESOURCE_URL)
@Consumes("application/json")
@Produces("application/json")
public interface GraphResource
{
    String GRAPH_RESOURCE_URL = "graph";

    @GET
    @Path("/{executionID}/{id}")
    Map<String, Object> get(@PathParam("executionID") Long executionID, @PathParam("id") Integer vertexID, @QueryParam("depth") Integer depth);

    @GET()
    @Path("/{executionID}/edges/{vertexID}/{edgeDirection}/{edgeLabel}")
    List<Map<String, Object>> getEdges(@PathParam("executionID") Long executionID, @PathParam("vertexID") Integer vertexID, @PathParam("edgeDirection") String edgeDirection, @PathParam("edgeLabel") String edgeLabel);

    @GET()
    @Path("/{executionID}/by-type/{vertexType}")
    List<Map<String, Object>> getByType(@PathParam("executionID") Long executionID, @PathParam("vertexType") String vertexType, @QueryParam("depth") Integer depth);

    @GET()
    @Path("/{executionID}/by-type/{vertexType}/{propertyName}={propertyValue}")
    List<Map<String, Object>> getByType(@PathParam("executionID") Long executionID, @PathParam("vertexType") String vertexType, @PathParam("propertyName") String propertyName, @PathParam("propertyValue") String propertyValue, @QueryParam("depth") Integer depth);
}
