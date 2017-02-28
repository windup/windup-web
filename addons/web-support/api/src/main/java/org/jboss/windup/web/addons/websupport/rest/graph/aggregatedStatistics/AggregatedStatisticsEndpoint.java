package org.jboss.windup.web.addons.websupport.rest.graph.aggregatedStatistics;


import org.jboss.windup.web.addons.websupport.rest.FurnaceRESTGraphAPI;

import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;

/**
 * Gets a list of aggregated statistics for the group/applications for the report index tables/graphs.
 *
 * @author <a href="mailto:hotmana76@gmail.com">Marek Novotny</a>
 */
@Path("reports/{executionId}/aggregatedstats")
@Consumes("application/json")
@Produces("application/json")
public interface AggregatedStatisticsEndpoint extends FurnaceRESTGraphAPI
{
    /**
     * Returns a high level summary of all categories.
     */
    @GET
    @Path("aggregatedCategories")
    EffortByCategoryDTO getAggregatedCategories(@PathParam("executionId") Long executionId);

    /**
     * Returns a high level summary of all java package incidents.
     */
    @GET
    @Path("aggregatedJavaPackages")
    StatisticsList getJavaPackageStatistics(@PathParam("executionId") Long executionId);

    /**
     * Returns summary numbers of processed archive files like ear, jar, war. Extension is the key
     * 
     * @param executionId
     * @return
     */
    @GET
    @Path("aggregatedArchives")
    StatisticsList getArchivesStatistics(@PathParam("executionId") Long executionId);

    /**
     * Returns summary numbers of processed dependencies like unique/distinct, shared dependencies
     * 
     * @param executionId
     * @return
     */
    @GET
    @Path("aggregatedDependencies")
    StatisticsList getDependenciesStatistics(@PathParam("executionId") Long executionId);

}
