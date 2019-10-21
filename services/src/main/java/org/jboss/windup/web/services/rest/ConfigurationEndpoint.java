package org.jboss.windup.web.services.rest;

import org.jboss.windup.web.services.model.Configuration;
import org.jboss.windup.web.services.model.LabelsPath;
import org.jboss.windup.web.services.model.RulesPath;

import java.util.Set;

import javax.validation.Valid;

import javax.ws.rs.*;

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
    Configuration getGlobalConfiguration();

    /**
     * Returns the Windup configuration for a single project.
     */
    @GET
    @Path("by-project/{projectId}")
    Configuration getConfigurationByProject(@PathParam("projectId") long projectId);

    /**
     * Returns only rulespath collection for custom registered ruleset paths
     *
     * @return
     */
    @GET
    @Path("/{id}/custom-rulesets")
    Set<RulesPath> getCustomRulesetPaths(@PathParam("id") long id);

    /**
     * Returns only labelspath collection for custom registered ruleset paths
     *
     * @return
     */
    @GET
    @Path("/{id}/custom-labelsets")
    Set<LabelsPath> getCustomLabelsetPaths(@PathParam("id") long id);

    /**
     * Persists the given configuration.
     */
    @PUT
    @Path("/{id}")
    Configuration saveConfiguration(@PathParam("id") long id, @Valid Configuration configuration);

    @POST
    @Path("/{id}/reload")
    Configuration reloadConfiguration(@PathParam("id") long id);

}
