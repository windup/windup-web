package org.jboss.windup.web.services.rest;

import com.tinkerpop.blueprints.Direction;
import com.tinkerpop.blueprints.Edge;
import com.tinkerpop.blueprints.Vertex;
import org.apache.commons.lang3.StringUtils;
import org.jboss.windup.graph.GraphContext;
import org.jboss.windup.web.services.producer.WindupServicesProducer;

import javax.inject.Inject;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * @author <a href="mailto:jesse.sightler@gmail.com">Jesse Sightler</a>
 */
public class GraphResourceImpl implements GraphResource
{
    public static final String DIRECTION = "direction";
    public static final String VERTICES = "vertices";
    @Inject
    WindupServicesProducer servicesProducer;

    @Override
    public Map<String, Object> get(String graphName, Integer id, Integer depth)
    {
        GraphContext graphContext = getGraph(graphName);
        if (id == null)
            throw new IllegalArgumentException("ID not specified");

        Vertex vertex = graphContext.getFramed().getVertex(id);
        return convertToMap(vertex, depth);
    }

    @Override
    public Map<String, Object> create(String graphName, Map<String, Object> object)
    {
        GraphContext graphContext = getGraph(graphName);
        if (object.containsKey(KEY_ID))
            throw new IllegalArgumentException("Object to be created cannot already have an ID");

        Vertex vertex = getOrCreateVertex(graphContext, object);

        graphContext.commit();

        return convertToMap(vertex, 0);
    }

    @Override
    public Map<String, Object> update(String graphName, Integer id, Map<String, Object> object)
    {
        GraphContext graphContext = getGraph(graphName);
        if (id == null)
            throw new IllegalArgumentException("ID not specified");

        object.put(KEY_ID, id);
        Vertex vertex = getOrCreateVertex(graphContext, object);

        graphContext.commit();
        return convertToMap(vertex, 0);
    }

    @Override
    public void delete(String graphName, Integer id)
    {
        GraphContext graphContext = getGraph(graphName);

        if (id == null)
            throw new IllegalArgumentException("ID not specified");

        graphContext.getFramed().getVertex(id).remove();
        graphContext.commit();
    }

    private Map<String, Object> convertToMap(Vertex vertex, Integer depth)
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

    private Vertex getOrCreateVertex(GraphContext graphContext, Map<String, Object> object)
    {
        Integer id = (Integer)object.get(KEY_ID);

        final Vertex vertex;
        if (id == null)
            vertex = graphContext.getFramed().addVertex(null);
        else
            vertex = graphContext.getFramed().getVertex(id);

        for (Map.Entry<String, Object> entry : object.entrySet())
        {
            Object value = entry.getValue();
            if (value instanceof Map)
            {
                linkEdges(graphContext, vertex, entry.getKey(), (Map<String, Object>)value);
            } else
            {
                vertex.setProperty(entry.getKey(), entry.getValue());
            }
        }
        return vertex;
    }

    private void linkEdges(GraphContext graphContext, Vertex vertex, String label, Map<String, Object> edgeData)
    {
        Direction direction = Direction.valueOf((String)edgeData.get(DIRECTION));
        if (direction == null)
            return;

        for (Edge edge : vertex.getEdges(direction, label))
        {
            // remove the old edges
            edge.remove();
        }

        for (Map<String, Object> relatedVertexData : (List<Map<String, Object>>)edgeData.get(VERTICES))
        {
            Vertex relatedVertex = getOrCreateVertex(graphContext, relatedVertexData);
            if (direction == Direction.OUT)
            {
                vertex.addEdge(label, relatedVertex);
            } else if (direction == Direction.IN)
            {
                relatedVertex.addEdge(label, vertex);
            } else
            {
                throw new IllegalArgumentException("Currently not supported: " + direction);
            }
        }
    }

    private void addEdges(Map<String, Object> result, Vertex vertex, Integer remainingDepth, Direction direction)
    {
        if (remainingDepth == 0)
            return;

        final Direction opposite = direction == Direction.OUT ? Direction.IN : Direction.OUT;

        for (Edge edge : vertex.getEdges(direction))
        {
            String label = edge.getLabel();

            @SuppressWarnings("unchecked")
            Map<String, Object> edgeDetails = (Map<String, Object>)result.get(label);
            final List<Map<String, Object>> linkedVertices;
            if (edgeDetails == null)
            {
                edgeDetails = new HashMap<>();
                edgeDetails.put(DIRECTION, direction.toString());
                linkedVertices = new ArrayList<>();
                edgeDetails.put(VERTICES, linkedVertices);
                result.put(label, edgeDetails);
            } else
            {
                linkedVertices = (List<Map<String, Object>>)edgeDetails.get(VERTICES);
            }

            Vertex otherVertex = edge.getVertex(opposite);
            Map<String, Object> otherVertexMap = convertToMap(otherVertex, remainingDepth - 1);
            linkedVertices.add(otherVertexMap);
        }
    }

    private GraphContext getGraph(String graphName)
    {
        if (!StringUtils.equals(GLOBAL_GRAPH, graphName))
            throw new IllegalArgumentException("Unrecognized graph name: " + graphName);
        else
            return servicesProducer.getGlobalGraphContext();
    }
}
