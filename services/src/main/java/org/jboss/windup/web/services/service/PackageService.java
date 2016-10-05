package org.jboss.windup.web.services.service;

import org.jboss.windup.web.services.model.RegisteredApplication;

import javax.ejb.Singleton;
import javax.ejb.Stateless;
import javax.inject.Inject;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import org.jboss.windup.rules.apps.java.scan.operation.packagemapping.PackageNameMappingRegistry;
import org.jboss.windup.web.furnaceserviceprovider.FromFurnace;

/**
 * @author <a href="mailto:dklingenberg@gmail.com">David Klingenberg</a>
 */
@Singleton
@Stateless
public class PackageService
{
    @PersistenceContext
    private EntityManager entityManager;

    @Inject
    @FromFurnace
    private PackageNameMappingRegistry packageNameMappingRegistry;

    public void discoverPackages(RegisteredApplication application)
    {
        String inputPath = application.getInputPath();
        PackageDiscoveryService discoveryService = new PackageDiscoveryService(packageNameMappingRegistry, inputPath);
        discoveryService.run();
    }
}
