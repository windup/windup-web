package org.jboss.windup.web.services.service;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.Map;

import javax.ejb.Singleton;
import javax.ejb.Stateless;
import javax.inject.Inject;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;

import org.jboss.forge.furnace.Furnace;
import org.jboss.windup.rules.apps.java.scan.operation.packagemapping.PackageNameMappingRegistry;
import org.jboss.windup.web.furnaceserviceprovider.FromFurnace;
import org.jboss.windup.web.services.model.Package;
import org.jboss.windup.web.services.model.RegisteredApplication;
import org.jboss.windup.web.addons.websupport.services.PackageDiscoveryService;

/**
 * @author <a href="mailto:dklingenberg@gmail.com">David Klingenberg</a>
 */
public class PackageServiceNew
{
    @PersistenceContext
    private EntityManager entityManager;

    @Inject
    private Furnace furnace;

    @Inject
    private PackageDiscoveryService packageDiscoveryService;
/*
    //private PackageNameMappingRegistry packageNameMappingRegistry = null;

    private PackageNameMappingRegistry getPackageNameMappingRegistry()
    {
        return this.furnace.getAddonRegistry().getServices(PackageNameMappingRegistry.class).get();
/*
        if (this.packageNameMappingRegistry == null) {
            this.packageNameMappingRegistry = this.furnace.getAddonRegistry().getServices(PackageNameMappingRegistry.class).get();
        }

        return this.packageNameMappingRegistry;

    }
*/
    public Collection<Package> discoverPackages(RegisteredApplication application)
    {
        List<Package> packages = new ArrayList<>();

        String inputPath = application.getInputPath();
        //PackageDiscoveryService discoveryService = new PackageDiscoveryService(this.getPackageNameMappingRegistry(), inputPath);
        this.packageDiscoveryService.execute(inputPath);

        Map<String, Integer> packagesWithUsage = this.packageDiscoveryService.getKnownPackages();

        for (String packageName : packagesWithUsage.keySet())
        {
            Package item = new Package(packageName);
            packages.add(item);
        }

        return packages;
    }
}
