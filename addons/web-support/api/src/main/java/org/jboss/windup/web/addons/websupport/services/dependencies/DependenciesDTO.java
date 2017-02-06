package org.jboss.windup.web.addons.websupport.services.dependencies;

import java.util.Collection;
import java.util.HashSet;
import java.util.Set;

/**
 * DTO object for dependencies
 *
 * @author <a href="mailto:dklingenberg@gmail.com">David Klingenberg</a>
 */
public class DependenciesDTO
{
    private Set<GraphEdge> edges;
    private Set<GraphNode> nodes;

    public DependenciesDTO()
    {
        this.edges = new HashSet<>();
        this.nodes = new HashSet<>();
    }

    public DependenciesDTO(Collection<GraphNode> nodes, Collection<GraphEdge> edges)
    {
        this.edges = new HashSet<>(edges);
        this.nodes = new HashSet<>(nodes);
    }

    public Set<GraphEdge> getEdges()
    {
        return edges;
    }

    public void setEdges(Set<GraphEdge> edges)
    {
        this.edges = edges;
    }

    public void addEdge(GraphEdge edge)
    {
        this.edges.add(edge);
    }

    public Set<GraphNode> getNodes()
    {
        return nodes;
    }

    public void setNodes(Set<GraphNode> nodes)
    {
        this.nodes = nodes;
    }

    public void addNode(GraphNode node)
    {
        this.nodes.add(node);
    }
}
