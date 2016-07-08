package org.jboss.windup.web.services.rest;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.logging.Logger;

import javax.ejb.Stateless;
import javax.inject.Inject;

import org.jboss.windup.web.addons.websupport.model.RegisteredApplicationModel;
import org.jboss.windup.web.addons.websupport.service.RegisteredApplicationService;
import org.jboss.windup.web.furnaceserviceprovider.FromFurnace;
import org.jboss.windup.web.services.dto.RegisteredApplicationDto;

/**
 * @author <a href="mailto:jesse.sightler@gmail.com">Jesse Sightler</a>
 */

@Stateless
public class RegisteredApplicationEndpointImpl implements RegisteredApplicationEndpoint
{
    private static Logger LOG = Logger.getLogger(RegisteredApplicationEndpointImpl.class.getSimpleName());

    @Inject @FromFurnace
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
    public RegisteredApplicationDto registerApplication(RegisteredApplicationDto application)
    {
        LOG.info("Registering an application at: " + application.getInputPath());
        return new RegisteredApplicationDto(registeredApplicationService.getOrCreate(application.getInputPath()));
    }

    @Override
    public void unregisterApplication(RegisteredApplicationDto application)
    {
        RegisteredApplicationModel model = registeredApplicationService.getByInputPath(application.getInputPath());
        registeredApplicationService.delete(model);
    }
}
