package org.jboss.windup.web.addons.websupport.rules;

import java.util.HashSet;
import java.util.Set;
import java.util.logging.Logger;

import org.jboss.windup.config.AbstractRuleProvider;
import org.jboss.windup.config.GraphRewrite;
import org.jboss.windup.config.loader.RuleLoaderContext;
import org.jboss.windup.config.metadata.RuleMetadata;
import org.jboss.windup.config.operation.GraphOperation;
import org.jboss.windup.config.phase.FinalizePhase;
import org.jboss.windup.graph.model.ProjectModel;
import org.jboss.windup.graph.model.WindupConfigurationModel;
import org.jboss.windup.graph.model.resource.FileModel;
import org.jboss.windup.graph.model.resource.SourceFileModel;
import org.jboss.windup.graph.service.GraphService;
import org.jboss.windup.graph.service.WindupConfigurationService;
import org.jboss.windup.graph.traversal.AllTraversalStrategy;
import org.jboss.windup.graph.traversal.OnlyOnceTraversalStrategy;
import org.jboss.windup.graph.traversal.ProjectModelTraversal;
import org.jboss.windup.graph.traversal.SharedLibsTraversalStrategy;
import org.jboss.windup.reporting.model.OverviewReportLineMessageModel;
import org.jboss.windup.reporting.service.ClassificationService;
import org.jboss.windup.reporting.service.InlineHintService;
import org.jboss.windup.reporting.service.SourceReportService;
import org.jboss.windup.reporting.service.TechnologyTagService;
import org.jboss.windup.web.addons.websupport.model.PersistedProjectModelTraversalModel;
import org.jboss.windup.web.addons.websupport.model.PersistedTraversalChildFileModel;
import org.ocpsoft.rewrite.config.Configuration;
import org.ocpsoft.rewrite.config.ConfigurationBuilder;
import org.ocpsoft.rewrite.context.EvaluationContext;

/**
 * This creates a persisted set of copies of some common {@link ProjectModelTraversal}s for use in the web interface.
 *
 * These should contain enough data to make complex pages, such as the application details page, possible.
 *
 * @author <a href="mailto:jesse.sightler@gmail.com">Jesse Sightler</a>
 */
@RuleMetadata(phase = FinalizePhase.class)
public class PersistCommonProjectTraversalsRuleProvider extends AbstractRuleProvider
{
    private static Logger LOG = Logger.getLogger(PersistCommonProjectTraversalsRuleProvider.class.getName());

    @Override
    public Configuration getConfiguration(RuleLoaderContext context)
    {
        return ConfigurationBuilder.begin()
                    .addRule()
                    .perform(new GraphOperation()
                    {
                        @Override
                        public void perform(GraphRewrite event, EvaluationContext context)
                        {
                            persistTraversals(event, context);
                        }
                    });
    }

    private void persistTraversals(GraphRewrite event, EvaluationContext context)
    {
        WindupConfigurationModel configurationModel = WindupConfigurationService.getConfigurationModel(event.getGraphContext());
        configurationModel.getInputPaths().forEach(fileModel -> {
            ProjectModel projectModel = fileModel.getProjectModel();
            if (projectModel == null)
                return;

            ProjectModelTraversal allTraversal = new ProjectModelTraversal(projectModel, new AllTraversalStrategy());
            GraphService<OverviewReportLineMessageModel> lineNotesService = new GraphService<>(event.getGraphContext(), OverviewReportLineMessageModel.class);

            PersistedProjectModelTraversalModel rootAllTraversal = persistTraversal(event, null, allTraversal, PersistedProjectModelTraversalModel.PersistedTraversalType.ALL);
            Set<ProjectModel> allProjects = allTraversal.getAllProjects(true);
            Set<String> dupeCheck = new HashSet<>();
            for (OverviewReportLineMessageModel line : lineNotesService.findAll())
            {
                if (dupeCheck.contains(line.getMessage()))
                    continue;

                if (!allProjects.contains(line.getProject()))
                    continue;

                dupeCheck.add(line.getMessage());

                rootAllTraversal.addApplicationMessages(line);
            }

            ProjectModelTraversal onlyOnceTraversal = new ProjectModelTraversal(projectModel, new OnlyOnceTraversalStrategy());
            persistTraversal(event, null, onlyOnceTraversal, PersistedProjectModelTraversalModel.PersistedTraversalType.ONLY_ONCE);

            ProjectModelTraversal sharedOnlyTraversal = new ProjectModelTraversal(projectModel, new SharedLibsTraversalStrategy());
            persistTraversal(event, null, sharedOnlyTraversal, PersistedProjectModelTraversalModel.PersistedTraversalType.SHARED_ONLY);
        });
    }

    private PersistedProjectModelTraversalModel persistTraversal(GraphRewrite event, PersistedProjectModelTraversalModel persistedTraversalParent, ProjectModelTraversal projectModelTraversal, PersistedProjectModelTraversalModel.PersistedTraversalType persistedTraversalType)
    {
        GraphService<PersistedProjectModelTraversalModel> persistedTraversalService = new GraphService<>(
                event.getGraphContext(), PersistedProjectModelTraversalModel.class);
        GraphService<PersistedTraversalChildFileModel> persistedTraversalChildFileService = new GraphService<>(
                event.getGraphContext(), PersistedTraversalChildFileModel.class);

        PersistedProjectModelTraversalModel persistedTraversal = persistedTraversalService.create();
        persistedTraversal.setTraversalType(persistedTraversalType);

        if (persistedTraversalParent == null)
        {
            persistedTraversal.setRoot(true);
        } else
        {
            persistedTraversalParent.addChild(persistedTraversal);
            persistedTraversal.setRoot(false);
        }

        persistedTraversal.setPath(projectModelTraversal.getFilePath(projectModelTraversal.getCurrent().getRootFileModel()));
        persistedTraversal.setCurrentProject(projectModelTraversal.getCurrent());
        persistedTraversal.setCanonicalProject(projectModelTraversal.getCanonicalProject());

        ClassificationService classificationService = new ClassificationService(event.getGraphContext());
        InlineHintService inlineHintService = new InlineHintService(event.getGraphContext());
        TechnologyTagService technologyTagService = new TechnologyTagService(event.getGraphContext());

        SourceReportService sourceReportService = new SourceReportService(event.getGraphContext());
        projectModelTraversal.getCanonicalProject().getFileModels().forEach(childFile -> {

            if (!isReportableFile(sourceReportService, childFile))
                return;

            PersistedTraversalChildFileModel persistedTraversalChildFileModel = persistedTraversalChildFileService.create();
            persistedTraversalChildFileModel.setFilePath(childFile.getPrettyPathWithinProject());
            persistedTraversalChildFileModel.setFileModel(childFile);
            persistedTraversal.addFile(persistedTraversalChildFileModel);

            // Add hints
            persistedTraversalChildFileModel.setHints(inlineHintService.getHintsForFile(childFile));

            // Add classifications
            persistedTraversalChildFileModel.setClassifications(classificationService.getClassifications(childFile));

            // Add technology tags
            persistedTraversalChildFileModel.setTechnologyTags(technologyTagService.findTechnologyTagsForFile(childFile));
        });

        projectModelTraversal.getChildren().forEach(childTraversal -> {
            persistTraversal(event, persistedTraversal, childTraversal, persistedTraversalType);
        });

        return persistedTraversal;
    }

    private boolean isReportableFile(SourceReportService sourceReportService, FileModel fileModel)
    {
        if (!(fileModel instanceof SourceFileModel))
            return false;

        return sourceReportService.getSourceReportForFileModel(fileModel) != null;
    }
}
