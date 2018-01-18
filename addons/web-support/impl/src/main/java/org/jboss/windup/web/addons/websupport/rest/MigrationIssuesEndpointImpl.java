package org.jboss.windup.web.addons.websupport.rest;

import java.util.Collection;
import java.util.HashSet;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

import javax.ws.rs.NotFoundException;

import org.jboss.windup.graph.GraphContext;
import org.jboss.windup.graph.model.ProjectModel;
import org.jboss.windup.graph.service.ProjectService;
import org.jboss.windup.reporting.category.IssueCategoryModel;
import org.jboss.windup.reporting.freemarker.problemsummary.ProblemSummary;
import org.jboss.windup.reporting.freemarker.problemsummary.ProblemSummaryService;
import org.jboss.windup.web.addons.websupport.model.ReportFilterDTO;
import org.jboss.windup.web.addons.websupport.rest.graph.AbstractGraphResource;

/**
 * @author <a href="mailto:dklingenberg@gmail.com">David Klingenberg</a>
 */
public class MigrationIssuesEndpointImpl extends AbstractGraphResource implements MigrationIssuesEndpoint
{
    @Override
    public Map<String, List<ProblemSummary>> getAggregatedIssues(Long reportId, Map<String, Object> filterAsMap)
    {
        GraphContext graphContext = this.getGraph(reportId);

        // ReportFilterDTO filter = this.reportFilterService.getReportFilter(reportId);
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

        Map<IssueCategoryModel, List<ProblemSummary>> issues = ProblemSummaryService.getProblemSummaries(
                    graphContext,
                    projectModels,
                    includeTags,
                    excludeTags,
                    true,
                    false);

        Map<String, List<ProblemSummary>> issuesWithStringKey = new LinkedHashMap<>();
        issues.entrySet().forEach((entry) -> {
            boolean includeCategoriesEnabled = !filter.getIncludeCategories().isEmpty();
            boolean isIncluded = filter.getIncludeCategories().contains(entry.getKey().getName());
            boolean isExcluded = filter.getExcludeCategories().contains(entry.getKey().getName());

            if ((includeCategoriesEnabled && isIncluded) || (!includeCategoriesEnabled && !isExcluded))
            {
                issuesWithStringKey.put(entry.getKey().getName(), entry.getValue());
            }
        });

        return issuesWithStringKey;
    }

    @Override
    public Object getIssueFiles(Long executionId, String issueId, Map<String, Object> filterAsMap)
    {
        ProblemSummary summary = getProblemSummary(executionId, issueId, filterAsMap);
        return getFileSummaries(executionId, summary);
    }

    private List<ProblemFileSummaryWrapper> getFileSummaries(Long executionId, ProblemSummary summary)
    {
        return StreamSupport.stream(summary.getDescriptions().spliterator(), false)
                    .flatMap(description -> StreamSupport.stream(summary.getFilesForDescription(description).spliterator(), false))
                    .map(fileSummary -> new ProblemFileSummaryWrapper(
                                this.convertToMap(executionId, fileSummary.getFile().getElement(), 0, false),
                                fileSummary.getOccurrences()))
                    .collect(Collectors.toList());
    }

    private ProblemSummary getProblemSummary(Long executionId, String issueId, Map<String, Object> filterAsMap)
    {
        Map<String, List<ProblemSummary>> categorizedProblems = this.getAggregatedIssues(executionId, filterAsMap);

        List<ProblemSummary> problemSummaries = categorizedProblems.entrySet()
                    .stream()
                    .map(Map.Entry::getValue)
                    .flatMap(Collection::stream)
                    .filter(item -> item.getRuleID().concat(item.getIssueName()).equals(issueId))
                    .collect(Collectors.toList());

        if (problemSummaries.size() == 0)
        {
            throw new NotFoundException();
        }

        return problemSummaries.get(0);
    }

    protected Set<ProjectModel> getProjectModels(GraphContext graphContext, ReportFilterDTO filter)
    {
        if (filter.getSelectedApplicationPaths().isEmpty())
            return null;

        ProjectService projectService = new ProjectService(graphContext);
        return projectService.getFilteredProjectModels(filter.getSelectedApplicationPaths());
    }

    static class ProblemFileSummaryWrapper
    {
        private final Map<String, Object> file;

        private int occurrences;

        public ProblemFileSummaryWrapper(Map<String, Object> file, int occurrences)
        {
            this.file = file;
            this.occurrences = occurrences;
        }

        public Map<String, Object> getFile()
        {
            return file;
        }

        public int getOccurrences()
        {
            return occurrences;
        }
    }

}
