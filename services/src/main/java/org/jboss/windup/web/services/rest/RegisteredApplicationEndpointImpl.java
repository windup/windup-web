package org.jboss.windup.web.services.rest;

import org.jboss.windup.web.addons.websupport.model.RegisteredApplicationModel;
import org.jboss.windup.web.addons.websupport.service.RegisteredApplicationService;

import javax.ejb.Stateless;
import javax.inject.Inject;
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
    public Collection<RegisteredApplicationModel> getRegisteredApplications()
    {
        List<RegisteredApplicationModel> results = new ArrayList<>();
        for (RegisteredApplicationModel model : registeredApplicationService.getAllRegisteredApplications())
        {
            results.add(model);
        }
        return results;
    }

    @Override
    public RegisteredApplicationModel registerApplication(String path)
    {
        return registeredApplicationService.create(path);
    }
}
