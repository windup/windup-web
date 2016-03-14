package org.jboss.windup.web.services.rest;

import org.jboss.windup.web.addons.websupport.model.RegisteredApplicationModel;
import org.jboss.windup.web.services.dto.ProgressStatusDto;

import javax.ws.rs.Consumes;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;

/**
 * @author <a href="mailto:jesse.sightler@gmail.com">Jesse Sightler</a>
 */
@Path("windup")
@Consumes("application/json")
@Produces("application/json")
public interface WindupEndpoint
{
    @POST
    @Path("status")
    ProgressStatusDto getStatus(RegisteredApplicationModel registeredApplicationModel);

    @POST
    @Path("execute")
    void executeWindup(RegisteredApplicationModel registeredApplicationModel);
}