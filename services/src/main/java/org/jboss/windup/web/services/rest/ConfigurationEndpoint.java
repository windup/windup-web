package org.jboss.windup.web.services.rest;

import org.jboss.windup.web.services.model.Configuration;
import org.jboss.windup.web.services.model.LabelsPath;
import org.jboss.windup.web.services.model.RulesPath;

import java.util.Set;

import javax.validation.Valid;
import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;

/**
 * Contains methods for loading and configuring Windup.
 *
 * @author <a href="mailto:jesse.sightler@gmail.com">Jesse Sightler</a>
 */
@Path("/configuration")
@Consumes("application/json")
@Produces("application/json")
public interface ConfigurationEndpoint
{
    /**
     * Returns the Windup configuration.
     */
    @GET
    Configuration getConfiguration();

    /**
     * Persists the given Windup configuration.
     */
    @PUT
    Configuration saveConfiguration(@Valid Configuration configuration);

    /**
     * Returns only rulespath collection for custom registered ruleset paths
     *
     * @return
     */
    @GET
    @Path("custom-rulesets")
    Set<RulesPath> getCustomRulesetPaths();

    /**
     * Returns only rulespath collection for custom registered ruleset paths
     *
     * @return
     */
    @GET
    @Path("custom-labelsets")
    Set<LabelsPath> getCustomLabelsetPaths();


    @POST
    @Path("reload")
    Configuration reloadConfiguration();
}
