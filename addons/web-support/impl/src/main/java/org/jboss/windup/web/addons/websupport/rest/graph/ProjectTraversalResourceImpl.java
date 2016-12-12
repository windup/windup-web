package org.jboss.windup.web.addons.websupport.rest.graph;

import java.util.List;
import java.util.Map;

import org.jboss.windup.graph.GraphContext;
import org.jboss.windup.web.addons.websupport.model.PersistedProjectModelTraversalModel;
import org.jboss.windup.web.addons.websupport.services.PersistedProjectModelTraversalService;

/**
 * @author <a href="mailto:jesse.sightler@gmail.com">Jesse Sightler</a>
 */
public class ProjectTraversalResourceImpl extends AbstractGraphResource implements ProjectTraversalResource
{
    @Override
    public List<Map<String, Object>> getTraversalsByType(Long executionID,
                PersistedProjectModelTraversalModel.PersistedTraversalType persistedTraversalType)
    {
        GraphContext context = getGraph(executionID);
        PersistedProjectModelTraversalService persistedTraversalService = new PersistedProjectModelTraversalService(context);

        Iterable<PersistedProjectModelTraversalModel> framed = persistedTraversalService.getRootTraversalsByType(persistedTraversalType);
        return super.frameIterableToResult(executionID, framed, 2);
    }
}
