package org.jboss.windup.web.services.rest;

import org.jboss.windup.config.RuleProvider;
import org.jboss.windup.web.services.model.RuleProviderEntity;
import org.ocpsoft.rewrite.config.Rule;

import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import java.util.List;

/**
 * Provides Metadata regarding the {@link RuleProvider}s and {@link Rule}s that are available within Windup.
 *
 * @author <a href="mailto:jesse.sightler@gmail.com">Jesse Sightler</a>
 */
@Path("/rules")
@Consumes("application/json")
@Produces("application/json")
public interface RuleEndpoint
{
    /**
     * Returns a list of data about all of the providers and rules that are registered within the system.
     */
    @GET
    @Path("/allProviders")
    List<RuleProviderEntity> getAllProviders();
}
