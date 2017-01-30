package org.jboss.windup.web.addons.websupport.rest;

import java.util.List;

import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;

import org.jboss.windup.web.addons.websupport.model.TagDTO;

/**
 * @author <a href="mailto:jesse.sightler@gmail.com">Jesse Sightler</a>
 */
@Path("tag-data")
@Consumes("application/json")
@Produces("application/json")
public interface TagResource
{
    @GET
    List<TagDTO> getRootTags();

}
