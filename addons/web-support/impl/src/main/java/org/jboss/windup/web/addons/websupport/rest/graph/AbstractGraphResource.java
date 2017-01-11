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
import java.util.TreeMap;

/**
 * @author <a href="mailto:jesse.sightler@gmail.com">Jesse Sightler</a>
 * @author <a href="http://ondra.zizka.cz/">Ondrej Zizka, zizka at seznam.cz</a>
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
        return convertToMap(new GraphMarhallingContext(executionID, vertex, depth, Collections.emptyList(), Collections.emptyList()), vertex);
    }

    protected Map<String, Object> convertToMap(long executionID, Vertex vertex, Integer depth, List<String> whitelistedOutEdges, List<String> whitelistedInEdges)
    {
        return convertToMap(new GraphMarhallingContext(executionID, vertex, depth, whitelistedOutEdges, whitelistedInEdges), vertex);
    }


    private final static boolean DEVELOPMENT_MODE = true;

    private Map<String, Object> convertToMap(GraphMarhallingContext ctx, Vertex currentVertex)
    {
        // Keep the order so that _id and _type are 1st.
        Map<String, Object> vertexMap = DEVELOPMENT_MODE ? new TreeMap<>() : new HashMap<>();

        vertexMap.put(GraphResource.TYPE, GraphResource.TYPE_VERTEX); // TODO: Not necessary.
        for (String key : currentVertex.getPropertyKeys())
        {
            vertexMap.put(key, currentVertex.getProperty(key));
        }
        vertexMap.put(GraphResource.KEY_ID, currentVertex.getId());

        Map<String, Object> outVertices = new HashMap<>();
        vertexMap.put(GraphResource.VERTICES_OUT, outVertices);
        addEdges(ctx, vertexMap, currentVertex, Direction.OUT);

        Map<String, Object> inVertices = new HashMap<>();
        vertexMap.put(GraphResource.VERTICES_IN, inVertices);
        addEdges(ctx, vertexMap, currentVertex, Direction.IN);

        return vertexMap;
    }


    @SuppressWarnings("unchecked")
    private void addEdges(GraphMarhallingContext ctx, Map<String, Object> dataTree, Vertex vertex, Direction direction)
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

            Map<String, Object> edgeDetails = (Map<String, Object>) dataTree.get(label);
            // If the details are already there and we aren't recursing any further, then just skip
            if (!whitelistedLabels.contains(label) && edgeDetails != null && ctx.remainingDepth <= 0)
                continue;

            final List<Map<String, Object>> linkedVertices;
            if (edgeDetails == null)
            {
                edgeDetails = new HashMap<>();
                edgeDetails.put(GraphResource.DIRECTION, direction.toString()); // TODO: Not used.
                dataTree.put(label, edgeDetails);

                // If we aren't serializing any further, then just provide a link
                if (!whitelistedLabels.contains(label) && ctx.remainingDepth <= 0)
                {
                    edgeDetails.put(GraphResource.TYPE, GraphResource.TYPE_LINK); // TODO: Not necessary.
                    String linkUri = getLink(ctx.executionID, vertex, direction.toString(), label);
                    edgeDetails.put(GraphResource.LINK, linkUri);
                    continue;
                }

                linkedVertices = new ArrayList<>();
                edgeDetails.put(GraphResource.VERTICES, linkedVertices);// TODO: Could be removed and the content pulled up.
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
            if (!edge.getPropertyKeys().isEmpty()){
                Map<String, Object> edgeData = new HashMap<>();
                edge.getPropertyKeys().forEach(key -> edgeData.put(key, edge.getProperty(key)));
                otherVertexMap.put(GraphResource.EDGE_DATA, edgeData);
            }

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

    public GraphMarhallingContext(long executionID, Vertex startVertex, Integer depth, List<String> whitelistedOutEdges, List<String> whitelistedInLabels)
    {
        this.executionID = executionID;
        this.startVertex = startVertex;
        this.remainingDepth = depth == null ? 0 : depth;
        this.whitelistedOutEdges = whitelistedOutEdges;
        this.whitelistedInEdges = whitelistedInLabels;
    }
}