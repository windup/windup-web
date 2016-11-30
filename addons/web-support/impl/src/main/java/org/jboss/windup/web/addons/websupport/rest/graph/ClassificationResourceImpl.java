package org.jboss.windup.web.addons.websupport.rest.graph;

import org.jboss.windup.graph.GraphContext;
import org.jboss.windup.graph.model.resource.FileModel;
import org.jboss.windup.graph.service.FileService;
import org.jboss.windup.reporting.model.ClassificationModel;
import org.jboss.windup.reporting.service.ClassificationService;

import java.io.IOException;
import java.util.List;
import java.util.Map;

/**
 * @author <a href="mailto:jesse.sightler@gmail.com">Jesse Sightler</a>
 */
public class ClassificationResourceImpl extends AbstractGraphResource implements ClassificationResource
{
    @Override
    public List<Map<String, Object>> getClassifications(Long executionID, Integer fileModelID)
    {
        try (GraphContext context = getGraph(executionID))
        {
            FileService fileService = new FileService(context);
            FileModel fileModel = fileService.getById(fileModelID);

            ClassificationService classificationService = new ClassificationService(context);
            Iterable<ClassificationModel> classificationModels = classificationService.getClassifications(fileModel);
            return super.frameIterableToResult(executionID, classificationModels, 0);
        }
        catch (IOException e)
        {
            throw new RuntimeException("Failed to load graph due to: " + e.getMessage());
        }
    }
}
