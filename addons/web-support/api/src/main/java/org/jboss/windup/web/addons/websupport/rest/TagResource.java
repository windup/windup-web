package org.jboss.windup.web.addons.websupport.rest;

import org.jboss.windup.config.tags.Tag;

import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import java.util.List;

/**
 * @author <a href="mailto:jesse.sightler@gmail.com">Jesse Sightler</a>
 */
@Path("tag-data")
@Consumes("application/json")
@Produces("application/json")
public interface TagResource
{
    @GET
    List<Object> getRootTags();
}
