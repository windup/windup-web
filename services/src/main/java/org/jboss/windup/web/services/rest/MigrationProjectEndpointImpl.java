package org.jboss.windup.web.services.rest;

import java.util.Collection;
import java.util.logging.Logger;

import javax.ejb.Stateless;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.ws.rs.NotFoundException;

import org.jboss.windup.web.services.model.MigrationProject;

/**
 * @author <a href="http://ondra.zizka.cz/">Ondrej Zizka, zizka@seznam.cz</a>
 */
@Stateless
public class MigrationProjectEndpointImpl implements MigrationProjectEndpoint
{
    private static Logger LOG = Logger.getLogger(MigrationProjectEndpointImpl.class.getSimpleName());

    @PersistenceContext
    private EntityManager entityManager;

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
        LOG.info("Creating a migration project: " + migrationProject.getId());
        entityManager.persist(migrationProject);
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
