package org.jboss.windup.web.services.service;

import java.util.Collection;
import java.util.Map;
import java.util.TreeMap;

import javax.annotation.PostConstruct;
import javax.inject.Inject;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.transaction.Transactional;

import com.esotericsoftware.minlog.Log;
import org.jboss.forge.furnace.Furnace;
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
    private static java.util.logging.Logger LOG = java.util.logging.Logger.getLogger(PackageService.class.getSimpleName());

    @PersistenceContext
    EntityManager entityManager;

    @Inject
    private Furnace furnace;

    @Inject
    @FromFurnace
    PackageDiscoveryService packageDiscoveryService;

    WebProperties webProperties;

    @PostConstruct
    protected void init()
    {
        this.webProperties = WebProperties.getInstance();
    }

    /**
     * Discovers packages in application
     *
     * @param application Application to discover packages in
     * @return Collection of discovered packages
     */
    @Transactional
    public Collection<Package> discoverPackages(RegisteredApplication application)
    {
        Long applicationId = application.getId();
        // Reload it to insure that any lazy loaded fields are still available.
        // Don't reload if the id is null (can happen in tests or with detached instances)
        if (applicationId != null)
            application = this.entityManager.find(RegisteredApplication.class, applicationId);

        PackageMetadata appPackageMetadata = application.getPackageMetadata();
        appPackageMetadata.setScanStatus(PackageMetadata.ScanStatus.IN_PROGRESS);
        this.entityManager.merge(appPackageMetadata);

        String rulesPath = this.webProperties.getRulesRepository().toString();
        String inputPath = application.getInputPath();

        LOG.info("Starting package discovery");

        PackageDiscoveryService.PackageDiscoveryResult result = this.packageDiscoveryService.execute(rulesPath, inputPath);

        LOG.info("Package discovery finished");

        Map<String, Package> appPackageMap = new TreeMap<>();
        appPackageMetadata.getPackages().forEach(aPackage -> appPackageMap.put(aPackage.getFullName(), aPackage));

        // TODO: Remove deleted packages
        this.addPackagesToPackageMetadata(appPackageMetadata, result.getKnownPackages(), appPackageMap);
        this.addPackagesToPackageMetadata(appPackageMetadata, result.getUnknownPackages(), appPackageMap);

        appPackageMetadata.setScanStatus(PackageMetadata.ScanStatus.COMPLETE);
        this.entityManager.merge(appPackageMetadata);

        LOG.info("Updated application (id: " + applicationId + ", name: " + application.getTitle() +  ")");

        this.updateAppGroups(application, result);

        return appPackageMetadata.getPackages();
    }

    private void updateAppGroups(RegisteredApplication application, PackageDiscoveryService.PackageDiscoveryResult result)
    {
        LOG.info("Updating " + application.getApplicationGroups().size() + " groups");

        for (ApplicationGroup appGroup : application.getApplicationGroups())
        {
            LOG.info("Updating group: (id: " + appGroup.getId() + ", name: " + appGroup.getTitle() +  ")");

            PackageMetadata appGroupMetadata = appGroup.getPackageMetadata();
            appGroupMetadata.setScanStatus(PackageMetadata.ScanStatus.IN_PROGRESS);
            this.entityManager.merge(appGroupMetadata);

            Map<String, Package> groupPackageMap = new TreeMap<>();
            appGroupMetadata.getPackages().forEach(aPackage -> groupPackageMap.put(aPackage.getFullName(), aPackage));

            // TODO: Remove deleted packages
            this.addPackagesToPackageMetadata(appGroupMetadata, result.getKnownPackages(), groupPackageMap);
            this.addPackagesToPackageMetadata(appGroupMetadata, result.getUnknownPackages(), groupPackageMap);

            PackageMetadata.ScanStatus finalStatus = appGroup.getApplications().stream()
                    .map(app -> app.getPackageMetadata().getScanStatus())
                    .reduce(PackageMetadata.ScanStatus.COMPLETE,
                            (currentStatus, accumulator) -> currentStatus == PackageMetadata.ScanStatus.COMPLETE && currentStatus == accumulator
                                    ? PackageMetadata.ScanStatus.COMPLETE : PackageMetadata.ScanStatus.IN_PROGRESS);

            LOG.info("New group package discovery status: " + finalStatus);
            Log.info("Updating group package metadata (id: " + appGroupMetadata.getId() +" )");
            appGroupMetadata.setScanStatus(finalStatus);
            this.entityManager.merge(appGroupMetadata);
        }
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
     * Creates package class for whole package hierarchy (including all parents) and returns last child Example: org.jboss.windup will create root
     * org, child jboss, child windup and return windup
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

                if (packageClassCount.containsKey(currentPackageNameString))
                {
                    pkage.setCountClasses(packageClassCount.get(currentPackageNameString));
                }
                else
                {
                    pkage.setCountClasses(0);
                }

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
