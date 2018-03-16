package org.jboss.windup.web.addons.websupport.rest.graph;

import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.logging.Logger;

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
    private static Logger LOG = Logger.getLogger(FileModelResourceImpl.class.getCanonicalName());

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
            LOG.info("File loaded: " + fileModel.getElement().id() + " path: " + fileModel.getFilePath());

            if (fileModel == null)
                throw new NotFoundException("FileModel at " + vertexID + " could not be found!");

            if (!(fileModel instanceof SourceFileModel))
            {
                String message = "File " + fileModel + " does not appear to be source code!";
                throw new IllegalArgumentException(message);
            }

            return IOUtils.toString(fileModel.asInputStream());
        }
        catch (IOException e)
        {
            throw new RuntimeException("Failed to load source due to: " + e.getMessage());
        }
    }
}
