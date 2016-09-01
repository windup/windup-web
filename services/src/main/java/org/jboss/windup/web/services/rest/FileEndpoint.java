package org.jboss.windup.web.services.rest;

import javax.ws.rs.Consumes;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;

/**
 * Contains methods for checking if files exist and other file manipulation tasks on the server.
 *
 * @author <a href="mailto:jesse.sightler@gmail.com">Jesse Sightler</a>
 */
@Path("/file")
@Consumes("application/json")
@Produces("application/json")
public interface FileEndpoint
{
    @POST
    @Path("pathExists")
    boolean pathExists(String path);
}
