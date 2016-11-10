package org.jboss.windup.web.addons.websupport.rest.graph;

import java.nio.file.Path;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.tinkerpop.blueprints.Direction;
import com.tinkerpop.blueprints.Edge;
import com.tinkerpop.blueprints.Vertex;
import org.jboss.windup.graph.GraphContext;
import org.jboss.windup.graph.model.WindupVertexFrame;
import org.jboss.windup.web.addons.websupport.rest.FurnaceRESTGraphAPI;
import org.jboss.windup.web.addons.websupport.rest.GraphPathLookup;

import javax.inject.Inject;
import javax.ws.rs.NotFoundException;
import javax.ws.rs.core.UriInfo;

/**
 * @author <a href="mailto:jesse.sightler@gmail.com">Jesse Sightler</a>
 */
public abstract class AbstractGraphResource implements FurnaceRESTGraphAPI
{
    private UriInfo uri;

    @Inject
    private GraphCache graphCache;

    private GraphPathLookup graphPathLookup;

    @Override
    public void setUriInfo(UriInfo uriInfo)
    {
        this.uri = uriInfo;
    }

    @Override
    public void setGraphPathLookup(GraphPathLookup graphPathLookup)
    {
        this.graphPathLookup = graphPathLookup;
    }

    private String getLink(long executionID, Vertex vertex, String direction, String label)
    {
        String params = String.format("/%s/edges/%s/%s/%s", executionID, vertex.getId(), direction, label);
        return uri.getBaseUri() + GraphResource.GRAPH_RESOURCE_URL + params;
    }

    protected Map<String, Object> convertToMap(long executionID, Vertex vertex, Integer depth)
    {
        if (depth == null)
            depth = 0;

        Map<String, Object> result = new HashMap<>();

        result.put(GraphResource.TYPE, GraphResource.TYPE_VERTEX);
        for (String key : vertex.getPropertyKeys())
        {
            result.put(key, vertex.getProperty(key));
        }
        result.put(GraphResource.KEY_ID, vertex.getId());

        Map<String, Object> outVertices = new HashMap<>();
        result.put(GraphResource.VERTICES_OUT, outVertices);
        addEdges(executionID, outVertices, vertex, depth, Direction.OUT);
        Map<String, Object> inVertices = new HashMap<>();
        result.put(GraphResource.VERTICES_IN, inVertices);
        addEdges(executionID, inVertices, vertex, depth, Direction.IN);

        return result;
    }

    @SuppressWarnings("unchecked")
    private void addEdges(long executionID, Map<String, Object> result, Vertex vertex, Integer remainingDepth, Direction direction)
    {
        final Direction opposite = direction == Direction.OUT ? Direction.IN : Direction.OUT;

        for (Edge edge : vertex.getEdges(direction))
        {
            String label = edge.getLabel();

            Map<String, Object> edgeDetails = (Map<String, Object>) result.get(label);

            final List<Map<String, Object>> linkedVertices;
            if (edgeDetails == null)
            {
                edgeDetails = new HashMap<>();
                edgeDetails.put(GraphResource.DIRECTION, direction.toString());
                result.put(label, edgeDetails);

                // If we aren't serializing any further, then just provide a link
                if (remainingDepth == null || remainingDepth == 0)
                {
                    edgeDetails.put(GraphResource.TYPE, GraphResource.TYPE_LINK);
                    String linkUri = getLink(executionID, vertex, direction.toString(), label);
                    edgeDetails.put(GraphResource.LINK, linkUri);
                    return;
                }

                linkedVertices = new ArrayList<>();
                edgeDetails.put(GraphResource.VERTICES, linkedVertices);
            }
            else
            {
                linkedVertices = (List<Map<String, Object>>) edgeDetails.get(GraphResource.VERTICES);
            }

            Vertex otherVertex = edge.getVertex(opposite);
            Map<String, Object> otherVertexMap = convertToMap(executionID, otherVertex, remainingDepth - 1);
            linkedVertices.add(otherVertexMap);
        }
    }

    protected List<Map<String, Object>> frameIterableToResult(long executionID, Iterable<? extends WindupVertexFrame> frames, int depth)
    {
        List<Map<String, Object>> result = new ArrayList<>();
        for (WindupVertexFrame frame : frames)
        {
            result.add(convertToMap(executionID, frame.asVertex(), depth));
        }
        return result;
    }

    protected GraphContext getGraph(Long executionID)
    {
        Path graphPath = graphPathLookup.getByExecutionID(executionID);
        if (graphPath == null)
            throw new NotFoundException("Execution not found, ID: " + executionID);

        GraphContext graph = graphCache.getGraph(graphPath);
        if (graph == null)
            throw new IllegalStateException("GraphContext obtaining failed for exec. ID " + executionID + ", path: " + graphPath);
        return graph;
    }
}
