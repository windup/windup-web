package org.jboss.windup.web.services.rest.graph;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

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
    public List<Map<String, Object>> getByType(Long executionID, String vertexType, Integer depth)
    {
        GraphContext graphContext = getGraph(executionID);
        List<Map<String, Object>> vertices = new ArrayList<>();
        for (Vertex v : graphContext.getFramed().getVertices(WindupVertexFrame.TYPE_PROP, vertexType))
        {
            vertices.add(convertToMap(v, depth));
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
            vertices.add(convertToMap(vertex, depth));
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
        return convertToMap(vertex, depth);
    }
}
