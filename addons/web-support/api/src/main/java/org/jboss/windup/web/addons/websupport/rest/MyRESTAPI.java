package org.jboss.windup.web.addons.websupport.rest;

import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Configuration;
import javax.ws.rs.core.Context;

/**
 * @author <a href="mailto:jesse.sightler@gmail.com">Jesse Sightler</a>
 */
@Path("/my")
@Consumes("application/json")
@Produces("application/json")
public interface MyRESTAPI
{
    @Context
    void setConfiguration(Configuration configuration);

    @Context
    void setContext(HttpServletRequest request);

    @GET
    @Path("hello")
    Object pathExists();
}
