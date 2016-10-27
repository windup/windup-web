package org.jboss.windup.web.addons.websupport.rest.graph;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import com.tinkerpop.blueprints.Direction;
import com.tinkerpop.blueprints.Query;
import org.jboss.windup.graph.GraphContext;
import org.jboss.windup.graph.model.WindupVertexFrame;

import com.tinkerpop.blueprints.Vertex;

/**
 * @author <a href="mailto:jesse.sightler@gmail.com">Jesse Sightler</a>
 */
public class GraphResourceImpl extends AbstractGraphResource implements GraphResource
{
    @Override
    public List<Map<String, Object>> getEdges(Long executionID, Integer vertexID, String edgeDirection, String edgeLabel)
    {
        GraphContext graphContext = getGraph(executionID);
        if (vertexID == null)
            throw new IllegalArgumentException("ID not specified");

        Vertex vertex = graphContext.getFramed().getVertex(vertexID);

        List<Map<String, Object>> vertices = new ArrayList<>();
        Iterable<Vertex> relatedVertices = vertex.getVertices(Direction.valueOf(edgeDirection), edgeLabel);

        for (Vertex v : relatedVertices)
        {
            vertices.add(convertToMap(executionID, v, 0));
        }
        return vertices;
    }

    @Override
    public List<Map<String, Object>> getByType(Long executionID, String vertexType, Integer depth)
    {
        GraphContext graphContext = getGraph(executionID);
        List<Map<String, Object>> vertices = new ArrayList<>();
        for (Vertex v : graphContext.getFramed().getVertices(WindupVertexFrame.TYPE_PROP, vertexType))
        {
            vertices.add(convertToMap(executionID, v, depth));
        }
        return vertices;
    }

    @Override
    public List<Map<String, Object>> getByType(Long executionID, String vertexType, String propertyName, String propertyValue, Integer depth)
    {
        GraphContext graphContext = getGraph(executionID);
        List<Map<String, Object>> vertices = new ArrayList<>();
        Query query = graphContext.getFramed().query().has(WindupVertexFrame.TYPE_PROP, vertexType).has(propertyName, propertyValue);
        for (Vertex vertex : query.vertices())
        {
            vertices.add(convertToMap(executionID, vertex, depth));
        }
        return vertices;
    }

    @Override
    public Map<String, Object> get(Long executionID, Integer id, Integer depth)
    {
        GraphContext graphContext = getGraph(executionID);
        if (id == null)
            throw new IllegalArgumentException("ID not specified");

        Vertex vertex = graphContext.getFramed().getVertex(id);
        return convertToMap(executionID, vertex, depth);
    }
}
