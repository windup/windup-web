package org.jboss.windup.web.addons.websupport.rest.graph;

import java.io.IOException;
import java.util.List;
import java.util.Map;

import javax.inject.Singleton;
import javax.ws.rs.NotFoundException;

import org.apache.commons.io.IOUtils;
import org.jboss.windup.graph.GraphContext;
import org.jboss.windup.graph.model.resource.FileModel;
import org.jboss.windup.graph.model.resource.SourceFileModel;
import org.jboss.windup.graph.service.FileService;

/**
 * @author <a href="mailto:jesse.sightler@gmail.com">Jesse Sightler</a>
 */
@Singleton
public class FileModelResourceImpl extends AbstractGraphResource implements FileModelResource
{
    @Override
    public List<Map<String, Object>> get(Long executionID, String filename)
    {
        GraphContext context = getGraph(executionID);
        FileService fileService = new FileService(context);
        Iterable<FileModel> models = fileService.findByFilenameRegex(filename);
        return frameIterableToResult(executionID, models, 1);
    }

    @Override
    public String getSource(Long executionID, Integer vertexID)
    {
        try
        {
            GraphContext context = getGraph(executionID);
            FileService fileService = new FileService(context);
            FileModel fileModel = fileService.getById(vertexID);

            if (fileModel == null)
                throw new NotFoundException("FileModel at " + vertexID + " could not be found!");

            if (!(fileModel instanceof SourceFileModel))
                throw new IllegalArgumentException("File " + fileModel.getFileName() + " does not appear to be source code!");

            return IOUtils.toString(fileModel.asInputStream());
        }
        catch (IOException e)
        {
            throw new RuntimeException("Failed to load source due to: " + e.getMessage());
        }
    }
}
