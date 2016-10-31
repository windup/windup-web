package org.jboss.windup.web.addons.websupport.rest;

import java.util.*;

import org.jboss.windup.graph.GraphContext;
import org.jboss.windup.graph.model.ProjectModel;
import org.jboss.windup.graph.model.resource.FileModel;
import org.jboss.windup.graph.service.WindupConfigurationService;
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
}
