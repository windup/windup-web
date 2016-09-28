package org.jboss.windup.web.services.rest;

import org.jboss.windup.config.ConfigurationOption;

import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import java.util.List;

/**
 * @author <a href="mailto:jesse.sightler@gmail.com">Jesse Sightler</a>
 */
@Path(ConfigurationOptionsEndpoint.CONFIGURATION_OPTIONS_PATH)
@Consumes("application/json")
@Produces("application/json")
public interface ConfigurationOptionsEndpoint
{
    String CONFIGURATION_OPTIONS_PATH = "configuration-options";

    @GET
    List<ConfigurationOption> getAdvancedOptions();
}
