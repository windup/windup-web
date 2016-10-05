package org.jboss.windup.web.services.service;

import java.util.Collection;
import java.util.Map;
import java.util.TreeMap;

import javax.inject.Inject;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;

import org.jboss.forge.furnace.Furnace;
import org.jboss.windup.web.addons.websupport.services.PackageDiscoveryService;
import org.jboss.windup.web.furnaceserviceprovider.FromFurnace;
import org.jboss.windup.web.services.model.Package;
import org.jboss.windup.web.services.model.PackageMetadata;
import org.jboss.windup.web.services.model.RegisteredApplication;

/**
 * Service for manipulation with packages
 *
 * @author <a href="mailto:dklingenberg@gmail.com">David Klingenberg</a>
 */
public class PackageService
{
    @PersistenceContext
    EntityManager entityManager;

    @Inject
    private Furnace furnace;

    @Inject
    @FromFurnace
    private PackageDiscoveryService packageDiscoveryService;

    /**
     * Discovers packages in application
     *
     * @param application Application to discover packages in
     * @return Collection of discovered packages
     */
    public Collection<Package> discoverPackages(RegisteredApplication application)
    {
        PackageMetadata metadata = application.getPackageMetadata();
        metadata.setScanStatus(PackageMetadata.ScanStatus.IN_PROGRESS);
        this.entityManager.merge(metadata);

        String inputPath = application.getInputPath();
        PackageDiscoveryService.PackageDiscoveryResult result = this.packageDiscoveryService.execute(inputPath);

        Map<String, Package> packageMap = new TreeMap<>();

        this.addPackagesToPackageMetadata(metadata, result.getKnownPackages(), packageMap);
        this.addPackagesToPackageMetadata(metadata, result.getUnknownPackages(), packageMap);

        metadata.setScanStatus(PackageMetadata.ScanStatus.COMPLETE);
        this.entityManager.merge(metadata);

        return metadata.getPackages();
    }

    private void addPackagesToPackageMetadata(PackageMetadata metadata, Map<String, Integer> discoveredPackages, Map<String, Package> packageMap)
    {
        for (String packageName : discoveredPackages.keySet())
        {
            Package aPackage = this.createPackage(packageName, discoveredPackages, packageMap);
            metadata.addPackage(aPackage);
        }
    }

    Package createPackage(String fullPackageName, Map<String, Integer> packageClassCount, Map<String, Package> packageMap)
    {
        Package parent = null;

        StringBuilder currentPackageName = new StringBuilder();

        String[] nameParts = fullPackageName.split("\\.");

        for (String singlePartName : nameParts)
        {
            currentPackageName.append(singlePartName);
            String currentPackageNameString = currentPackageName.toString();

            if (!packageMap.containsKey(currentPackageNameString))
            {
                Package pkage = new Package(singlePartName, currentPackageNameString);
                pkage.setCountClasses(packageClassCount.get(currentPackageNameString));

                pkage.setParent(parent);
                this.entityManager.persist(pkage);

                if (parent != null)
                {
                    parent.addChild(pkage);
                    this.entityManager.merge(parent);
                }

                packageMap.put(currentPackageNameString, pkage);

                parent = pkage;
            }
            else
            {
                parent = packageMap.get(currentPackageNameString);
            }

            currentPackageName.append(".");
        }

        return parent;
    }
}
