package org.jboss.windup.web.addons.websupport.rest.graph;

import org.jboss.windup.graph.GraphContext;
import org.jboss.windup.graph.model.resource.FileModel;
import org.jboss.windup.graph.service.FileService;
import org.jboss.windup.reporting.model.TechnologyTagModel;
import org.jboss.windup.reporting.service.TechnologyTagService;

import java.util.List;
import java.util.Map;

/**
 * @author <a href="mailto:jesse.sightler@gmail.com">Jesse Sightler</a>
 */
public class TechnologyTagResourceImpl extends AbstractGraphResource implements TechnologyTagResource
{
    @Override
    public List<Map<String, Object>> getTechnologyTags(Long executionID, Integer fileModelID)
    {
        GraphContext context = getGraph(executionID);
        FileService fileService = new FileService(context);
        FileModel fileModel = fileService.getById(fileModelID);

        TechnologyTagService technologyTagService = new TechnologyTagService(context);
        Iterable<TechnologyTagModel> technologyTagModels= technologyTagService.findTechnologyTagsForFile(fileModel);
        return super.frameIterableToResult(executionID, technologyTagModels, 0);
    }
}
