package org.jboss.windup.web.services.rest;

import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Collection;
import java.util.logging.Logger;

import javax.ejb.Stateless;
import javax.inject.Inject;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;

import org.apache.commons.lang.RandomStringUtils;
import org.jboss.windup.web.addons.websupport.WebPathUtil;
import org.jboss.windup.web.furnaceserviceprovider.FromFurnace;
import org.jboss.windup.web.services.model.RegisteredApplication;

/**
 * @author <a href="mailto:jesse.sightler@gmail.com">Jesse Sightler</a>
 */

@Stateless
public class RegisteredApplicationEndpointImpl implements RegisteredApplicationEndpoint
{
    private static Logger LOG = Logger.getLogger(RegisteredApplicationEndpointImpl.class.getSimpleName());

    @Inject @FromFurnace
    private WebPathUtil webPathUtil;

    @PersistenceContext
    private EntityManager entityManager;

    @Override
    @SuppressWarnings("unchecked")
    public Collection<RegisteredApplication> getRegisteredApplications()
    {
        return entityManager.createQuery("select app from " + RegisteredApplication.class.getSimpleName() + " app").getResultList();
    }

    @Override
    public RegisteredApplication registerApplication(RegisteredApplication application)
    {
        String filename = Paths.get(application.getInputPath()).getFileName().toString();
        Path outputPath = webPathUtil.createWindupReportOutputPath(filename);
        application.setOutputPath(outputPath.toAbsolutePath().toString());
        LOG.info("Registering an application at: " + application.getInputPath() + " with output directory: " + outputPath);

        entityManager.persist(application);
        return application;
    }

    @Override
    public void unregisterApplication(RegisteredApplication application)
    {
        entityManager.remove(application);
    }
}
