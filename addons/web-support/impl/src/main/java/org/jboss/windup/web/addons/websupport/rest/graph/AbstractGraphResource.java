package org.jboss.windup.web.addons.websupport.rest.graph;

import java.nio.file.Path;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.inject.Inject;
import javax.ws.rs.NotFoundException;
import javax.ws.rs.core.UriInfo;

import org.jboss.windup.graph.GraphContext;
import org.jboss.windup.graph.model.WindupVertexFrame;
import org.jboss.windup.web.addons.websupport.rest.FurnaceRESTGraphAPI;
import org.jboss.windup.web.addons.websupport.rest.GraphPathLookup;
import org.jboss.windup.web.addons.websupport.services.ReportFilterService;

import com.tinkerpop.blueprints.Direction;
import com.tinkerpop.blueprints.Edge;
import com.tinkerpop.blueprints.Vertex;

/**
 * @author <a href="mailto:jesse.sightler@gmail.com">Jesse Sightler</a>
 */
public abstract class AbstractGraphResource implements FurnaceRESTGraphAPI
{
    protected ReportFilterService reportFilterService;
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

    @Override
    public void setReportFilterService(ReportFilterService reportFilterService)
    {
        this.reportFilterService = reportFilterService;
    }

    private String getLink(long executionID, Vertex vertex, String direction, String label)
    {
        String params = String.format("/%s/edges/%s/%s/%s", executionID, vertex.getId(), direction, label);
        return uri.getBaseUri() + GraphResource.GRAPH_RESOURCE_URL + params;
    }

    protected Map<String, Object> convertToMap(long executionID, Vertex vertex, Integer depth)
    {
        return convertToMap(executionID, vertex, depth, Collections.emptyList(), Collections.emptyList());
    }

    protected Map<String, Object> convertToMap(long executionID, Vertex vertex, Integer depth, List<String> whitelistedOutEdges, List<String> whitelistedInLabels)
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
        addEdges(executionID, outVertices, vertex, depth, Direction.OUT, whitelistedOutEdges, whitelistedInLabels);
        Map<String, Object> inVertices = new HashMap<>();
        result.put(GraphResource.VERTICES_IN, inVertices);
        addEdges(executionID, inVertices, vertex, depth, Direction.IN, whitelistedOutEdges, whitelistedInLabels);

        return result;
    }

    private boolean isWhitelistedEdge(List<String> whitelistedOutEdges, List<String> whitelistedInEdges, Direction direction, String label)
    {
        return (direction == Direction.OUT && whitelistedOutEdges.contains(label)) ||
                (direction == Direction.IN && whitelistedInEdges.contains(label));
    }

    @SuppressWarnings("unchecked")
    private void addEdges(long executionID, Map<String, Object> result, Vertex vertex, Integer remainingDepth, Direction direction,
                List<String> whitelistedOutEdges, List<String> whitelistedInEdges)
    {
        final Direction opposite = direction == Direction.OUT ? Direction.IN : Direction.OUT;

        for (Edge edge : vertex.getEdges(direction))
        {
            String label = edge.getLabel();

            Map<String, Object> edgeDetails = (Map<String, Object>) result.get(label);
            // If the details are already there and we aren't recursing any further, then just skip
            if (!isWhitelistedEdge(whitelistedOutEdges, whitelistedInEdges, direction, label) && edgeDetails != null && (remainingDepth == null || remainingDepth <= 0))
                continue;

            final List<Map<String, Object>> linkedVertices;
            if (edgeDetails == null)
            {
                edgeDetails = new HashMap<>();
                edgeDetails.put(GraphResource.DIRECTION, direction.toString());
                result.put(label, edgeDetails);

                // If we aren't serializing any further, then just provide a link
                if (!isWhitelistedEdge(whitelistedOutEdges, whitelistedInEdges, direction, label) && (remainingDepth == null || remainingDepth <= 0))
                {
                    edgeDetails.put(GraphResource.TYPE, GraphResource.TYPE_LINK);
                    String linkUri = getLink(executionID, vertex, direction.toString(), label);
                    edgeDetails.put(GraphResource.LINK, linkUri);
                    continue;
                }

                linkedVertices = new ArrayList<>();
                edgeDetails.put(GraphResource.VERTICES, linkedVertices);
            }
            else
            {
                linkedVertices = (List<Map<String, Object>>) edgeDetails.get(GraphResource.VERTICES);
            }

            Vertex otherVertex = edge.getVertex(opposite);
            Map<String, Object> otherVertexMap = convertToMap(executionID, otherVertex, remainingDepth - 1, whitelistedOutEdges, whitelistedInEdges);
            linkedVertices.add(otherVertexMap);
        }
    }

    protected List<Map<String, Object>> frameIterableToResult(long executionID, Iterable<? extends WindupVertexFrame> frames, int depth)
    {
        List<Map<String, Object>> result = new ArrayList<>();
        for (WindupVertexFrame frame : frames)
        {
            result.add(convertToMap(executionID, frame.asVertex(), depth, Collections.emptyList(), Collections.emptyList()));
        }
        return result;
    }

    protected GraphContext getGraph(Long executionID)
    {
        Path graphPath = graphPathLookup.getByExecutionID(executionID);
        if (graphPath == null)
            throw new NotFoundException("Execution not found, ID: " + executionID);

        GraphContext graph = graphCache.getGraph(graphPath, false);
        if (graph == null)
            throw new IllegalStateException("GraphContext obtaining failed for exec. ID " + executionID + ", path: " + graphPath);
        return graph;
    }
}
