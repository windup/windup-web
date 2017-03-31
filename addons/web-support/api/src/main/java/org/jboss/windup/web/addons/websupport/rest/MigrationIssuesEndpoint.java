package org.jboss.windup.web.addons.websupport.rest;


import org.jboss.windup.web.addons.websupport.model.ReportFilterDTO;

import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import java.util.Map;

/**
 * Gets a list of Migration issues from the server.
 *
 * @author <a href="mailto:dklingenberg@gmail.com">David Klingenberg</a>
 */
@Path("reports/{executionId}/migrationIssues")
@Consumes("application/json")
@Produces("application/json")
public interface MigrationIssuesEndpoint extends FurnaceRESTGraphAPI
{

    /**
     * Returns a high level summary of all issues.
     */
    @POST
    @Path("aggregatedIssues")
    Object getAggregatedIssues(@PathParam("executionId") Long executionId, Map<String, Object> filter);

    /**
     * Returns the specific files associated with a particular issue.
     */
    @POST
    @Path("{issueId}/files")
    Object getIssueFiles(@PathParam("executionId") Long executionId, @PathParam("issueId") String issueId, Map<String, Object> filter);
}
