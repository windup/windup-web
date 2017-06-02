package org.jboss.windup.web.services.rest;

import javax.ws.rs.Consumes;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;


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

    /**
     * Gets an indication as to whether the given path is a file or a directory.
     *
     * This will return null if this cannot be determined for any reason. For example, this will
     * return null if the path is blank, non-existent, or if the server has no read permissions on this
     * path.
     */
    @POST
    @Path("pathTargetType")
    PathTargetType pathTargetType(String path);

    enum PathTargetType
    {
        FILE, DIRECTORY
    }

    /**
     * Returns the number of non-empty files existing directly in the given server directory.
     */
    @POST
    @Path("directoryFilesCount")
    int directoryFilesCount(String path, @QueryParam("nameRegex") String nameRegex, @QueryParam("minSize") Long minSizeBytes);
}
