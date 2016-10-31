package org.jboss.windup.web.addons.websupport.rest;

import java.util.*;
import java.util.function.Supplier;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

import javax.ws.rs.NotFoundException;

import org.jboss.windup.graph.GraphContext;
import org.jboss.windup.graph.model.ProjectModel;
import org.jboss.windup.graph.model.resource.FileModel;
import org.jboss.windup.graph.service.WindupConfigurationService;
import org.jboss.windup.reporting.freemarker.problemsummary.ProblemFileSummary;
import org.jboss.windup.reporting.freemarker.problemsummary.ProblemSummary;
import org.jboss.windup.reporting.freemarker.problemsummary.ProblemSummaryService;
import org.jboss.windup.reporting.model.Severity;
import org.jboss.windup.web.addons.websupport.rest.graph.AbstractGraphResource;

/**
 * @author <a href="mailto:dklingenberg@gmail.com">David Klingenberg</a>
 */
public class MigrationIssuesEndpointImpl extends AbstractGraphResource implements MigrationIssuesEndpoint
{

    @Override
    public Map<Severity, List<ProblemSummary>> getAggregatedIssues(Long reportId)
    {
        GraphContext graphContext = this.getGraph(reportId);

        ProblemSummaryService problemSummaryService = new ProblemSummaryService();

        Set<ProjectModel> projectModels = new HashSet<>();

        for (FileModel inputPath : WindupConfigurationService.getConfigurationModel(graphContext).getInputPaths())
        {
            projectModels.add(inputPath.getProjectModel());
        }

        Set<String> includeTags = new HashSet<>();
        Set<String> excludeTags = new HashSet<>();

        Map<Severity, List<ProblemSummary>> categorizedProblems = ProblemSummaryService.getProblemSummaries(graphContext, projectModels, includeTags,
                    excludeTags);

        return categorizedProblems;
    }

    @Override
    public Object getIssueFiles(Long executionId, String issueId)
    {
        Map<Severity, List<ProblemSummary>> categorizedProblems = this.getAggregatedIssues(executionId);

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

        ProblemSummary summary = problemSummaries.get(0);

        String firstDescription = StreamSupport.stream(summary.getDescriptions().spliterator(), false)
                    .findFirst()
                    .orElseThrow((Supplier<RuntimeException>) NotFoundException::new);

        Iterable<ProblemFileSummary> fileSummaries = summary.getFilesForDescription(firstDescription);

        List<ProblemFileSummaryWrapper> fileSummariesList = StreamSupport.stream(fileSummaries.spliterator(), false)
                    .map(item -> new ProblemFileSummaryWrapper(
                                this.convertToMap(executionId, item.getFile().asVertex(), 0),
                                item.getOccurrences()))
                    .collect(Collectors.toList());

        return fileSummariesList;
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
