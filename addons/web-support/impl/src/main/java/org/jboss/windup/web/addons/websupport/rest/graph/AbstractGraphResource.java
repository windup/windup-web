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

    protected Map<String, Object> convertToMap(long executionID, Vertex vertex, Integer depth, boolean dedup)
    {
        return convertToMap(executionID, vertex, depth, dedup, Collections.emptyList(), Collections.emptyList());
    }

    protected Map<String, Object> convertToMap(long executionID, Vertex vertex, Integer depth, boolean dedup, List<String> whitelistedOutEdges, List<String> whitelistedInLabels)
    {
        return convertToMap(new GraphMarhallingContext(executionID, vertex, depth, dedup, whitelistedOutEdges, whitelistedInLabels), vertex);
    }

    private Map<String, Object> convertToMap(GraphMarhallingContext ctx, Vertex vertex)
    {
        Map<String, Object> result = new HashMap<>();

        result.put(GraphResource.TYPE, GraphResource.TYPE_VERTEX);
        result.put(GraphResource.KEY_ID, vertex.getId());

        // Spare CPU cycles, save the planet. Visited vertices will only contain _id.
        if (ctx.deduplicateVertices && !ctx.addVisited(vertex))
            return result;

        for (String key : vertex.getPropertyKeys())
        {
            result.put(key, vertex.getProperty(key));
        }


        Map<String, Object> outVertices = new HashMap<>();
        result.put(GraphResource.VERTICES_OUT, outVertices);
        addEdges(ctx, vertex, Direction.OUT, outVertices);

        Map<String, Object> inVertices = new HashMap<>();
        result.put(GraphResource.VERTICES_IN, inVertices);
        addEdges(ctx, vertex, Direction.IN, inVertices);

        return result;
    }

    private boolean isWhitelistedEdge(List<String> whitelistedOutEdges, List<String> whitelistedInEdges, Direction direction, String label)
    {
        return (direction == Direction.OUT && whitelistedOutEdges.contains(label)) ||
                (direction == Direction.IN && whitelistedInEdges.contains(label));
    }

    @SuppressWarnings("unchecked")
    private void addEdges(GraphMarhallingContext ctx, Vertex vertex, Direction direction, Map<String, Object> result)
    {
        List<String> whitelistedLabels = direction == Direction.OUT ? ctx.whitelistedOutEdges : ctx.whitelistedInEdges;

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
            if (!isWhitelistedEdge(ctx.whitelistedOutEdges, ctx.whitelistedInEdges, direction, label) && edgeDetails != null && ctx.remainingDepth <= 0)
                continue;

            final List<Map<String, Object>> linkedVertices;
            if (edgeDetails == null)
            {
                edgeDetails = new HashMap<>();
                edgeDetails.put(GraphResource.DIRECTION, direction.toString());
                result.put(label, edgeDetails);

                // If we aren't serializing any further, then just provide a link
                if (!isWhitelistedEdge(ctx.whitelistedOutEdges, ctx.whitelistedInEdges, direction, label) && ctx.remainingDepth <= 0)
                {
                    edgeDetails.put(GraphResource.TYPE, GraphResource.TYPE_LINK);
                    String linkUri = getLink(ctx.executionID, vertex, direction.toString(), label);
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

            Vertex otherVertex = edge.getVertex(direction == Direction.OUT ? Direction.IN : Direction.OUT);

            // Recursion
            ctx.remainingDepth--;
            Map<String, Object> otherVertexMap = convertToMap(ctx, otherVertex);
            ctx.remainingDepth++;

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
        GraphMarhallingContext ctx = new GraphMarhallingContext(executionID, null, depth, false, Collections.emptyList(), Collections.emptyList());

        List<Map<String, Object>> result = new ArrayList<>();
        for (WindupVertexFrame frame : frames)
        {
            result.add(convertToMap(ctx, frame.asVertex()));
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


/**
 * Keeps the context of a marshalling of a single data tree.
 */
class GraphMarhallingContext
{
    final long executionID;
    final Vertex startVertex;
    int remainingDepth;
    final List<String> whitelistedOutEdges;
    final List<String> whitelistedInEdges;

    final Set<Long> visitedVertices = new HashSet();
    final boolean deduplicateVertices;


    public GraphMarhallingContext(long executionID, Vertex startVertex, Integer depth, boolean dedup, List<String> whitelistedOutEdges, List<String> whitelistedInLabels)
    {
        this.executionID = executionID;
        this.startVertex = startVertex;
        this.remainingDepth = depth == null ? 0 : depth;
        this.deduplicateVertices = dedup;
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
