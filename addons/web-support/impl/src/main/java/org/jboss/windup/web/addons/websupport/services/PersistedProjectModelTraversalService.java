package org.jboss.windup.web.addons.websupport.services;

import org.apache.tinkerpop.gremlin.process.traversal.dsl.graph.GraphTraversalSource;
import org.apache.tinkerpop.gremlin.structure.Vertex;
import org.jboss.windup.graph.GraphContext;
import org.jboss.windup.graph.frames.FramedVertexIterable;
import org.jboss.windup.graph.model.WindupVertexFrame;
import org.jboss.windup.graph.service.GraphService;
import org.jboss.windup.web.addons.websupport.model.PersistedProjectModelTraversalModel;

import java.util.List;

/**
 * @author <a href="mailto:jesse.sightler@gmail.com">Jesse Sightler</a>
 */
public class PersistedProjectModelTraversalService extends GraphService<PersistedProjectModelTraversalModel>
{
    public PersistedProjectModelTraversalService(GraphContext context)
    {
        super(context, PersistedProjectModelTraversalModel.class);
    }

    @SuppressWarnings("unchecked")
    public Iterable<PersistedProjectModelTraversalModel> getRootTraversalsByType(PersistedProjectModelTraversalModel.PersistedTraversalType persistedTraversalType)
    {
        List<Vertex> vertexList = new GraphTraversalSource(getGraphContext().getGraph()).V()
                .has(WindupVertexFrame.TYPE_PROP, PersistedProjectModelTraversalModel.TYPE)
                .has(PersistedProjectModelTraversalModel.TRAVERSAL_TYPE, persistedTraversalType.toString())
                .has(PersistedProjectModelTraversalModel.ROOT, true)
                .toList();

        return new FramedVertexIterable<>(getGraphContext().getFramed(), vertexList, PersistedProjectModelTraversalModel.class);
    }
}
