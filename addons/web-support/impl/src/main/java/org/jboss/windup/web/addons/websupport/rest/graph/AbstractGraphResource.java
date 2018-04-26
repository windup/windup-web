package org.jboss.windup.web.addons.websupport.rest.graph;

import java.nio.file.Path;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Set;

import javax.inject.Inject;
import javax.ws.rs.NotFoundException;
import javax.ws.rs.core.UriInfo;

import org.apache.tinkerpop.gremlin.structure.Direction;
import org.apache.tinkerpop.gremlin.structure.Edge;
import org.apache.tinkerpop.gremlin.structure.Vertex;
import org.apache.tinkerpop.gremlin.structure.VertexProperty;
import org.jboss.windup.graph.GraphContext;
import org.jboss.windup.graph.model.BelongsToProject;
import org.jboss.windup.graph.model.ProjectModel;
import org.jboss.windup.graph.model.WindupFrame;
import org.jboss.windup.graph.model.WindupVertexFrame;
import org.jboss.windup.graph.service.GraphService;
import org.jboss.windup.graph.service.ProjectService;
import org.jboss.windup.web.addons.websupport.model.ReportFilterDTO;
import org.jboss.windup.web.addons.websupport.rest.FurnaceRESTGraphAPI;
import org.jboss.windup.web.addons.websupport.rest.GraphPathLookup;
import org.jboss.windup.web.addons.websupport.services.ReportFilterService;

import java.util.HashSet;
import java.util.stream.Collectors;

import org.jboss.windup.graph.GraphTypeManager;

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

    @Inject
    private GraphTypeManager graphTypeManager;

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
        String params = String.format("/%s/edges/%s/%s/%s", executionID, vertex.id(), direction, label);
        return uri.getBaseUri() + GraphResource.GRAPH_RESOURCE_URL + params;
    }

    protected Map<String, Object> convertToMap(long executionID, Vertex vertex, Integer depth, boolean dedup)
    {
        return convertToMap(executionID, vertex, depth, dedup, Collections.emptyList(), Collections.emptyList(), Collections.emptyList());
    }

    protected Map<String, Object> convertToMap(long executionID, Vertex vertex, Integer depth, boolean dedup, List<String> whitelistedOutEdges, List<String> whitelistedInLabels, List<String> blackListProperties)
    {
        return convertToMap(new GraphMarshallingContext(executionID, vertex, depth, dedup, whitelistedOutEdges, whitelistedInLabels, blackListProperties, true), vertex);
    }

    protected Map<String, Object> convertToMap(GraphMarshallingContext ctx, Vertex vertex)
    {
        Map<String, Object> result = new HashMap<>();

        result.put(GraphResource.TYPE, GraphResource.TYPE_VERTEX);
        result.put(GraphResource.KEY_ID, vertex.id());

        // Spare CPU cycles, save the planet. Visited vertices will only contain _id.
        if (ctx.deduplicateVertices && !ctx.addVisited(vertex))
            return result;

        for (String key : vertex.keys()) {
            if (ctx.blacklistProperties.contains(key))
                continue;

            if (WindupFrame.TYPE_PROP.equals(key))
            {
                List<String> types = new ArrayList<>();
                Iterator<VertexProperty<String>> typeProperties = vertex.properties(key);
                while (typeProperties.hasNext())
                {
                    types.add(typeProperties.next().value());
                }
                result.put(key, types);
            } else
            {
                result.put(key, vertex.property(key).orElse(null));
            }
        }


        Map<String, Object> outVertices = new HashMap<>();
        result.put(GraphResource.VERTICES_OUT, outVertices);
        addEdges(ctx, vertex, Direction.OUT, outVertices);

        if (ctx.includeInVertices) {
            Map<String, Object> inVertices = new HashMap<>();
            result.put(GraphResource.VERTICES_IN, inVertices);
            addEdges(ctx, vertex, Direction.IN, inVertices);
        }

        return result;
    }

    private boolean isWhitelistedEdge(List<String> whitelistedOutEdges, List<String> whitelistedInEdges, Direction direction, String label)
    {
        return (direction == Direction.OUT && whitelistedOutEdges.contains(label)) ||
                (direction == Direction.IN && whitelistedInEdges.contains(label));
    }

    @SuppressWarnings("unchecked")
    private void addEdges(GraphMarshallingContext ctx, Vertex vertex, Direction direction, Map<String, Object> result)
    {
        List<String> whitelistedLabels = direction == Direction.OUT ? ctx.whitelistedOutEdges : ctx.whitelistedInEdges;

        Iterator<Edge> edges;
        if (whitelistedLabels == null || whitelistedLabels.isEmpty())
            edges = vertex.edges(direction);
        else
            edges = vertex.edges(direction, whitelistedLabels.toArray(new String[whitelistedLabels.size()]));

        while (edges.hasNext())
        {
            Edge edge = edges.next();
            String label = edge.label();

            Map<String, Object> edgeDetails = (Map<String, Object>) result.get(label);
            // If the details are already there and we aren't recursing any further, then just skip
            if (!whitelistedLabels.contains(label) && edgeDetails != null && ctx.remainingDepth <= 0)
                continue;

            final List<Map<String, Object>> linkedVertices;
            if (edgeDetails == null)
            {
                edgeDetails = new HashMap<>();
                edgeDetails.put(GraphResource.DIRECTION, direction.toString());
                result.put(label, edgeDetails);

                // If we aren't serializing any further, then just provide a link
                if (!whitelistedLabels.contains(label) && ctx.remainingDepth <= 0)
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

            Vertex otherVertex = direction == Direction.OUT ? edge.inVertex() : edge.outVertex();

            // Recursion
            ctx.remainingDepth--;
            Map<String, Object> otherVertexMap = convertToMap(ctx, otherVertex);
            ctx.remainingDepth++;

            // Add edge properties if any
            if (!edge.keys().isEmpty())
            {
                Map<String, Object> edgeData = new HashMap<>();
                edge.keys().forEach(key -> edgeData.put(key, edge.property(key).orElse(null)));
                otherVertexMap.put(GraphResource.EDGE_DATA, edgeData);

                /// Add the edge frame's @TypeValue.  Workaround until PR #1063.
                //edgeData.put(WindupFrame.TYPE_PROP, graphTypeManager.resolveTypes(edge, WindupEdgeFrame.class));
            }

            linkedVertices.add(otherVertexMap);
        }
    }

    protected List<Map<String, Object>> frameIterableToResult(long executionID, Iterable<? extends WindupVertexFrame> frames, int depth)
    {
        GraphMarshallingContext ctx = new GraphMarshallingContext(executionID, null, depth, false, Collections.emptyList(), Collections.emptyList(), Collections.emptyList(), true);

        List<Map<String, Object>> result = new ArrayList<>();
        for (WindupVertexFrame frame : frames)
        {
            result.add(convertToMap(ctx, frame.getElement()));
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

    protected Set<ProjectModel> getProjectModels(GraphContext graphContext, ReportFilterDTO filter)
    {
        ProjectService projectService = new ProjectService(graphContext);

        if (filter == null || !filter.isEnabled())
            return projectService.getRootProjectModels();

        if (filter.getSelectedApplicationPaths().isEmpty())
            return null;

        return projectService.getFilteredProjectModels(filter.getSelectedApplicationPaths());
    }

    protected <T extends WindupVertexFrame & BelongsToProject> Object getGraphData(Long executionID,
                                                                                   Map<String, Object> filterAsMap,
                                                                                   Class<T> aClass,
                                                                                   List<String> whitelistedEdges)
    {
        GraphContext graphContext = this.getGraph(executionID);

        ReportFilterDTO filter = this.reportFilterService.getReportFilterFromMap(filterAsMap);
        Set<ProjectModel> projectModels = this.getProjectModels(graphContext, filter);

        GraphService<T> graphService = new GraphService<>(graphContext, aClass);
        Iterable<T> hibernateEntities = graphService.findAll();

        List<T> filteredEntities = new ArrayList<>();

        for (T entity : hibernateEntities)
        {
            if (projectModels == null)
            {
                filteredEntities.add(entity);
            }
            else
            {
                for (ProjectModel projectModel : projectModels)
                {
                    if (entity.belongsToProject(projectModel))
                    {
                        filteredEntities.add(entity);
                    }
                }
            }
        }

        return filteredEntities.stream().map(entity -> this.convertToMap(
                    executionID,
                    entity.getElement(),
                    1,
                    false,
                    whitelistedEdges,
                    new ArrayList<String>(),
                    null)).collect(Collectors.toList());
    }
}


/**
 * Keeps the context of a marshalling of a single data tree.
 */
class GraphMarshallingContext
{
    final long executionID;
    final Vertex startVertex;
    int remainingDepth;
    final List<String> whitelistedOutEdges;
    final List<String> whitelistedInEdges;
    final List<String> blacklistProperties;

    final Set<Long> visitedVertices = new HashSet<>();
    final boolean deduplicateVertices;
    final boolean includeInVertices;

    public GraphMarshallingContext(
            long executionID,
            Vertex startVertex,
            Integer depth,
            boolean dedup,
            List<String> whitelistedOutEdges,
            List<String> whitelistedInLabels,
            List<String> blacklistProperties,
            boolean includeInVertices
    ) {
        this.executionID = executionID;
        this.startVertex = startVertex;
        this.remainingDepth = depth == null ? 0 : depth;
        this.deduplicateVertices = dedup;
        this.whitelistedOutEdges = whitelistedOutEdges == null ? Collections.emptyList() : whitelistedOutEdges;
        this.whitelistedInEdges = whitelistedInLabels == null ? Collections.emptyList() : whitelistedInLabels;
        this.blacklistProperties = blacklistProperties == null ? Collections.emptyList() : blacklistProperties;
        this.includeInVertices = includeInVertices;
    }


    /**
     * @return False if the given vertex was already visited before.
     */
    boolean addVisited(Vertex v)
    {
        return this.visitedVertices.add(((Number)v.id()).longValue());
    }

    boolean wasVisited(Vertex v)
    {
        return this.visitedVertices.contains(((Number)v.id()).longValue());
    }
}
