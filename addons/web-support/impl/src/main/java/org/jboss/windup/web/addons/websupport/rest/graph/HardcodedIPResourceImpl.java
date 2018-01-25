package org.jboss.windup.web.addons.websupport.rest.graph;

import org.jboss.windup.config.projecttraversal.ProjectTraversalCache;
import org.jboss.windup.graph.GraphContext;
import org.jboss.windup.graph.model.ProjectModel;
import org.jboss.windup.graph.model.resource.FileModel;
import org.jboss.windup.graph.service.GraphService;
import org.jboss.windup.rules.apps.java.ip.HardcodedIPLocationModel;
import org.jboss.windup.rules.apps.java.model.JavaClassFileModel;
import org.jboss.windup.rules.apps.java.model.JavaSourceFileModel;
import org.jboss.windup.web.addons.websupport.model.ReportFilterDTO;

import java.util.ArrayList;
import java.util.Collections;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

/**
 * @author <a href="mailto:jesse.sightler@gmail.com">Jesse Sightler</a>
 */
public class HardcodedIPResourceImpl extends AbstractGraphResource implements HardcodedIPResource
{
    @Override
    public Object get(Long reportID, Map<String, Object> filterAsMap)
    {
        GraphContext graphContext = this.getGraph(reportID);

        ReportFilterDTO filter = this.reportFilterService.getReportFilterFromMap(filterAsMap);
        Set<String> includeTags = new HashSet<>();
        Set<String> excludeTags = new HashSet<>();
        Set<ProjectModel> projectModels = null;

        if (filter.isEnabled())
        {
            includeTags.addAll(filter.getIncludeTags());
            excludeTags.addAll(filter.getExcludeTags());
            projectModels = this.getProjectModels(graphContext, filter);
        }

        List<Map<String, Object>> result = new ArrayList<>();

        List<String> whitelistEdges = new ArrayList<>();
        whitelistEdges.add(HardcodedIPLocationModel.FILE_MODEL);
        whitelistEdges.add(JavaSourceFileModel.JAVA_CLASS_MODEL);

        GraphService<HardcodedIPLocationModel> ipLocationModelService = new GraphService<>(graphContext, HardcodedIPLocationModel.class);
        // find all IPLocationModels
        for (HardcodedIPLocationModel location : ipLocationModelService.findAll())
        {
            String path = location.getFile().getPrettyPathWithinProject();

            if (projectModels != null && !projectModels.contains(location.getFile().getProjectModel()))
                continue;

            Map<String, Object> serializedObject = super.convertToMap(reportID, location.getElement(), 1, true, whitelistEdges, Collections.emptyList(), Collections.emptyList());
            serializedObject.put("prettyPathWithinProject", path);
            result.add(serializedObject);
        }

        return result;
    }
}
