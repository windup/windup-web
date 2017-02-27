package org.jboss.windup.web.services.service;

import org.jboss.windup.web.addons.websupport.WebPathUtil;
import org.jboss.windup.web.furnaceserviceprovider.FromFurnace;
import org.jboss.windup.web.services.model.AnalysisContext;
import org.jboss.windup.web.services.model.ApplicationGroup;
import org.jboss.windup.web.services.model.FilterApplication;
import org.jboss.windup.web.services.model.MigrationProject;
import org.jboss.windup.web.services.model.Package;
import org.jboss.windup.web.services.model.PackageMetadata;
import org.jboss.windup.web.services.model.RegisteredApplication;
import org.jboss.windup.web.services.model.ReportFilter;

import javax.inject.Inject;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.ws.rs.BadRequestException;
import javax.ws.rs.NotFoundException;
import java.nio.file.Path;
import java.util.Collection;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;
import java.util.Objects;
import java.util.Set;
import java.util.logging.Logger;
import java.util.stream.Collectors;
import java.util.stream.Stream;
import org.jboss.windup.util.exception.WindupException;

/**
 * @author <a href="mailto:dklingenberg@gmail.com">David Klingenberg</a>
 */
public class ApplicationGroupService
{
    private static final Logger LOG = Logger.getLogger(ApplicationGroupService.class.getName());

    @PersistenceContext
    private EntityManager entityManager;

    @Inject
    private AnalysisContextService analysisContextService;

    @Inject
    @FromFurnace
    WebPathUtil webPathUtil;

    public ApplicationGroup getApplicationGroup(Long groupID)
    {
        ApplicationGroup applicationGroup = this.entityManager.find(ApplicationGroup.class, groupID);

        if (applicationGroup == null)
        {
            throw new NotFoundException("ApplicationGroup with id: " + groupID + " not found");
        }

        return applicationGroup;
    }

    public ApplicationGroup createApplicationGroup(String title, MigrationProject project)
    {
        ApplicationGroup applicationGroup = new ApplicationGroup(project);
        applicationGroup.setTitle(title);
        applicationGroup.setReportFilter(new ReportFilter(applicationGroup));
        applicationGroup.setPackageMetadata(new PackageMetadata());

        entityManager.persist(applicationGroup);

        AnalysisContext analysisContext = this.analysisContextService.createDefaultAnalysisContext(applicationGroup);
        applicationGroup.setAnalysisContext(analysisContext);

        Path outputPath = webPathUtil.createApplicationGroupPath(
                applicationGroup.getMigrationProject().getId().toString(),
                applicationGroup.getId().toString());

        applicationGroup.setOutputPath(outputPath.toAbsolutePath().toString());

        project.addGroup(applicationGroup);

        entityManager.merge(applicationGroup);

        return entityManager.find(ApplicationGroup.class, applicationGroup.getId());
    }

    public ApplicationGroup createDefaultApplicationGroup(MigrationProject project)
    {
        return this.createApplicationGroup(ApplicationGroup.DEFAULT_NAME, project);
    }

    public ApplicationGroup update(ApplicationGroup updatedGroupDTO)
    {
        if (updatedGroupDTO.getId() == null)
            throw new WindupException("Group ID is null.");

        ApplicationGroup original = this.entityManager.find(ApplicationGroup.class, updatedGroupDTO.getId());
        original.setTitle(updatedGroupDTO.getTitle());
        this.setIncludedApplications(original, updatedGroupDTO.getApplications());

        this.entityManager.merge(original);
        return original;
    }

    private ApplicationGroup setIncludedApplications(ApplicationGroup group, Collection<RegisteredApplication> newApplicationSet)
    {
        Set<Long> includedApplicationIds = newApplicationSet.stream()
                .map(RegisteredApplication::getId)
                .collect(Collectors.toSet());
        LOG.fine("Updating App Group #" + group.getId() + ", includedApplicationIds: " + String.join(", ", includedApplicationIds.stream().map((id) -> "" + id).collect(Collectors.toList())));

        Collection<RegisteredApplication> applications = this.getAllApplicationsByIds(includedApplicationIds);
        group.setApplications(new HashSet<>(applications));
        applications.forEach(application -> {
            application.addApplicationGroup(group);
            this.entityManager.merge(application);
        });

        this.updatePackageMetadata(group, applications);

        return group;
    }

    protected PackageMetadata updatePackageMetadata(ApplicationGroup group, Collection<RegisteredApplication> applications)
    {
        PackageMetadata packageMetadata = group.getPackageMetadata();

        packageMetadata.getPackages().clear();

        Collection<PackageMetadata> applicationsPackageMetadata = applications.stream()
                .map(RegisteredApplication::getPackageMetadata)
                .filter(Objects::nonNull)
                .collect(Collectors.toList());

        Collection<Package> appsPackages = applicationsPackageMetadata.stream()
                .filter(appPackageMetadata -> appPackageMetadata.getScanStatus() == PackageMetadata.ScanStatus.COMPLETE)
                .flatMap(appPackageMetadata-> appPackageMetadata.getPackages().stream())
                .collect(Collectors.toList());

        Collection<Package> groupPackages = this.mergePackageTrees(null, appsPackages, new HashMap<>());

        packageMetadata.setPackages(groupPackages);

        PackageMetadata.ScanStatus finalStatus = applicationsPackageMetadata.stream()
                .map(PackageMetadata::getScanStatus)
                .reduce(PackageMetadata.ScanStatus.COMPLETE,
                        (currentStatus, accumulator) -> currentStatus == PackageMetadata.ScanStatus.COMPLETE && currentStatus == accumulator
                                ? PackageMetadata.ScanStatus.COMPLETE : PackageMetadata.ScanStatus.IN_PROGRESS);

        packageMetadata.setScanStatus(finalStatus);

        this.entityManager.merge(packageMetadata);

        return packageMetadata;
    }

    protected Collection<Package> mergePackageTrees(Package parent, Collection<Package> rootPackages, Map<String, Package> packageMap)
    {
        Set<Package> result = new HashSet<>();

        rootPackages.forEach(aPackage -> {
            if (!packageMap.containsKey(aPackage.getFullName())) {
                Package packageCopy = new Package(aPackage.getName(), aPackage.getFullName());
                packageMap.put(aPackage.getFullName(), packageCopy);

                packageCopy.setParent(parent);
                this.entityManager.persist(packageCopy);

                if (parent != null)
                {
                    parent.addChild(aPackage);
                    this.entityManager.persist(parent);
                }

                this.mergePackageTrees(packageCopy, aPackage.getChilds(), packageMap);
            }

            result.add(packageMap.get(aPackage.getFullName()));
        });

        return result;
    }

    Collection<RegisteredApplication> getAllApplicationsByIds(Set<Long> ids)
    {
        return entityManager
                .createQuery("select a from RegisteredApplication a WHERE a.id IN (:ids)", RegisteredApplication.class)
                .setParameter("ids", ids)
                .getResultList();
    }
}
