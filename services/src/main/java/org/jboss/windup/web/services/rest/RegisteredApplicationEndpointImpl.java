package org.jboss.windup.web.services.rest;

import org.jboss.forge.furnace.util.Sets;
import org.jboss.windup.web.addons.websupport.dto.RegisteredApplicationDto;
import org.jboss.windup.web.addons.websupport.model.RegisteredApplicationModel;
import org.jboss.windup.web.addons.websupport.service.RegisteredApplicationService;

import javax.ejb.Stateless;
import javax.inject.Inject;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

/**
 * @author <a href="mailto:jesse.sightler@gmail.com">Jesse Sightler</a>
 */

@Stateless
public class RegisteredApplicationEndpointImpl implements RegisteredApplicationEndpoint
{

    @Inject
    private RegisteredApplicationService registeredApplicationService;

    @Override
    public Collection<RegisteredApplicationDto> getRegisteredApplications()
    {
        List<RegisteredApplicationDto> results = new ArrayList<>();
        for (RegisteredApplicationModel model : registeredApplicationService.getAllRegisteredApplications())
        {
            results.add(new RegisteredApplicationDto(model));
        }
        return results;
    }

    @Override
    public RegisteredApplicationDto registerApplication(@QueryParam("path") String path)
    {
        return new RegisteredApplicationDto(registeredApplicationService.create(path));
    }
}
