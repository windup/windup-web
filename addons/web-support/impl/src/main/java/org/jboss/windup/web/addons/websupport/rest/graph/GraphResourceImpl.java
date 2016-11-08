package org.jboss.windup.web.addons.websupport.rest.graph;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import com.tinkerpop.blueprints.Direction;
import com.tinkerpop.blueprints.Query;
import org.jboss.windup.graph.GraphContext;
import org.jboss.windup.graph.model.WindupVertexFrame;

import com.tinkerpop.blueprints.Vertex;

import javax.inject.Singleton;
import javax.ws.rs.NotFoundException;

/**
 * @author <a href="mailto:jesse.sightler@gmail.com">Jesse Sightler</a>
 * @author <a href="mailto:zizka@seznam.cz">Ondrej Zizka</a>
 */
@Singleton
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

    /*
    @Override
    public List<Map<String, Object>> getByType(String vertexType, Integer depth){
        return getByType(getAnyExecution().getId(), vertexType, depth);
    }
    */
    // TODO: Get a list of existing executions.

    @Override
    public Map<String, Object> get(Long executionID, Integer id, Integer depth)
    {
        GraphContext graphContext = getGraph(executionID);
        if (executionID == null)
            throw new IllegalArgumentException("Execution ID not specified.");
        if (id == null)
            throw new IllegalArgumentException("Vertex ID not specified.");

        Vertex vertex = graphContext.getFramed().getVertex(id);
        if (vertex == null)
            throw new NotFoundException("Non-existent vertex ID " + id + " in execution " + executionID);
        return convertToMap(executionID, vertex, depth);
    }


    @Override
    public String getTestVertex(){
        return "[{\"w:winduptype\":[\"FileResource\",\"ArchiveModel:\",\"WarArchiveModel\"],\"fileName\":\"jee-example-web.war\","
        + "\"md5Hash\":\"e71dfca0743df75c0de70bddc5a2686b\","
        + "\"unzippedDirectory\":\"/home/ondra/sw/AS/wildfly-10.1.0.Final/standalone/data/windup/reports/Default Group.briOxXRQGwdE.report/archives/jee-example-web.war\","
        + "\"filePath\":\"/home/ondra/sw/AS/wildfly-10.1.0.Final/standalone/data/windup/reports/Default Group.briOxXRQGwdE.report/archives/jee-example-app-1.0.0.ear/jee-example-web.war\",\"windupGenerated\":false,"
        + "\"ArchiveModel:archiveName\":\"jee-example-web.war\",\"sha1Hash\":\"8a72a375ca7feba49ea5cab492e52e64cee41dc6\",\"_id\":3584,\"isDirectory\":false}]"
        ;
    }
}
