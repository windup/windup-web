package org.jboss.windup.web.services.service;

import java.util.Collection;
import java.util.Map;
import java.util.TreeMap;

import javax.inject.Inject;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.transaction.Transactional;

import org.jboss.forge.furnace.Furnace;
import org.jboss.windup.web.addons.websupport.WebPathUtil;
import org.jboss.windup.web.addons.websupport.services.PackageDiscoveryService;
import org.jboss.windup.web.furnaceserviceprovider.FromFurnace;
import org.jboss.windup.web.furnaceserviceprovider.WebProperties;
import org.jboss.windup.web.services.model.ApplicationGroup;
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
    PackageDiscoveryService packageDiscoveryService;

    /**
     * Discovers packages in application
     *
     * @param application Application to discover packages in
     * @return Collection of discovered packages
     */
    @Transactional
    public Collection<Package> discoverPackages(RegisteredApplication application)
    {
        PackageMetadata metadata = application.getPackageMetadata();
        metadata.setScanStatus(PackageMetadata.ScanStatus.IN_PROGRESS);
        this.entityManager.merge(metadata);

        ApplicationGroup appGroup = application.getApplicationGroup();
        PackageMetadata appGroupMetadata = appGroup.getPackageMetadata();
        appGroupMetadata.setScanStatus(PackageMetadata.ScanStatus.IN_PROGRESS);
        this.entityManager.merge(appGroupMetadata);

        String rulesPath = WebProperties.getInstance().getRulesRepository().toString();
        String inputPath = application.getInputPath();
        PackageDiscoveryService.PackageDiscoveryResult result = this.packageDiscoveryService.execute(rulesPath, inputPath);

        Map<String, Package> packageMap = new TreeMap<>();
        appGroupMetadata.getPackages().forEach(aPackage -> packageMap.put(aPackage.getFullName(), aPackage));

        this.addPackagesToPackageMetadata(metadata, result.getKnownPackages(), packageMap);
        this.addPackagesToPackageMetadata(metadata, result.getUnknownPackages(), packageMap);

        this.addPackagesToPackageMetadata(appGroupMetadata, result.getKnownPackages(), packageMap);
        this.addPackagesToPackageMetadata(appGroupMetadata, result.getUnknownPackages(), packageMap);

        metadata.setScanStatus(PackageMetadata.ScanStatus.COMPLETE);
        this.entityManager.merge(metadata);

        PackageMetadata.ScanStatus finalStatus = appGroup.getApplications().stream()
                    .map(app -> app.getPackageMetadata().getScanStatus())
                    .reduce(PackageMetadata.ScanStatus.COMPLETE,
                                (currentStatus, accumulator) ->
                                        currentStatus == PackageMetadata.ScanStatus.COMPLETE && currentStatus == accumulator ?
                                        PackageMetadata.ScanStatus.COMPLETE :
                                        PackageMetadata.ScanStatus.IN_PROGRESS
                    );

        appGroupMetadata.setScanStatus(finalStatus);
        this.entityManager.merge(appGroupMetadata);

        return metadata.getPackages();
    }

    private void addPackagesToPackageMetadata(PackageMetadata metadata, Map<String, Integer> discoveredPackages, Map<String, Package> packageMap)
    {
        for (String packageName : discoveredPackages.keySet())
        {
            Package aPackage = this.createPackageHierarchy(packageName, discoveredPackages, packageMap);
            metadata.addPackage(aPackage);
        }
    }

    /**
     * Creates package class for whole package hierarchy (including all parents) and returns last child
     * Example: org.jboss.windup will create root org, child jboss, child windup and return windup
     *
     *
     * @param fullPackageName Fully qualified package name
     * @param packageClassCount Map with package name as key and class count as value
     * @param packageMap Map with package name as key and package class as value
     * @return Package
     */
    Package createPackageHierarchy(String fullPackageName, Map<String, Integer> packageClassCount, Map<String, Package> packageMap)
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
