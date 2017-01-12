package org.jboss.windup.web.addons.websupport.rest.graph;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.logging.Logger;

import org.jboss.windup.graph.GraphContext;
import org.jboss.windup.graph.model.OrganizationModel;
import org.jboss.windup.graph.model.ProjectModel;
import org.jboss.windup.reporting.model.TaggableModel;
import org.jboss.windup.web.addons.websupport.model.PersistedProjectModelTraversalModel;
import org.jboss.windup.web.addons.websupport.model.PersistedTraversalChildFileModel;
import org.jboss.windup.web.addons.websupport.model.ReportFilterDTO;
import org.jboss.windup.web.addons.websupport.services.PersistedProjectModelTraversalService;

/**
 * Implements {@link ProjectTraversalResource}.
 *
 * @author <a href="mailto:jesse.sightler@gmail.com">Jesse Sightler</a>
 */
public class ProjectTraversalResourceImpl extends AbstractGraphResource implements ProjectTraversalResource
{
    private static Logger LOG = Logger.getLogger(ProjectTraversalResourceImpl.class.getName());

    @Override
    public List<Map<String, Object>> getTraversalsByType(Long executionID,
                PersistedProjectModelTraversalModel.PersistedTraversalType persistedTraversalType)
    {
        GraphContext context = getGraph(executionID);
        ReportFilterDTO filter = this.reportFilterService.getReportFilter(executionID);

        PersistedProjectModelTraversalService persistedTraversalService = new PersistedProjectModelTraversalService(context);

        Iterable<PersistedProjectModelTraversalModel> persistedTraversals = persistedTraversalService.getRootTraversalsByType(persistedTraversalType);
        List<Map<String, Object>> result = new ArrayList<>();

        /*
         * For efficiency, include as much data as we need in the initial result. This will cause the serializer to traverse across as many steps as
         * are necessary to serialize this data, regardless of the recurision depth setting.
         *
         * This is to reduce network requests when getting this data in aggregate.
         */
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
        whiteListedOutLabels.add(TaggableModel.TAG);

        List<String> whiteListedInLabels = new ArrayList<>();
        whiteListedInLabels.add(OrganizationModel.ARCHIVE_MODEL);

        for (PersistedProjectModelTraversalModel persistedTraversal : persistedTraversals)
        {
            if (!include(filter, persistedTraversal))
                continue;

            result.add(super.convertToMap(executionID, persistedTraversal.asVertex(), 0, false, whiteListedOutLabels, whiteListedInLabels));
        }

        return result;
    }

    private boolean include(ReportFilterDTO reportFilterDTO, PersistedProjectModelTraversalModel persistedTraversal)
    {
        if (reportFilterDTO == null || !reportFilterDTO.isEnabled())
            return true;

        String traversalProjectPath = persistedTraversal.getCurrentProject().getRootFileModel().getFilePath();
        return reportFilterDTO.getSelectedApplicationPaths().contains(traversalProjectPath);
    }

}
