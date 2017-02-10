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
    public RegisteredApplication updatePath(@Valid RegisteredApplication application)
    {
        return this.registeredApplicationService.updateApplicationPath(application);
    }

    @Override
    public RegisteredApplication reuploadApplication(MultipartFormDataInput data, long appId)
    {
        RegisteredApplication application = this.getApplication(appId);

        return this.registeredApplicationService.updateApplication(application, data);
    }

    @Override
    public void unregister(long applicationID)
    {
        this.deleteApplication(applicationID);
    }

    @Override
    public void deleteApplication(long appId)
    {
        RegisteredApplication application = this.registeredApplicationService.getApplication(appId);

        this.registeredApplicationService.deleteApplication(application);
    }
}
