package org.jboss.windup.web.addons.websupport.rest.graph;

import java.util.List;
import java.util.Map;

import org.jboss.windup.graph.GraphContext;
import org.jboss.windup.graph.model.resource.FileModel;
import org.jboss.windup.graph.service.FileService;
import org.jboss.windup.reporting.model.InlineHintModel;
import org.jboss.windup.reporting.service.InlineHintService;

/**
 * @author <a href="mailto:jesse.sightler@gmail.com">Jesse Sightler</a>
 */
public class HintResourceImpl extends AbstractGraphResource implements HintResource
{
    @Override
    public List<Map<String, Object>> getHints(Long executionID, Integer fileModelID)
    {
        GraphContext context = getGraph(executionID);
        FileService fileService = new FileService(context);
        FileModel fileModel = fileService.getById(fileModelID);

        InlineHintService hintService = new InlineHintService(context);
        Iterable<InlineHintModel> hintModels = hintService.getHintsForFile(fileModel);
        return super.frameIterableToResult(executionID, hintModels, 1);
    }
}
