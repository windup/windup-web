package org.jboss.windup.web.services.rest;

import javax.ws.rs.Consumes;
import javax.ws.rs.DELETE;
import javax.ws.rs.GET;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;

import org.jboss.windup.web.services.model.ReportFilter;
import org.jboss.windup.web.services.model.Tag;

import java.util.Collection;

/**
 * @author <a href="mailto:dklingenberg@gmail.com">David Klingenberg</a>
 */
@Path("applicationGroups/{groupId}/filter")
@Consumes("application/json")
@Produces("application/json")
public interface ReportFilterEndpoint
{
    @GET
    ReportFilter getFilter(@PathParam("groupId") Long groupId);

    @GET
    @Path("tags")
    Collection<Tag> getTags();

    @PUT
    ReportFilter setFilter(@PathParam("groupId") Long groupId, ReportFilter filter);

    @DELETE
    void clearFilter(@PathParam("groupId") Long groupId);
}
