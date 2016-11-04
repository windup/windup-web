package org.jboss.windup.web.addons.websupport.rest.techreport;

import javax.ws.rs.*;

/**
 * Contains methods for managing technologies statistics.
 * 
 * @author <a href="mailto:zizka@seznam.cz">Ondrej Zizka</a>
 */
@Path(TechnologiesStatsEndpoint.PATH_TECH_STATS)
@Consumes("application/json")
@Produces("application/json")
public interface TechnologiesStatsEndpoint
{
    String PATH_TECH_STATS = "/techStats";

    /**
     * Gets the list of all registered applications.
     */
    @GET
    @Path("compute/{execId}")
    boolean computeTechStats(@PathParam("execId") long executionId); //, @QueryParam("onlyIfNotExists") boolean onlyIfNotExists

}
