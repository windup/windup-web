package org.jboss.windup.web.addons.websupport.rest.graph;

import java.util.*;

import org.jboss.windup.graph.GraphContext;
import org.jboss.windup.graph.model.BelongsToProject;
import org.jboss.windup.graph.model.ProjectModel;
import org.jboss.windup.graph.service.GraphService;
import org.jboss.windup.rules.apps.javaee.model.*;
import org.jboss.windup.web.addons.websupport.model.ReportFilterDTO;

public class EJBResourceImpl extends AbstractGraphResource implements EJBResource
{
    @Override
    public Object getMDB(Long reportID, Map<String, Object> filterAsMap)
    {
        return this.getFilteredData(reportID, null, filterAsMap, EjbMessageDrivenModel.class);
    }

    @Override
    public Object getEJB(Long reportID, String sessionType, Map<String, Object> filterAsMap)
    {
        return this.getFilteredData(reportID, sessionType,  filterAsMap, EjbSessionBeanModel.class);
    }

    @Override
    public Object getEntity(Long reportID, Map<String, Object> filterAsMap)
    {
        return this.getFilteredData(reportID, null, filterAsMap, EjbEntityBeanModel.class);
    }

    private <T extends EjbBeanBaseModel> Object getFilteredData(Long reportID, String sessionType, Map<String, Object> filterAsMap, Class<T> clazz) {
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

        List<T> ejbMessageDrivenArrayList = new ArrayList<>();
        GraphService<T> ejbMessageDrivenModelService = new GraphService<>(graphContext, clazz);
        Iterable<T> data;
        if (sessionType != null)
        {
            data = ejbMessageDrivenModelService.findAllByProperties(new String[]{"sessionType"}, new String[]{sessionType});
        } else
        {
            data = ejbMessageDrivenModelService.findAll();
        }

        for (T mdb : data)
        {
            if (projectModels == null)
            {
                ejbMessageDrivenArrayList.add(mdb);
            }
            else
            {
                for (ProjectModel projectModel : projectModels)
                {
                    if (mdb.belongsToProject(projectModel))
                        ejbMessageDrivenArrayList.add(mdb);
                }
/*
                for (ProjectModel projectModel : mdb.getRootProjectModels())
                {
                    if (projectModels.contains(projectModel))
                    {
                        ejbMessageDrivenArrayList.add(mdb);
                        break;
                    }
                }
*/
            }
        }

        return super.frameIterableToResult(reportID, ejbMessageDrivenArrayList, 1);
    }
}
