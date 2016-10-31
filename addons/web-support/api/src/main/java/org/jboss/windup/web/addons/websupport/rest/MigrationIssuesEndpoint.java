package org.jboss.windup.web.addons.websupport.rest;

// TODO: Come on class loader, classes not present?!
// import org.jboss.windup.reporting.freemarker.problemsummary.ProblemSummary;
// import org.jboss.windup.reporting.model.Severity;
// import java.util.List;
// import java.util.Map;

import javax.ws.rs.*;

/**
 * @author <a href="mailto:dklingenberg@gmail.com">David Klingenberg</a>
 */
@Path("reports/{executionId}/migrationIssues")
@Consumes("application/json")
@Produces("application/json")
public interface MigrationIssuesEndpoint extends FurnaceRESTGraphAPI
{

    @GET
    @Path("aggregatedIssues")
    Object getAggregatedIssues(@PathParam("executionId") Long executionId);

    @GET
    @Path("{issueId}/files")
    Object getIssueFiles(@PathParam("executionId") Long executionId, @PathParam("issueId") String issueId);
}
