package org.jboss.windup.web.services.messaging;

import javax.inject.Inject;

import org.jboss.windup.web.services.model.RegisteredApplication;
import org.jboss.windup.web.services.service.PackageService;

/**
 * Performs the task of discovering packages and caching the resulting data in the database.
 *
 * @author <a href="mailto:dklingenberg@gmail.com">David Klingenberg</a>
 */
public class PackageDiscoveryTask implements Runnable
{
    @Inject
    PackageService packageService;

    private RegisteredApplication application;

    /**
     * Sets the application to run discovery on.
     */
    public void setApplication(RegisteredApplication application)
    {
        this.application = application;
    }

    @Override
    public void run()
    {
        this.packageService.discoverPackages(this.application);
    }
}
