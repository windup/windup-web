package org.jboss.windup.web.addons.websupport.services;

import com.tinkerpop.blueprints.Vertex;
import com.tinkerpop.frames.structures.FramedVertexIterable;
import com.tinkerpop.gremlin.java.GremlinPipeline;
import org.jboss.windup.graph.GraphContext;
import org.jboss.windup.graph.model.WindupVertexFrame;
import org.jboss.windup.graph.service.GraphService;
import org.jboss.windup.web.addons.websupport.model.PersistedProjectModelTraversalModel;

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
        GremlinPipeline<Vertex, Vertex> pipeline = new GremlinPipeline<>(getGraphContext().getGraph());

        Iterable<Vertex> vertices = (Iterable<Vertex>)pipeline.V()
                .has(WindupVertexFrame.TYPE_PROP, PersistedProjectModelTraversalModel.TYPE)
                .has(PersistedProjectModelTraversalModel.TRAVERSAL_TYPE, persistedTraversalType.toString())
                .has(PersistedProjectModelTraversalModel.ROOT, true);

        return new FramedVertexIterable<>(getGraphContext().getFramed(), vertices, PersistedProjectModelTraversalModel.class);
    }
}
