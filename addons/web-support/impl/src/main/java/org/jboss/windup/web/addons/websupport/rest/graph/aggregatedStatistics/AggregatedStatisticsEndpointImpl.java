package org.jboss.windup.web.addons.websupport.rest.graph.aggregatedStatistics;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.logging.Logger;

import javax.inject.Inject;

import org.jboss.windup.graph.GraphContext;
import org.jboss.windup.graph.model.ProjectModel;
import org.jboss.windup.reporting.category.IssueCategoryModel;
import org.jboss.windup.reporting.freemarker.problemsummary.ProblemSummary;
import org.jboss.windup.reporting.freemarker.problemsummary.ProblemSummaryService;
import org.jboss.windup.reporting.service.EffortReportService.EffortLevel;
import org.jboss.windup.rules.apps.java.service.TypeReferenceService;
import org.jboss.windup.web.addons.websupport.model.ReportFilterDTO;
import org.jboss.windup.web.addons.websupport.rest.graph.AbstractGraphResource;
import org.jboss.windup.web.addons.websupport.services.dependencies.DependenciesDTO;
import org.jboss.windup.web.addons.websupport.services.dependencies.GraphNode;
import org.jboss.windup.web.addons.websupport.services.dependencies.LibraryDependenciesService;

/**
 * @author <a href="mailto:hotmana76@gmail.com">Marek Novotny</a>
 */
public class AggregatedStatisticsEndpointImpl extends AbstractGraphResource implements AggregatedStatisticsEndpoint
{
    private static final Logger LOG = Logger.getLogger(AggregatedStatisticsEndpointImpl.class.getSimpleName());

    @Inject
    private LibraryDependenciesService libraryDependenciesService;

    /**
     * This counts incidents for every category issue type
     */
    @Override
    public EffortByCategoryDTO getAggregatedCategories(Long executionId)
    {
        GraphContext graphContext = this.getGraph(executionId);

        Set<String> includeTags = new HashSet<>();
        Set<String> excludeTags = new HashSet<>();
        Set<ProjectModel> projectModels = null;

        ReportFilterDTO filter = this.reportFilterService.getReportFilter(executionId);

        if (filter.isEnabled())
        {
            includeTags.addAll(filter.getIncludeTags());
            excludeTags.addAll(filter.getExcludeTags());
            projectModels = this.getProjectModels(graphContext, filter);
        }

        Map<IssueCategoryModel, List<ProblemSummary>> issues = ProblemSummaryService.getProblemSummaries(
                    graphContext,
                    projectModels,
                    includeTags,
                    excludeTags,
                    true,
                    false);

        return getIncidentsByEffort(issues);
    }

    /**
     * Get details from problems categorized by EffortLevel and # of incidents
     *
     * @param problems all found problems
     * @return
     */
    private EffortByCategoryDTO getIncidentsByEffort(Map<IssueCategoryModel, List<ProblemSummary>> problems)
    {
        EffortByCategoryDTO result = new EffortByCategoryDTO();

        Map<String, Integer> categoryIDToPriority = new HashMap<>();
        problems.forEach((issueCategory, problemSummaries) -> {
            categoryIDToPriority.put(issueCategory.getCategoryID(), issueCategory.getPriority());

            EffortCategoryDTO categoryDTO = new EffortCategoryDTO();
            categoryDTO.setCategoryID(issueCategory.getCategoryID());

            for (ProblemSummary problemSummary : problemSummaries)
            {
                EffortLevel effort = EffortLevel.forPoints(problemSummary.getEffortPerIncident());
                categoryDTO.addValue(effort.getShortDescription(), problemSummary.getNumberFound());
            }
            result.addCategory(categoryDTO);
        });

        result.categories.sort((category1, category2) -> {
            int priority1 = categoryIDToPriority.get(category1.getCategoryID());
            int priority2 = categoryIDToPriority.get(category2.getCategoryID());
            return priority1 - priority2;
        });

        return result;
    }

    /**
     * This counts incidents for every identified Java package
     *
     */
    @Override
    public StatisticsList getJavaPackageStatistics(Long executionId)
    {
        GraphContext graphContext = this.getGraph(executionId);

        Set<String> includeTags = new HashSet<>();
        Set<String> excludeTags = new HashSet<>();
        Set<ProjectModel> projectModels;

        ReportFilterDTO filter = this.reportFilterService.getReportFilter(executionId);

        projectModels = this.getProjectModels(graphContext, filter);
        if (filter.isEnabled())
        {
            includeTags.addAll(filter.getIncludeTags());
            excludeTags.addAll(filter.getExcludeTags());
        }

        TypeReferenceService typeReferenceService = new TypeReferenceService(graphContext);

        StatisticsList packageStatisticsDTO = new StatisticsList();
        for (Iterator<ProjectModel> iterator = projectModels.iterator(); iterator.hasNext();)
        {
            ProjectModel projectModel = iterator.next();
            typeReferenceService
                    .getPackageUseFrequencies(projectModel, includeTags, excludeTags, 2, true)
                    .entrySet()
                    .forEach(entry -> {
                        packageStatisticsDTO.addValue(entry.getKey(), entry.getValue());
                    });
        }

        packageStatisticsDTO.sortByValue();
        return packageStatisticsDTO;
    }

    @Override
    public StatisticsList getArchivesStatistics(Long executionId)
    {
        GraphContext graphContext = this.getGraph(executionId);

        Set<String> includeTags = new HashSet<>();
        Set<String> excludeTags = new HashSet<>();

        ReportFilterDTO filter = this.reportFilterService.getReportFilter(executionId);

        // Set<ProjectModel> projectModels = this.getProjectModels(graphContext, filter);
        if (filter.isEnabled())
        {
            includeTags.addAll(filter.getIncludeTags());
            excludeTags.addAll(filter.getExcludeTags());
        }

        this.libraryDependenciesService.setGraphContext(graphContext);
        DependenciesDTO dependenciesDTO = this.libraryDependenciesService.getDependencies();

        // will use only nodes data not edges
        Set<GraphNode> depsGraphNodes = dependenciesDTO.getNodes();

        //
        Map<String, List<String>> depsDetailsMap = new HashMap<>();
        for (GraphNode node : depsGraphNodes)
        {
            String type = node.getType();

            // Extract only file type extension (jar, ear, war etc.)
            Object data = node.getData();
            List<String> deps = new ArrayList<>();
            if (data instanceof Map)
            {
                Map<String, Object> dataMap = (Map<String, Object>) data;
                String filename;
                String fileExtension = null;
                if (dataMap.containsKey(LibraryDependenciesService.KEY_FILE_NAME))
                {
                    filename = (String) dataMap.get(LibraryDependenciesService.KEY_FILE_NAME);
                    if (filename.lastIndexOf('.') > 0)
                    {
                        fileExtension = filename.substring(filename.lastIndexOf('.') + 1);
                    }
                }

                deps = depsDetailsMap.getOrDefault(type, deps);
                if (fileExtension != null)
                {
                    deps.add(fileExtension);
                }
            }

            depsDetailsMap.put(type, deps);
        }

        StatisticsList extensionStats = new StatisticsList();
        for (Map.Entry<String, List<String>> dependency : depsDetailsMap.entrySet())
        {
            List<String> extensions = dependency.getValue();
            for (String extension : extensions)
            {
                extensionStats.addValue(extension, 1);
            }
        }
        extensionStats.sortByKey();
        return extensionStats;
    }

    @Override
    public StatisticsList getDependenciesStatistics(Long executionId)
    {
        GraphContext graphContext = this.getGraph(executionId);

        this.libraryDependenciesService.setGraphContext(graphContext);
        DependenciesDTO dependenciesDTO = this.libraryDependenciesService.getDependencies();

        // will use only nodes data not edges
        Set<GraphNode> depsGraphNodes = dependenciesDTO.getNodes();

        Map<String, List<String>> depsDetailsMap = new HashMap<>();
        for (GraphNode node : depsGraphNodes)
        {
            String type = node.getType();

            // Extract only file type extension (jar, ear, war etc.)
            Object data = node.getData();
            List<String> deps = new ArrayList<>();
            if (data instanceof Map)
            {
                Map<String, Object> dataMap = (Map<String, Object>) data;
                String filename;
                String fileExtension = null;
                if (dataMap.containsKey(LibraryDependenciesService.KEY_FILE_NAME))
                {
                    filename = (String) dataMap.get(LibraryDependenciesService.KEY_FILE_NAME);
                    if (filename.lastIndexOf('.') > 0)
                    {
                        fileExtension = filename.substring(filename.lastIndexOf('.'));
                    }
                    LOG.info("FILENAME " + filename);
                }

                deps = depsDetailsMap.getOrDefault(type, deps);
                if (fileExtension != null)
                {
                    deps.add(fileExtension);
                }
            }
            
            depsDetailsMap.put(type, deps);
        }
        
        StatisticsList dependencyStatisticsDTO = new StatisticsList();
        for (Map.Entry<String, List<String>> dependency : depsDetailsMap.entrySet())
        {
            String type = dependency.getKey();
            Integer count = dependency.getValue().size();
            dependencyStatisticsDTO.addValue(type, count);
        }
        dependencyStatisticsDTO.sortByKey();
        return dependencyStatisticsDTO;
    }
}
