package org.jboss.windup.web.services.rest;

import org.jboss.windup.config.ConfigurationOption;
import org.jboss.windup.config.ValidationResult;
import org.jboss.windup.web.services.model.AdvancedOption;

import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import java.util.List;

/**
 * Contains endpoints for getting available options and validating option values.
 *
 * @author <a href="mailto:jesse.sightler@gmail.com">Jesse Sightler</a>
 */
@Path(ConfigurationOptionsEndpoint.CONFIGURATION_OPTIONS_PATH)
@Consumes("application/json")
@Produces("application/json")
public interface ConfigurationOptionsEndpoint
{
    String CONFIGURATION_OPTIONS_PATH = "configuration-options";
    String VALIDATE_OPTION = "validate-option";

    /**
     * Gets a list of options available from the server.
     */
    @GET
    List<ConfigurationOption> getAdvancedOptions();

    /**
     * Validates the provided option and returns the result.
     */
    @POST
    @Path(VALIDATE_OPTION)
    ValidationResult validateOption(AdvancedOption advancedOption);
}
