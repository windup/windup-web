package org.jboss.windup.web.addons.websupport.rest;

import org.jboss.windup.reporting.freemarker.problemsummary.ProblemSummary;

import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;

/**
 * @author <a href="mailto:jesse.sightler@gmail.com">Jesse Sightler</a>
 */
@Path("/my")
@Consumes("application/json")
@Produces("application/json")
public interface MyRESTAPI {
    @GET
    @Path("hello")
    Object pathExists();
}
