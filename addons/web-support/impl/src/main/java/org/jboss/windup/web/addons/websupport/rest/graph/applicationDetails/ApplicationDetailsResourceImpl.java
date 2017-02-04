package org.jboss.windup.web.addons.websupport.rest.graph.applicationDetails;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.commons.lang3.StringUtils;
import org.jboss.windup.graph.GraphContext;
import org.jboss.windup.graph.model.ProjectModel;
import org.jboss.windup.graph.model.resource.FileModel;
import org.jboss.windup.reporting.model.ClassificationModel;
import org.jboss.windup.reporting.model.InlineHintModel;
import org.jboss.windup.reporting.model.OverviewReportLineMessageModel;
import org.jboss.windup.reporting.model.TechnologyTagModel;
import org.jboss.windup.rules.apps.java.model.JavaSourceFileModel;
import org.jboss.windup.rules.apps.java.model.project.MavenProjectModel;
import org.jboss.windup.rules.apps.java.scan.ast.JavaTypeReferenceModel;
import org.jboss.windup.rules.files.model.FileLocationModel;
import org.jboss.windup.web.addons.websupport.model.PersistedProjectModelTraversalModel;
import org.jboss.windup.web.addons.websupport.model.PersistedTraversalChildFileModel;
import org.jboss.windup.web.addons.websupport.model.ReportFilterDTO;
import org.jboss.windup.web.addons.websupport.rest.graph.AbstractGraphResource;
import org.jboss.windup.web.addons.websupport.services.PersistedProjectModelTraversalService;

/**
 * Implements {@link ApplicationDetailsResource}.
 *
 * @author <a href="mailto:jesse.sightler@gmail.com">Jesse Sightler</a>
 */
public class ApplicationDetailsResourceImpl extends AbstractGraphResource implements ApplicationDetailsResource
{
    @Override
    public ApplicationDetailsDTO getApplicationDetailsData(Long executionID)
    {
        PersistedProjectModelTraversalModel.PersistedTraversalType persistedTraversalType = PersistedProjectModelTraversalModel.PersistedTraversalType.ALL;

        GraphContext context = getGraph(executionID);
        ReportFilterDTO filter = this.reportFilterService.getReportFilter(executionID);

        PersistedProjectModelTraversalService persistedTraversalService = new PersistedProjectModelTraversalService(context);

        Iterable<PersistedProjectModelTraversalModel> persistedTraversals = persistedTraversalService.getRootTraversalsByType(persistedTraversalType);
        ApplicationDetailsDTO result = new ApplicationDetailsDTO();

        for (PersistedProjectModelTraversalModel traversal : persistedTraversals)
        {
            if (!include(filter, traversal))
                continue;

            serializeTraversal(result, null, traversal);
        }

        return result;
    }

    private void serializeProjectMetadata(ProjectTraversalDTO traversalDTO, PersistedProjectModelTraversalModel traversal)
    {
        ProjectModel current = traversal.getCurrentProject();
        ProjectModel canonical = traversal.getCanonicalProject();

        traversalDTO.setId(traversal.asVertex().getId());
        traversalDTO.setCurrentID(current.asVertex().getId());
        traversalDTO.setCanonicalID(canonical.asVertex().getId());

        FileModel rootFileModel = canonical.getRootFileModel();
        if (rootFileModel != null)
        {
            traversalDTO.setSha1(rootFileModel.getSHA1Hash());
        }
        traversalDTO.setName(canonical.getName());
        traversalDTO.setCanonicalFilename(rootFileModel.getFileName());
        traversalDTO.setPath(traversal.getPath());
        traversalDTO.setOrganization(canonical.getOrganization());
        traversalDTO.setUrl(canonical.getURL());

        if (canonical instanceof MavenProjectModel)
        {
            traversalDTO.setGav(((MavenProjectModel) canonical).getMavenIdentifier());
        }
    }

    private void serializeChildFiles(ApplicationDetailsDTO applicationDetails, ProjectTraversalDTO traversalDTO, PersistedProjectModelTraversalModel traversal)
    {
        StringCache strings = applicationDetails.getStringCache();
        for (PersistedTraversalChildFileModel traversalFileModel : traversal.getFiles())
        {
            FileDTO fileDTO = new FileDTO();

            FileModel fileModel = traversalFileModel.getFileModel();
            fileDTO.setFileModelVertexID(fileModel.asVertex().getId());
            fileDTO.setFilePath(traversalFileModel.getFilePath());
            if (fileModel instanceof JavaSourceFileModel)
            {
                JavaSourceFileModel javaSourceModel = (JavaSourceFileModel)fileModel;
                String packageName = javaSourceModel.getPackageName();
                String filename = javaSourceModel.getFileName();
                filename = filename.substring(0, filename.length() - 5);
                if (StringUtils.isNotBlank(packageName))
                    fileDTO.setName(packageName + "." + filename);
                else
                    fileDTO.setName(filename);
            } else
            {
                fileDTO.setName(traversalFileModel.getFilePath());
            }

            for (TechnologyTagModel tag : traversalFileModel.getTechnologyTags())
            {
                String level = tag.getLevel() == null ? null : tag.getLevel().toString();
                TagDTO tagDTO = new TagDTO(strings.getOrAdd(tag.getName()), strings.getOrAdd(level));
                fileDTO.getTags().add(tagDTO);
            }

            for (ClassificationModel classification : traversalFileModel.getClassifications())
            {
                if (applicationDetails.getClassifications().containsKey(classification.asVertex().getId()))
                    continue;

                ClassificationDTO classificationDTO = new ClassificationDTO();
                classificationDTO.setTitle(strings.getOrAdd(classification.getClassification()));
                classificationDTO.setEffort(classification.getEffort());
                for (String tag : classification.getTags())
                    classificationDTO.getTags().add(new TagDTO(strings.getOrAdd(tag), 0));

                applicationDetails.getClassifications().put(classification.asVertex().getId(), classificationDTO);
                fileDTO.getClassificationIDs().add(classification.asVertex().getId());
            }

            for (InlineHintModel hint : traversalFileModel.getHints())
            {
                if (applicationDetails.getHints().containsKey(hint.asVertex().getId()))
                    continue;

                HintDTO hintDTO = new HintDTO();
                hintDTO.setTitle(strings.getOrAdd(hint.getTitle()));
                hintDTO.setEffort(hint.getEffort());

                FileLocationModel fileLocationModel = hint.getFileLocationReference();
                if (fileLocationModel instanceof JavaTypeReferenceModel)
                    hintDTO.setJavaFQCN(strings.getOrAdd(((JavaTypeReferenceModel) fileLocationModel).getResolvedSourceSnippit()));

                for (String tag : hint.getTags())
                    hintDTO.getTags().add(new TagDTO(strings.getOrAdd(tag), 0));

                applicationDetails.getHints().put(hint.asVertex().getId(), hintDTO);
                fileDTO.getHintIDs().add(hint.asVertex().getId());
            }

            traversalDTO.getFiles().add(fileDTO);
        }
    }

    private void serializeTraversal(ApplicationDetailsDTO applicationDetails, ProjectTraversalDTO parent, PersistedProjectModelTraversalModel traversal)
    {
        ProjectTraversalDTO traversalDTO = new ProjectTraversalDTO();
        // Add it to a parent if one exists, otherwise add it to the details
        if (parent != null)
            parent.getChildren().add(traversalDTO);
        else
            applicationDetails.getTraversals().add(traversalDTO);

        serializeProjectMetadata(traversalDTO, traversal);
        serializeChildFiles(applicationDetails, traversalDTO, traversal);

        for (OverviewReportLineMessageModel applicationMessage : traversal.getApplicationMessages())
        {
            ApplicationMessageDTO messageDTO = new ApplicationMessageDTO(applicationMessage.getMessage(), applicationMessage.getRuleID());
            traversalDTO.getMessages().add(messageDTO);
        }

        for (PersistedProjectModelTraversalModel childTraversal : traversal.getChildren())
        {
            serializeTraversal(applicationDetails, traversalDTO, childTraversal);
        }
    }

    private boolean include(ReportFilterDTO reportFilterDTO, PersistedProjectModelTraversalModel persistedTraversal)
    {
        if (reportFilterDTO == null || !reportFilterDTO.isEnabled())
            return true;

        String traversalProjectPath = persistedTraversal.getCurrentProject().getRootFileModel().getFilePath();
        return reportFilterDTO.getSelectedApplicationPaths().contains(traversalProjectPath);
    }

}
