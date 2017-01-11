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
import java.util.HashSet;
import java.util.Set;

/**
 * @author <a href="mailto:jesse.sightler@gmail.com">Jesse Sightler</a>
 * @author <a href="http://ondra.zizka.cz">Ondrej Zizka, zizka at seznam.cz</a>
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
        return convertToMap(
                new GraphMarhallingContext(executionID, vertex, depth, whitelistedOutEdges, whitelistedInLabels),
                executionID, vertex, depth, whitelistedOutEdges, whitelistedInLabels);
    }

    private Map<String, Object> convertToMap(
            GraphMarhallingContext ctx,
            long executionID, Vertex vertex, Integer depth, List<String> whitelistedOutEdges, List<String> whitelistedInLabels)
    {
        if (depth == null)
            depth = 0;

        Map<String, Object> result = new HashMap<>();

        result.put(GraphResource.TYPE, GraphResource.TYPE_VERTEX);
        result.put(GraphResource.KEY_ID, vertex.getId());

        // Spare CPU cycles, save the planet. Visited vertices will only contain _id.
        if (!ctx.addVisited(vertex))
            return result;

        for (String key : vertex.getPropertyKeys())
        {
            result.put(key, vertex.getProperty(key));
        }


        Map<String, Object> outVertices = new HashMap<>();
        result.put(GraphResource.VERTICES_OUT, outVertices);
        addEdges(ctx, executionID, outVertices, vertex, depth, Direction.OUT, whitelistedOutEdges, whitelistedInLabels);

        Map<String, Object> inVertices = new HashMap<>();
        result.put(GraphResource.VERTICES_IN, inVertices);
        addEdges(ctx, executionID, inVertices, vertex, depth, Direction.IN, whitelistedOutEdges, whitelistedInLabels);

        return result;
    }

    private boolean isWhitelistedEdge(List<String> whitelistedOutEdges, List<String> whitelistedInEdges, Direction direction, String label)
    {
        return (direction == Direction.OUT && whitelistedOutEdges.contains(label)) ||
                (direction == Direction.IN && whitelistedInEdges.contains(label));
    }

    @SuppressWarnings("unchecked")
    private void addEdges(
            GraphMarhallingContext ctx,
            long executionID, Map<String, Object> result, Vertex vertex, Integer remainingDepth, Direction direction,
            List<String> whitelistedOutEdges, List<String> whitelistedInEdges)
    {
        final Direction opposite = direction == Direction.OUT ? Direction.IN : Direction.OUT;

        List<String> whitelistedLabels = direction == Direction.OUT ? whitelistedOutEdges : whitelistedInEdges;

        Iterable<Edge> edges;
        if (whitelistedLabels == null || whitelistedLabels.isEmpty())
            edges = vertex.getEdges(direction);
        else
            edges = vertex.getEdges(direction, whitelistedLabels.toArray(new String[whitelistedLabels.size()]));

        for (Edge edge : edges)
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

            // Recursion
            Map<String, Object> otherVertexMap = convertToMap(ctx, executionID, otherVertex, remainingDepth - 1, whitelistedOutEdges, whitelistedInEdges);

            // Add edge properties if any
            if (!edge.getPropertyKeys().isEmpty())
            {
                Map<String, Object> edgeData = new HashMap<>();
                edge.getPropertyKeys().forEach(key -> edgeData.put(key, edge.getProperty(key)));
                otherVertexMap.put(GraphResource.EDGE_DATA, edgeData);
            }
            linkedVertices.add(otherVertexMap);
        }
    }

    protected List<Map<String, Object>> frameIterableToResult(long executionID, Iterable<? extends WindupVertexFrame> frames, int depth)
    {
        GraphMarhallingContext ctx = new GraphMarhallingContext(executionID, null, depth, Collections.emptyList(), Collections.emptyList());

        List<Map<String, Object>> result = new ArrayList<>();
        for (WindupVertexFrame frame : frames)
        {
            result.add(convertToMap(ctx, executionID, frame.asVertex(), depth, Collections.emptyList(), Collections.emptyList()));
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


class GraphMarhallingContext
{
    long executionID;
    Vertex startVertex;
    int remainingDepth;
    List<String> whitelistedOutEdges;
    List<String> whitelistedInEdges;

    Set<Long> visitedVertices = new HashSet();


    public GraphMarhallingContext(long executionID, Vertex startVertex, Integer depth, List<String> whitelistedOutEdges, List<String> whitelistedInLabels)
    {
        this.executionID = executionID;
        this.startVertex = startVertex;
        this.remainingDepth = depth == null ? 0 : depth;
        this.whitelistedOutEdges = whitelistedOutEdges;
        this.whitelistedInEdges = whitelistedInLabels;
    }


    /**
     * @return False if the given vertex was already visited before.
     */
    boolean addVisited(Vertex v)
    {
        return this.visitedVertices.add(((Number)v.getId()).longValue());
    }

    boolean wasVisited(Vertex v)
    {
        return this.visitedVertices.contains(((Number)v.getId()).longValue());
    }
}
