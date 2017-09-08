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
@Path("reports/{executionId}/remote-services")
@Consumes("application/json")
@Produces("application/json")
public interface RemoteServicesResource extends FurnaceRESTGraphAPI
{
    @POST
    @Path("ejb-remote")
    Object getEjbRemoteService(@PathParam("executionId") Long executionID, Map<String, Object> filterAsMap);

    @POST
    @Path("jax-rpc")
    Object getJaxRpcWebServices(@PathParam("executionId") Long executionID, Map<String, Object> filterAsMap);

    @POST
    @Path("jax-rs")
    Object getJaxRsWebServices(@PathParam("executionId") Long executionID, Map<String, Object> filterAsMap);

    @POST
    @Path("jax-ws")
    Object getJaxWsWebServices(@PathParam("executionId") Long executionID, Map<String, Object> filterAsMap);

    @POST
    @Path("rmi")
    Object getRmiServices(@PathParam("executionId") Long executionID, Map<String, Object> filterAsMap);
}
