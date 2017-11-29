package org.jboss.windup.web.addons.websupport.services;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.logging.Logger;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

import org.jboss.windup.graph.GraphContext;
import org.jboss.windup.graph.model.resource.FileModel;
import org.jboss.windup.graph.service.WindupConfigurationService;
import org.jboss.windup.web.addons.websupport.rest.graph.AbstractGraphResource;

/**
 * @author <a href="mailto:dklingenberg@gmail.com">David Klingenberg</a>
 */
public class ProjectLoaderServiceImpl extends AbstractGraphResource implements ProjectLoaderService
{
    @Override
    public Iterable<FileModel> getTopLevelProjects(Long executionId)
    {
        GraphContext graphContext = this.getGraph(executionId);

        Iterable<FileModel> inputPaths = WindupConfigurationService.getConfigurationModel(graphContext).getInputPaths();

        Set<Object> rootProjectModels = StreamSupport.stream(inputPaths.spliterator(), false)
                    .map(FileModel::getProjectModel)
                    .collect(Collectors.toSet());

        List<Map<String, String>> hashmapsCollection = new ArrayList<>();

        for (FileModel fileModel : inputPaths)
        {
            Map<String, String> fileModelMap = new HashMap<>();

            fileModelMap.put("fileName", fileModel.getFileName());
        }

        return inputPaths;
    }
}
