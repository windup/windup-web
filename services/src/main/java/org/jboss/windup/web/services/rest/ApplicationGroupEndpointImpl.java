package org.jboss.windup.web.services.rest;

import java.nio.file.Path;
import java.util.Collection;
import java.util.logging.Logger;
import java.io.File;

import javax.ejb.Stateful;
import javax.inject.Inject;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.PersistenceContextType;
import javax.validation.Valid;
import javax.ws.rs.BadRequestException;
import javax.ws.rs.NotFoundException;

import org.jboss.windup.web.addons.websupport.WebPathUtil;
import org.jboss.windup.web.furnaceserviceprovider.FromFurnace;
import org.jboss.windup.web.services.model.AnalysisContext;
import org.jboss.windup.web.services.model.ApplicationGroup;
import org.jboss.windup.web.services.model.MigrationProject;
import org.jboss.windup.web.services.model.PackageMetadata;
import org.jboss.windup.web.services.model.ReportFilter;
import org.jboss.windup.web.services.service.ApplicationGroupService;
import org.jboss.windup.web.services.service.AnalysisContextService;
import org.jboss.windup.web.services.service.PackageService;

/**
 * Implementation of {@link ApplicationGroupEndpoint}.
 *
 * @author <a href="mailto:jesse.sightler@gmail.com">Jesse Sightler</a>
 */
@Stateful
public class ApplicationGroupEndpointImpl implements ApplicationGroupEndpoint
{
    private static Logger LOG = Logger.getLogger(ApplicationGroupEndpointImpl.class.getName());

    @PersistenceContext(type = PersistenceContextType.EXTENDED)
    private EntityManager entityManager;

    @Inject
    private ApplicationGroupService applicationGroupService;

    @Inject
    private PackageService packageServiceNew;

    @Inject
    private AnalysisContextService analysisContextService;

    @Inject
    @FromFurnace
    private WebPathUtil webPathUtil;

    @Override
    public Collection<ApplicationGroup> getApplicationGroups()
    {
        return entityManager.createQuery("select ag from " + ApplicationGroup.class.getSimpleName() + " ag").getResultList();
    }

    @Override
    public Collection<ApplicationGroup> getApplicationGroups(Long projectID)
    {
        final MigrationProject project = entityManager.find(MigrationProject.class, projectID);
        if (project == null)
            throw new NotFoundException("MigrationProject not found, ID:  " + projectID);
        return project.getGroups();
    }

    @Override
    public ApplicationGroup getApplicationGroup(Long id)
    {
        return this.applicationGroupService.getApplicationGroup(id);
    }

    protected MigrationProject getMigrationProject(ApplicationGroup applicationGroup)
    {
        MigrationProject project = applicationGroup.getMigrationProject();

        if (project != null && project.getId() != null)
        {
            return this.entityManager.find(MigrationProject.class, project.getId());
        }
        else
        {
            return null;
        }
    }

    @Override
    public ApplicationGroup create(@Valid ApplicationGroup applicationGroup)
    {
        LOG.info("Creating group: " + applicationGroup + " with project: " + applicationGroup.getMigrationProject());

        MigrationProject migrationProject = this.getMigrationProject(applicationGroup);

        if (migrationProject == null)
        {
            throw new BadRequestException("Invalid MigrationProject");
        }

        return this.applicationGroupService.createApplicationGroup(applicationGroup.getTitle(), migrationProject);
    }

    @Override
    public ApplicationGroup update(@Valid ApplicationGroup applicationGroup)
    {
        return this.applicationGroupService.update(applicationGroup);
    }

    @Override
    public void delete(ApplicationGroup applicationGroup)
    {
        ApplicationGroup group = this.getApplicationGroup(applicationGroup.getId());
        entityManager.remove(group);

        File groupDir = new File(group.getOutputPath());

        if (groupDir.exists())
        {
            groupDir.delete();
        }
    }

    @Override
    public PackageMetadata getPackages(long id)
    {
        ApplicationGroup group = this.getApplicationGroup(id);

        return group.getPackageMetadata();
    }
}
