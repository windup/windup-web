package org.jboss.windup.web.addons.websupport.rest;

import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.logging.Logger;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import javax.inject.Inject;

import org.jboss.windup.graph.GraphContext;
import org.jboss.windup.graph.model.ProjectModel;
import org.jboss.windup.graph.service.ProjectService;
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

    /*
     *  initialize map with all EffortLevel values with 0 incidents
     */
    private static final Map<String, Integer> EFFORT_LEVELS = getEffortLevelMap(new HashMap<String, Integer>());

    private static Map<String, Integer> getEffortLevelMap(Map<String, Integer> filledMap)
    {
        Stream.of(EffortLevel.values()).forEach(effort -> filledMap.put(effort.getShortDescription(), 0));
        return filledMap;
    }

    /**
     * Get all project models filtered for the graph context
     */
    @Override
    protected Set<ProjectModel> getProjectModels(GraphContext graphContext, ReportFilterDTO filter)
    {
        // if (filter.getSelectedApplicationPaths().isEmpty())
        // return Collections.emptySet();

        ProjectService projectService = new ProjectService(graphContext);
        // for FILTER return projectService.getFilteredProjectModels(filter.getSelectedApplicationPaths());
        return projectService.getRootProjectModels();
    }

    /**
     * This counts incidents for every category issue type
     */
    @Override
    public Map<String, Map<String, Integer>> getAggregatedCategories(Long executionId)
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
    private Map<String, Map<String, Integer>> getIncidentsByEffort(Map<IssueCategoryModel, List<ProblemSummary>> problems)
    {
        Map<String, Map<String, Integer>> incidentsByEfforts = new HashMap<>();

        problems.forEach((issueCategory, problemSummaries) -> {

            Map<String, Integer> effortsIncidents = new HashMap<>();
            effortsIncidents.putAll(EFFORT_LEVELS);

            for (ProblemSummary problemSummary : problemSummaries)
            {
                EffortLevel effort = EffortLevel.forPoints(problemSummary.getEffortPerIncident());
                Integer incidents = effortsIncidents.get(effort.getShortDescription());
                effortsIncidents.put(effort.getShortDescription(), new Integer(incidents.intValue() + problemSummary.getNumberFound()));
            }
            incidentsByEfforts.put(issueCategory.getCategoryID(), effortsIncidents);
        });
        return incidentsByEfforts;
    }

    /**
     * Get all issues and filter it to only a given IssueCategoryModel
     *
     * @param problems - all found problems
     * @return
     */
    private Map<IssueCategoryModel, List<ProblemSummary>> getIncidentsByCategory(Map<IssueCategoryModel, List<ProblemSummary>> problems)
    {
        return problems.entrySet().stream()
                    .collect(Collectors.toMap(map -> map.getKey(), map -> map.getValue()));
    }

    /**
     * This counts incidents for every EffortLevel
     *
     */
    @Override
    public Map<String, Map<String, Integer>> getAggregatedMandatoryIncidents(Long executionId)
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

        return getIncidentsByEffort(getIncidentsByCategory(issues)).entrySet().stream().filter(map -> map.getKey().equals("mandatory"))
                    .collect(Collectors.toMap(map -> map.getKey(), map -> map.getValue()));
    }

    /**
     * This counts incidents for every identified Java package
     *
     */
    @Override
    public Map<String, Integer> getJavaPackageStats(Long executionId)
    {
        GraphContext graphContext = this.getGraph(executionId);

        Set<String> includeTags = new HashSet<>();
        Set<String> excludeTags = new HashSet<>();
        Set<ProjectModel> projectModels = null;

        ReportFilterDTO filter = this.reportFilterService.getReportFilter(executionId);

        projectModels = this.getProjectModels(graphContext, filter);
        if (filter.isEnabled())
        {
            includeTags.addAll(filter.getIncludeTags());
            excludeTags.addAll(filter.getExcludeTags());
        }

        TypeReferenceService typeReferenceService = new TypeReferenceService(graphContext);

        Map<String, Integer> data = new HashMap<>();
        for (Iterator<ProjectModel> iterator = projectModels.iterator(); iterator.hasNext();)
        {
            ProjectModel projectModel = iterator.next();
            data.putAll(typeReferenceService.getPackageUseFrequencies(projectModel, includeTags, excludeTags, 2, true));
        }

        return data;
    }

    @Override
    public Map<String, Long> getArchivesStatistics(Long executionId)
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
                String filename = null;
                String filepath = null;
                String fileExtension = null;
                if (dataMap.containsKey(LibraryDependenciesService.KEY_FILE_NAME))
                {
                    filepath = (String) dataMap.get(LibraryDependenciesService.KEY_FILE_PATH);
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

        // Map<String, Long> depStats = new HashMap<>();
        Map<String, Long> extensionStats = new HashMap<>();
        for (Map.Entry<String, List<String>> dependency : depsDetailsMap.entrySet())
        {
            List<String> extensions = dependency.getValue();
            for (String extension : extensions)
            {
                extensionStats.put(extension, extensionStats.getOrDefault(extension, 0l) + 1l);
            }
        }
        return extensionStats;

    }

    private Set<String> getUniqueProjectTypes(Set<ProjectModel> projectModels)
    {
        return projectModels.stream().map(ProjectModel::getProjectType).collect(Collectors.toSet());
    }

    @Inject
    private LibraryDependenciesService libraryDependenciesService;

    @Override
    public Map<String, Long> getDependenciesStatistics(Long executionId)
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
                String filename = null;
                String filepath = null;
                String fileExtension = null;
                if (dataMap.containsKey(LibraryDependenciesService.KEY_FILE_NAME))
                {
                    filepath = (String) dataMap.get(LibraryDependenciesService.KEY_FILE_PATH);
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
        
        Map<String, Long> depStats = new HashMap<>();
        for (Map.Entry<String, List<String>> dependency : depsDetailsMap.entrySet())
        {
            String type = dependency.getKey();
            Integer count = dependency.getValue().size();
            depStats.put(type, count.longValue());
        }
        return depStats;
    }

//    private Set<ProjectModel> getDependencies()
//    {
        // GraphContext graphContext = this.getGraph(executionId);
        //
        // Set<String> includeTags = new HashSet<>();
        // Set<String> excludeTags = new HashSet<>();
        // Set<ProjectModel> projectModels = null;
        //
        // ReportFilterDTO filter = this.reportFilterService.getReportFilter(executionId);
        //
        // projectModels = this.getProjectModels(graphContext, filter);
        // if (filter.isEnabled())
        // {
        // includeTags.addAll(filter.getIncludeTags());
        // excludeTags.addAll(filter.getExcludeTags());
        // }
        // TraversalStrategy allTraversalStrategy = new AllTraversalStrategy();
        //
        // // get real stats
        // Map<String, Long> components = new HashMap<>();
        // for (ProjectModel projectModel : projectModels)
        // {
        // ProjectModelTraversal traversal = new ProjectModelTraversal(projectModel, allTraversalStrategy);
        //
        // Set<ProjectModel> allProjects = traversal.getAllProjects(true);
        // LOG.info("Number " + allProjects.size() + " of Projects for " + projectModel);
        // for (String projectType : getUniqueProjectTypes(allProjects))
        // {
        // // TODO: properly handle projectModel.getProjectType() null why is this not set properly to file extension?
        // if (projectType != null)
        // {
        // long count = allProjects.stream().filter(projectM -> projectType.equals(projectM.getProjectType())).count();
        // components.put(projectType, components.getOrDefault(projectType, 0L) + count);
        // }
        // else
        // {
        // List<String> nullProjectMap = allProjects.stream().filter(proj -> proj.getProjectType() == null).map(ProjectModel::getName)
        // .collect(Collectors.toList());
        // LOG.info("list of null projects " + nullProjectMap);
        // components.put("null", components.getOrDefault("null", 0l) + nullProjectMap.size());
        // }
        // }
        // }
        // return components;
    // }

}
