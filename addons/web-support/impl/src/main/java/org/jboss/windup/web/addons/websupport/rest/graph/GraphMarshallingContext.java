package org.jboss.windup.web.addons.websupport.rest.graph;

import com.tinkerpop.blueprints.Vertex;

import java.util.Collections;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

/**
 * Keeps the context of a marshalling of a single data tree.
 */
public class GraphMarshallingContext
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
        return this.visitedVertices.add(((Number)v.getId()).longValue());
    }

    boolean wasVisited(Vertex v)
    {
        return this.visitedVertices.contains(((Number)v.getId()).longValue());
    }
}
