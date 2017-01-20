package org.jboss.windup.web.addons.websupport.rest.graph;

import org.jboss.windup.web.addons.websupport.rest.FurnaceRESTGraphAPI;

import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.MediaType;
import java.util.List;
import java.util.Map;
import javax.ws.rs.DefaultValue;

/**
 * @author <a href="mailto:jesse.sightler@gmail.com">Jesse Sightler</a>
 */
@Path(GraphResource.GRAPH_RESOURCE_URL)
@Consumes(MediaType.APPLICATION_JSON)
@Produces(MediaType.APPLICATION_JSON)
public interface GraphResource extends FurnaceRESTGraphAPI
{
    String GRAPH_RESOURCE_URL = "graph";

    String KEY_ID = "_id";
    String TYPE = "_type";
    String TYPE_VERTEX = "vertex";
    String TYPE_LINK = "link";
    String LINK = "link";

    String DIRECTION = "direction";
    String VERTICES = "vertices";
    String VERTICES_OUT = "vertices_out";
    String VERTICES_IN = "vertices_in";
    String EDGE_DATA = "edgeData";

    // @formatter:off

    @GET
    @Path("/{executionID}/{id}")
    Map<String, Object> get(
        @PathParam("executionID") Long executionID,
        @PathParam("id") Integer vertexID,
        @QueryParam("depth") Integer depth,
        @QueryParam("dedup") @DefaultValue("false") Boolean dedup
    );

    @GET
    @Path("/{executionID}/edges/{vertexID}/{edgeDirection}/{edgeLabel}")
    List<Map<String, Object>> getEdges(
        @PathParam("executionID") Long executionID,
        @PathParam("vertexID") Integer vertexID,
        @PathParam("edgeDirection") String edgeDirection,
        @PathParam("edgeLabel") String edgeLabel,
        @QueryParam("dedup") @DefaultValue("false") Boolean dedup
    );

    @GET
    @Path("/{executionID}/by-type/{vertexType}")
    List<Map<String, Object>> getByType(
        @PathParam("executionID") Long executionID,
        @PathParam("vertexType") String vertexType,
        @QueryParam("depth") Integer depth,
        @QueryParam("dedup") @DefaultValue("false") Boolean dedup,
        @QueryParam("in") String inEdges,
        @QueryParam("out") String outEdges,
        @QueryParam("includeInVertices") @DefaultValue("true") Boolean includeInVertices
    );


    @GET
    @Path("/{executionID}/by-type/{vertexType}/{propertyName}={propertyValue}")
    List<Map<String, Object>> getByType(
        @PathParam("executionID") Long executionID,
        @PathParam("vertexType") String vertexType,
        @PathParam("propertyName") String propertyName,
        @PathParam("propertyValue") String propertyValue,
        @QueryParam("depth") Integer depth,
        @QueryParam("dedup") @DefaultValue("false") Boolean dedup,
        @QueryParam("includeInVertices") @DefaultValue("true") Boolean includeInVertices
    );

    // @formatter:on
}
