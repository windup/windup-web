package org.jboss.windup.web.addons.websupport.rest.graph;

import java.io.IOException;
import java.util.List;
import java.util.Map;

import org.jboss.windup.graph.GraphContext;
import org.jboss.windup.graph.model.resource.FileModel;
import org.jboss.windup.graph.model.resource.SourceFileModel;
import org.jboss.windup.graph.service.FileService;

/**
 * @author <a href="mailto:jesse.sightler@gmail.com">Jesse Sightler</a>
 */
public class LinkResourceImpl extends AbstractGraphResource implements LinkResource
{
    @Override
    public List<Map<String, Object>> getLinksToTransformedFiles(Long executionID, Integer fileModelID)
    {
        try (GraphContext context = getGraph(executionID))
        {
            FileService fileService = new FileService(context);
            FileModel fileModel = fileService.getById(fileModelID);

            if (!(fileModel instanceof SourceFileModel))
                throw new IllegalArgumentException("File must be of type: " + SourceFileModel.class.getSimpleName());

            SourceFileModel sourceFileModel = (SourceFileModel)fileModel;
            return super.frameIterableToResult(executionID, sourceFileModel.getLinksToTransformedFiles(), 0);
        }
        catch (IOException e)
        {
            throw new RuntimeException("Failed to load graph due to: " + e.getMessage());
        }
    }
}
