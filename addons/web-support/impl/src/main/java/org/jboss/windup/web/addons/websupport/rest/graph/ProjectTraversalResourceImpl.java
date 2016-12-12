package org.jboss.windup.web.addons.websupport.rest.graph;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.jboss.windup.graph.GraphContext;
import org.jboss.windup.graph.model.OrganizationModel;
import org.jboss.windup.graph.model.ProjectModel;
import org.jboss.windup.web.addons.websupport.model.PersistedProjectModelTraversalModel;
import org.jboss.windup.web.addons.websupport.model.PersistedTraversalChildFileModel;
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

        Iterable<PersistedProjectModelTraversalModel> persistedTraversals = persistedTraversalService.getRootTraversalsByType(persistedTraversalType);
        List<Map<String, Object>> result = new ArrayList<>();

        List<String> whiteListedOutLabels = new ArrayList<>();
        whiteListedOutLabels.add(PersistedProjectModelTraversalModel.CHILD);
        whiteListedOutLabels.add(PersistedProjectModelTraversalModel.CANONICAL_PROJECT);
        whiteListedOutLabels.add(PersistedProjectModelTraversalModel.CURRENT_PROJECT);
        whiteListedOutLabels.add(PersistedProjectModelTraversalModel.FILES);
        whiteListedOutLabels.add(PersistedProjectModelTraversalModel.APPLICATION_MESSAGES);
        whiteListedOutLabels.add(PersistedTraversalChildFileModel.CLASSIFICATIONS);
        whiteListedOutLabels.add(PersistedTraversalChildFileModel.FILE_MODEL);
        whiteListedOutLabels.add(PersistedTraversalChildFileModel.HINTS);
        whiteListedOutLabels.add(PersistedTraversalChildFileModel.TECHNOLOGYTAGS);
        whiteListedOutLabels.add(ProjectModel.ROOT_FILE_MODEL);

        List<String> whiteListedInLabels = new ArrayList<>();
        whiteListedInLabels.add(OrganizationModel.ARCHIVE_MODEL);

        for (PersistedProjectModelTraversalModel persistedTraversal : persistedTraversals)
        {
            result.add(super.convertToMap(executionID, persistedTraversal.asVertex(), 0, whiteListedOutLabels, whiteListedInLabels));
        }

        return result;
    }
}
