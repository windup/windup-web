package org.jboss.windup.web.services.rest.graph;

import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.tinkerpop.blueprints.Direction;
import com.tinkerpop.blueprints.Edge;
import com.tinkerpop.blueprints.Vertex;
import org.jboss.windup.graph.GraphContext;
import org.jboss.windup.graph.GraphContextFactory;
import org.jboss.windup.graph.model.WindupVertexFrame;
import org.jboss.windup.web.services.model.WindupExecution;

import javax.inject.Inject;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.UriInfo;

/**
 * @author <a href="mailto:jesse.sightler@gmail.com">Jesse Sightler</a>
 */
public class AbstractGraphResource
{
    public static final String KEY_ID = "_id";
    public static final String TYPE = "_type";
    public static final String TYPE_VERTEX = "vertex";
    public static final String TYPE_LINK = "link";
    public static final String LINK = "link";

    public static final String DIRECTION = "direction";
    public static final String VERTICES = "vertices";
    public static final String VERTICES_OUT = "vertices_out";
    public static final String VERTICES_IN = "vertices_in";

    @Context
    private UriInfo uri;

    @PersistenceContext
    private EntityManager entityManager;

    @Inject
    private GraphCache graphCache;

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

        result.put(TYPE, TYPE_VERTEX);
        for (String key : vertex.getPropertyKeys())
        {
            result.put(key, vertex.getProperty(key));
        }
        result.put(KEY_ID, vertex.getId());

        Map<String, Object> outVertices = new HashMap<>();
        result.put(VERTICES_OUT, outVertices);
        addEdges(executionID, outVertices, vertex, depth, Direction.OUT);
        Map<String, Object> inVertices = new HashMap<>();
        result.put(VERTICES_IN, inVertices);
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
                edgeDetails.put(DIRECTION, direction.toString());
                result.put(label, edgeDetails);

                // If we aren't serializing any further, then just provide a link
                if (remainingDepth == null || remainingDepth == 0)
                {
                    edgeDetails.put(TYPE, TYPE_LINK);
                    String linkUri = getLink(executionID, vertex, direction.toString(), label);
                    edgeDetails.put(LINK, linkUri);
                    return;
                }

                linkedVertices = new ArrayList<>();
                edgeDetails.put(VERTICES, linkedVertices);
            }
            else
            {
                linkedVertices = (List<Map<String, Object>>) edgeDetails.get(VERTICES);
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
        WindupExecution execution = entityManager.find(WindupExecution.class, executionID);
        Path graphPath = Paths.get(execution.getGroup().getOutputPath()).resolve(GraphContextFactory.DEFAULT_GRAPH_SUBDIRECTORY);
        return graphCache.getGraph(graphPath);
    }
}
