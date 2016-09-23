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
import org.jboss.windup.web.services.producer.WindupServicesProducer;

import javax.inject.Inject;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;

/**
 * @author <a href="mailto:jesse.sightler@gmail.com">Jesse Sightler</a>
 */
public class AbstractGraphResource
{
    public static final String KEY_ID = "_id";
    public static final String DIRECTION = "direction";
    public static final String VERTICES = "vertices";

    @PersistenceContext
    private EntityManager entityManager;

    @Inject
    private WindupServicesProducer servicesProducer;

    protected Map<String, Object> convertToMap(Vertex vertex, Integer depth)
    {
        Map<String, Object> result = new HashMap<>();
        for (String key : vertex.getPropertyKeys())
        {
            result.put(key, vertex.getProperty(key));
        }
        result.put(KEY_ID, vertex.getId());

        if (depth == null || depth == 0)
            depth = 0;

        addEdges(result, vertex, depth, Direction.OUT);
        addEdges(result, vertex, depth, Direction.IN);

        return result;
    }

    @SuppressWarnings("unchecked")
    private void addEdges(Map<String, Object> result, Vertex vertex, Integer remainingDepth, Direction direction)
    {
        if (remainingDepth == 0)
            return;

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
                linkedVertices = new ArrayList<>();
                edgeDetails.put(VERTICES, linkedVertices);
                result.put(label, edgeDetails);
            }
            else
            {
                linkedVertices = (List<Map<String, Object>>) edgeDetails.get(VERTICES);
            }

            Vertex otherVertex = edge.getVertex(opposite);
            Map<String, Object> otherVertexMap = convertToMap(otherVertex, remainingDepth - 1);
            linkedVertices.add(otherVertexMap);
        }
    }

    protected List<Map<String, Object>> frameIterableToResult(Iterable<? extends WindupVertexFrame> frames, int depth)
    {
        List<Map<String, Object>> result = new ArrayList<>();
        for (WindupVertexFrame frame : frames)
        {
            result.add(convertToMap(frame.asVertex(), depth));
        }
        return result;
    }

    protected GraphContext getGraph(Long executionID)
    {
        GraphContextFactory graphContextFactory = servicesProducer.getGraphContextFactory();
        WindupExecution execution = entityManager.find(WindupExecution.class, executionID);
        Path graphPath = Paths.get(execution.getGroup().getOutputPath()).resolve(GraphContextFactory.DEFAULT_GRAPH_SUBDIRECTORY);

        return graphContextFactory.load(graphPath);
    }
}
