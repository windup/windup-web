package org.jboss.windup.web.addons.websupport.rules;

import java.util.logging.Logger;

import org.jboss.windup.config.AbstractRuleProvider;
import org.jboss.windup.config.GraphRewrite;
import org.jboss.windup.config.loader.RuleLoaderContext;
import org.jboss.windup.config.metadata.RuleMetadata;
import org.jboss.windup.config.operation.GraphOperation;
import org.jboss.windup.config.phase.FinalizePhase;
import org.jboss.windup.graph.model.ProjectModel;
import org.jboss.windup.graph.model.WindupConfigurationModel;
import org.jboss.windup.graph.service.GraphService;
import org.jboss.windup.graph.service.WindupConfigurationService;
import org.jboss.windup.graph.traversal.AllTraversalStrategy;
import org.jboss.windup.graph.traversal.OnlyOnceTraversalStrategy;
import org.jboss.windup.graph.traversal.ProjectModelTraversal;
import org.jboss.windup.graph.traversal.SharedLibsTraversalStrategy;
import org.jboss.windup.web.addons.websupport.model.PersistedProjectModelTraversalModel;
import org.jboss.windup.web.addons.websupport.model.PersistedTraversalChildFileModel;
import org.ocpsoft.rewrite.config.Configuration;
import org.ocpsoft.rewrite.config.ConfigurationBuilder;
import org.ocpsoft.rewrite.context.EvaluationContext;

/**
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
            persistTraversal(event, null, allTraversal, PersistedProjectModelTraversalModel.PersistedTraversalType.ALL);

            ProjectModelTraversal onlyOnceTraversal = new ProjectModelTraversal(projectModel, new OnlyOnceTraversalStrategy());
            persistTraversal(event, null, onlyOnceTraversal, PersistedProjectModelTraversalModel.PersistedTraversalType.ONLY_ONCE);

            ProjectModelTraversal sharedOnlyTraversal = new ProjectModelTraversal(projectModel, new SharedLibsTraversalStrategy());
            persistTraversal(event, null, sharedOnlyTraversal, PersistedProjectModelTraversalModel.PersistedTraversalType.SHARED_ONLY);
        });
    }

    private void persistTraversal(GraphRewrite event, PersistedProjectModelTraversalModel persistedTraversalParent, ProjectModelTraversal projectModelTraversal, PersistedProjectModelTraversalModel.PersistedTraversalType persistedTraversalType)
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

        projectModelTraversal.getCanonicalProject().getFileModels().forEach(childFile -> {
            PersistedTraversalChildFileModel persistedTraversalChildFileModel = persistedTraversalChildFileService.create();
            persistedTraversalChildFileModel.setFilePath(projectModelTraversal.getFilePath(childFile));
            persistedTraversalChildFileModel.setFileModel(childFile);
            persistedTraversal.addFile(persistedTraversalChildFileModel);
        });

        projectModelTraversal.getChildren().forEach(childTraversal -> {
            persistTraversal(event, persistedTraversal, childTraversal, persistedTraversalType);
        });
    }
}
