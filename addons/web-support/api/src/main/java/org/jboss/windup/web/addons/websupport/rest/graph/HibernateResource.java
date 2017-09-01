package org.jboss.windup.web.addons.websupport.rest.graph;

import org.jboss.windup.web.addons.websupport.rest.FurnaceRESTGraphAPI;

import java.util.Map;

import javax.ws.rs.Consumes;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;

/**
 * @author <a href="mailto:dklingenberg@gmail.com">David Klingenberg</a>
 */
@Path("reports/{executionId}/hibernate")
@Consumes("application/json")
@Produces("application/json")
public interface HibernateResource extends FurnaceRESTGraphAPI
{
    @POST
    @Path("entity")
    Object getEntity(@PathParam("executionId") Long executionID, Map<String, Object> filterAsMap);

    @POST
    @Path("mappingFile")
    Object getMappingFile(@PathParam("executionId") Long executionID, Map<String, Object> filterAsMap);

    @POST
    @Path("configurationFile")
    Object getConfigurationFile(@PathParam("executionId") Long executionID, Map<String, Object> filterAsMap);

    @POST
    @Path("sessionFactory")
    Object getSessionFactory(@PathParam("executionId") Long executionID, Map<String, Object> filterAsMap);
}
