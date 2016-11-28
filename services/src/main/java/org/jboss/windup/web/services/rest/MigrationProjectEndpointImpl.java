package org.jboss.windup.web.services.rest;

import java.util.Collection;
import java.util.logging.Logger;

import javax.ejb.Stateful;
import javax.inject.Inject;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.PersistenceContextType;
import javax.ws.rs.NotFoundException;

import org.jboss.windup.web.addons.websupport.WebPathUtil;
import org.jboss.windup.web.furnaceserviceprovider.FromFurnace;
import org.jboss.windup.web.services.model.ApplicationGroup;
import org.jboss.windup.web.services.model.MigrationProject;
import org.jboss.windup.web.services.model.PackageMetadata;

/**
 * @author <a href="http://ondra.zizka.cz/">Ondrej Zizka, zizka@seznam.cz</a>
 */
@Stateful
public class MigrationProjectEndpointImpl implements MigrationProjectEndpoint
{
    private static Logger LOG = Logger.getLogger(MigrationProjectEndpointImpl.class.getSimpleName());

    @PersistenceContext(type = PersistenceContextType.EXTENDED)
    private EntityManager entityManager;

    @Inject
    @FromFurnace
    private WebPathUtil webPathUtil;

    @Override
    public Collection<MigrationProject> getMigrationProjects()
    {
        return entityManager.createQuery("select mp from " + MigrationProject.class.getSimpleName() + " mp").getResultList();
    }

    @Override
    public MigrationProject getMigrationProject(Long id)
    {
        MigrationProject result = entityManager.find(MigrationProject.class, id);
        if (result == null)
            throw new NotFoundException("MigrationProject with id: " + id + " not found!");
        return result;
    }

    @Override
    public MigrationProject createMigrationProject(MigrationProject migrationProject)
    {
        if (migrationProject.getId() != null)
        {
            migrationProject.setId(null); // creating new project, should not have id set
        }

        entityManager.persist(migrationProject);

        LOG.info("Creating a migration project: " + migrationProject.getId());
        ApplicationGroup defaultGroup = new ApplicationGroup();
        defaultGroup.setTitle(ApplicationGroup.DEFAULT_NAME);
        defaultGroup.setMigrationProject(migrationProject);
        defaultGroup.setReadOnly(true);

        entityManager.persist(defaultGroup);

        defaultGroup.setOutputPath(webPathUtil.createWindupReportOutputPath(
                    migrationProject.getId().toString(),
                    defaultGroup.getId().toString(),
                    ApplicationGroup.DEFAULT_NAME).toString());

        PackageMetadata packageMetadata = new PackageMetadata();
        entityManager.persist(packageMetadata);

        defaultGroup.setPackageMetadata(packageMetadata);
        entityManager.merge(defaultGroup);

        entityManager.merge(migrationProject);

        return migrationProject;
    }

    @Override
    public MigrationProject updateMigrationProject(MigrationProject migrationProject)
    {
        return entityManager.merge(migrationProject);
    }

    @Override
    public void deleteProject(MigrationProject migrationProject)
    {
        entityManager.remove(migrationProject);
    }
}
