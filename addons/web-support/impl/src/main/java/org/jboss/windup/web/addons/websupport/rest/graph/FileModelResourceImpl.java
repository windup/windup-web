package org.jboss.windup.web.addons.websupport.rest.graph;

import java.io.IOException;
import java.util.List;
import java.util.Map;

import org.jboss.windup.graph.GraphContext;
import org.jboss.windup.graph.model.resource.FileModel;
import org.jboss.windup.graph.service.FileService;

/**
 * @author <a href="mailto:jesse.sightler@gmail.com">Jesse Sightler</a>
 */
public class FileModelResourceImpl extends AbstractGraphResource implements FileModelResource
{
    @Override
    public List<Map<String, Object>> get(Long executionID, String filename)
    {
        try (GraphContext context = getGraph(executionID))
        {
            FileService fileService = new FileService(context);
            Iterable<FileModel> models = fileService.findByFilenameRegex(filename);
            return frameIterableToResult(executionID, models, 1);
        }
        catch (IOException e)
        {
            throw new RuntimeException("Failed to load graph due to: " + e.getMessage());
        }
    }
}
