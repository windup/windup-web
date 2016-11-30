package org.jboss.windup.web.addons.websupport.rest.graph;

import org.jboss.windup.graph.model.resource.FileModel;
import org.jboss.windup.reporting.model.TechnologyTagModel;

import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import java.util.List;
import java.util.Map;

/**
 * @author <a href="mailto:jesse.sightler@gmail.com">Jesse Sightler</a>
 */
@Path(TechnologyTagResource.BASE_URL)
@Consumes(MediaType.APPLICATION_JSON)
@Produces(MediaType.APPLICATION_JSON)
public interface TechnologyTagResource
{
    String BASE_URL = "/graph/technology-tag";

    /**
     * Returns a list of {@link TechnologyTagModel}s for the given {@link FileModel}.
     */
    @GET
    @Path("/{executionID}/by-file/{fileModelID}")
    List<Map<String, Object>> getTechnologyTags(@PathParam("executionID") Long executionID, @PathParam("fileModelID") Integer fileModelID);
}
