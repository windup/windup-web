package org.jboss.windup.web.addons.websupport.rest.graph;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import javax.inject.Singleton;
import javax.ws.rs.BadRequestException;
import javax.ws.rs.NotFoundException;
import javax.ws.rs.ServerErrorException;
import javax.ws.rs.core.Response;

import org.jboss.windup.graph.GraphContext;
import org.jboss.windup.graph.model.WindupVertexFrame;
import org.jboss.windup.web.addons.websupport.rest.RestUtil;

import com.thinkaurelius.titan.diskstorage.PermanentBackendException;
import com.tinkerpop.blueprints.Direction;
import com.tinkerpop.blueprints.Query;
import com.tinkerpop.blueprints.Vertex;
import java.util.Arrays;
import java.util.Collections;
import org.apache.commons.lang3.StringUtils;

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
    public List<Map<String, Object>> getByType(Long executionID, String vertexType, Integer depth, String inEdges, String outEdges)
    {
        List<String> inEdges_ = inEdges == null ? Collections.emptyList() : Arrays.asList(StringUtils.split(inEdges, ','));
        List<String> outEdges_ = outEdges == null ? Collections.emptyList() : Arrays.asList(StringUtils.split(outEdges, ','));

        GraphContext graphContext = getGraph(executionID);
        List<Map<String, Object>> vertices = new ArrayList<>();
        for (Vertex v : graphContext.getFramed().getVertices(WindupVertexFrame.TYPE_PROP, vertexType))
        {
            vertices.add(convertToMap(executionID, v, depth, outEdges_, inEdges_));
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
        if (executionID == null)
            throw new IllegalArgumentException("Execution ID not specified.");

        if (id == null)
            throw new IllegalArgumentException("Vertex ID not specified.");

        try
        {
            GraphContext graphContext = getGraph(executionID);
            Vertex vertex = graphContext.getFramed().getVertex(id);
            if (vertex == null)
            {
                final String msg = "Non-existent vertex ID " + id + " in execution " + executionID;
                final Response response = RestUtil.createErrorResponse(Response.Status.NOT_FOUND, msg);
                throw new NotFoundException(msg, response);
            }
            return convertToMap(executionID, vertex, depth);
        }
        catch (IllegalStateException ex)
        {
            String what = "no partition bits".equals(ex.getMessage()) ? "Illegal" : "Error loading";
            String msg = what + " vertex ID " + id + " in execution " + executionID + "; " + ex.getMessage();
            final String body = RestUtil.formatErrorJson(msg);
            final Response response = Response.status(Response.Status.BAD_REQUEST).entity(body).header("X-Windup-Error", msg).build();
            throw new BadRequestException(msg, response, ex);
        }
        catch (Exception ex)
        {
            String msg = "Backend database error: ";
            Throwable cause = ex;
            while (null != (cause = cause.getCause()))
                if (cause instanceof PermanentBackendException)
                    msg = "Backend database permanent error: ";
            throw new ServerErrorException(msg + ex.getMessage(), Response.Status.INTERNAL_SERVER_ERROR, ex);
        }
    }

}
