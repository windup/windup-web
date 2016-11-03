package org.jboss.windup.web.addons.websupport.rest.graph;

import java.nio.file.Path;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.tinkerpop.blueprints.Direction;
import com.tinkerpop.blueprints.Edge;
import com.tinkerpop.blueprints.Vertex;
import java.util.logging.Logger;
import java.util.stream.Collectors;
import org.jboss.windup.graph.GraphContext;
import org.jboss.windup.graph.model.WindupVertexFrame;
import org.jboss.windup.web.addons.websupport.rest.FurnaceRESTGraphAPI;
import org.jboss.windup.web.addons.websupport.rest.GraphPathLookup;

import javax.inject.Inject;
import javax.ws.rs.NotFoundException;
import javax.ws.rs.core.UriInfo;
import javax.persistence.TypedQuery;
import org.jboss.windup.util.Logging;

/**
 * @author <a href="mailto:jesse.sightler@gmail.com">Jesse Sightler</a>
 * @author <a href="mailto:zizka@seznam.cz">Ondrej Zizka</a>
 */
public abstract class AbstractGraphResource implements FurnaceRESTGraphAPI
{
    private static final Logger LOG = Logging.get(AbstractGraphResource.class);

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

    private String getLink(long executionID, Vertex vertex, String direction, String label)
    {
        String params = String.format("/%s/edges/%s/%s/%s", executionID, vertex.getId(), direction, label);
        return uri.getBaseUri() + GraphResource.GRAPH_RESOURCE_URL + params;
    }

    /**
     * Stores given vertex as a Map, putting properties/values as keys/values of the Map.
     */
    protected Map<String, Object> convertToMap(long executionID, Vertex vertex, Integer depth)
    {
        if (depth == null)
            depth = 0;

        Map<String, Object> result = new HashMap<>();

        result.put(GraphResource.TYPE, GraphResource.TYPE_VERTEX);
        for (String key : vertex.getPropertyKeys())
        {
            result.put(key, vertex.getProperty(key));
        }
        result.put(GraphResource.KEY_ID, vertex.getId());

        Map<String, Object> outVertices = new HashMap<>();
        result.put(GraphResource.VERTICES_OUT, outVertices);
        addEdges(executionID, outVertices, vertex, depth, Direction.OUT);
        Map<String, Object> inVertices = new HashMap<>();
        result.put(GraphResource.VERTICES_IN, inVertices);
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
                edgeDetails.put(GraphResource.DIRECTION, direction.toString());
                result.put(label, edgeDetails);

                // If we aren't serializing any further, then just provide a link
                if (remainingDepth == null || remainingDepth == 0)
                {
                    edgeDetails.put(GraphResource.TYPE, GraphResource.TYPE_LINK);
                    String linkUri = getLink(executionID, vertex, direction.toString(), label);
                    edgeDetails.put(GraphResource.LINK, linkUri);
                    return;
                }

                linkedVertices = new ArrayList<>();
                edgeDetails.put(GraphResource.VERTICES, linkedVertices);
            }
            else
            {
                linkedVertices = (List<Map<String, Object>>) edgeDetails.get(GraphResource.VERTICES);
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

    /**
     * Opens a graph for given execution.
     */
    protected GraphContext getGraphContext(Long executionID)
    {
        WindupExecution execution;
        if (executionID == null || executionID == 0)
            execution = getAnyExecution(); // Development purposes.
        else
            execution = entityManager.find(WindupExecution.class, executionID);
        if (null == execution) {
            String availExecs = getExecutions().stream().map(we -> "" + we.getId()).collect(Collectors.joining(" "));
            throw new IllegalArgumentException("Windup execution not found, ID: " + executionID + "\n    Existing: [" + availExecs + "]");
        }
        return getGraphForExecution(execution);
    }

    /**
     * Dev/test purposes.
     */
    protected WindupExecution getAnyExecution() throws IllegalStateException {
        List<WindupExecution> executions = getExecutions();
        if (executions.isEmpty())
            throw new IllegalStateException("No executions found.");
        return executions.get(0);
    }


    protected GraphContext getGraphForExecution(WindupExecution execution) throws IllegalStateException {
        try
        {
            Path graphPath = Paths.get(execution.getGroup().getOutputPath()).resolve(GraphContextFactory.DEFAULT_GRAPH_SUBDIRECTORY);
            LOG.info("Opening graph at: " + graphPath);

            ///GraphContextFactory graphContextFactory = servicesProducer.getGraphContextFactory();
            ///return graphContextFactory.load(graphPath);
            return graphCache.getGraph(graphPath);
        }
        catch (Exception ex)
        {
            throw new IllegalStateException("Can't load graph for execution " + execution.getId() + ":\n\t" + ex.getMessage(), ex);
        }
    }

    protected List<WindupExecution> getExecutions()
    {
        TypedQuery<WindupExecution> queryExecutions = entityManager.createQuery("FROM WindupExecution AS ex", WindupExecution.class);
        return queryExecutions.getResultList();
    }
}
