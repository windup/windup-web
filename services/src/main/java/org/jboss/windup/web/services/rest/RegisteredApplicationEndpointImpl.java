package org.jboss.windup.web.services.rest;

import javax.ejb.Stateless;
import javax.inject.Inject;
import javax.validation.Valid;

import org.jboss.resteasy.plugins.providers.multipart.MultipartFormDataInput;
import org.jboss.windup.web.services.model.RegisteredApplication;
import org.jboss.windup.web.services.service.RegisteredApplicationService;

/**
 * @author <a href="mailto:jesse.sightler@gmail.com">Jesse Sightler</a>
 */
@Stateless
public class RegisteredApplicationEndpointImpl implements RegisteredApplicationEndpoint
{
    @Inject
    private RegisteredApplicationService registeredApplicationService;

    @Override
    public RegisteredApplication getApplication(long id)
    {
        return this.registeredApplicationService.getApplication(id);
    }

    @Override
    public void unregister(long applicationID)
    {
        this.registeredApplicationService.unregister(applicationID);
    }

    @Override
    public RegisteredApplication update(@Valid RegisteredApplication application)
    {
        return this.registeredApplicationService.update(application);
    }

    @Override
    public RegisteredApplication updateApplication(MultipartFormDataInput data, long appId)
    {
        return this.registeredApplicationService.updateApplication(data, appId);
    }

    @Override
    public void deleteApplication(long appId)
    {
        this.registeredApplicationService.deleteApplication(appId);
    }
}
