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
import javax.ws.rs.core.Response;

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

    /**
     * Returns a list of all "types" registered within the system.
     */
    @GET
    @Path("/introspect/type-list")
    List<ModelTypeInformation> getTypes();

    /**
     * Gets vertex by id
     *
     * @param executionID Execution id
     * @param vertexID Vertex id
     * @param depth Depth of returned graph
     * @param dedup Deduplicate vertices
     * @return Map of selected vertices
     */
    @GET
    @Path("/{executionID}/{id}")
    Map<String, Object> get(
        @PathParam("executionID") Long executionID,
        @PathParam("id") Integer vertexID,
        @QueryParam("depth") Integer depth,
        @QueryParam("dedup") @DefaultValue("false") Boolean dedup
    );

    /**
     * Returns edges map filtered by parameters
     *
     * @param executionID Execution id
     * @param vertexID Vertex containing given edge
     * @param edgeDirection Edge direction (IN/OUT/BOTH)
     * @param edgeLabel Edge label
     * @param dedup Deduplicate result
     * @return Map of selected edges
     */
    @GET
    @Path("/{executionID}/edges/{vertexID}/{edgeDirection}/{edgeLabel}")
    List<Map<String, Object>> getEdges(
        @PathParam("executionID") Long executionID,
        @PathParam("vertexID") Integer vertexID,
        @PathParam("edgeDirection") String edgeDirection,
        @PathParam("edgeLabel") String edgeLabel,
        @QueryParam("dedup") @DefaultValue("false") Boolean dedup
    );

    /**
     * Returns vertices map filtered by parameters
     *
     * @param executionID Execution id
     * @param vertexType Type of vertex
     * @param depth Depth of returned graph
     * @param dedup Deduplicate vertices
     * @param inEdges List of in edges separated by ","
     * @param outEdges List of out edges separated by ",'
     * @param includeInVertices Include in vertices
     * @return Map of selected vertices
     */
    @GET
    @Path("/{executionID}/by-type/{vertexType}")
    Response getByType(
        @PathParam("executionID") Long executionID,
        @PathParam("vertexType") String vertexType,
        @QueryParam("depth") Integer depth,
        @QueryParam("dedup") @DefaultValue("false") Boolean dedup,
        @QueryParam("in") String inEdges,
        @QueryParam("out") String outEdges,
        @QueryParam("includeInVertices") @DefaultValue("true") Boolean includeInVertices,
        @QueryParam("blacklistProperties") String blacklistProperties
    );


    /**
     * Returns vertices map filtered by parameters
     *
     * @param executionID Execution id
     * @param vertexType Type of vertex
     * @param propertyName Name of property
     * @param propertyValue Value of property
     * @param depth Depth of returned graph
     * @param dedup Deduplicate vertices
     * @param includeInVertices Include in vertices
     * @return Map of selected vertices
     */
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
