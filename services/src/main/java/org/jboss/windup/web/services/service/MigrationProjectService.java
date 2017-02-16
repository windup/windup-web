package org.jboss.windup.web.services.service;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.ws.rs.NotFoundException;

import org.jboss.windup.web.services.model.MigrationProject;

/**
 * @author <a href="mailto:dklingenberg@gmail.com">David Klingenberg</a>
 */
public class MigrationProjectService
{
    @PersistenceContext
    private EntityManager entityManager;

    /**
     * Gets migration project
     */
    public MigrationProject getMigrationProject(Long id)
    {
        MigrationProject result = entityManager.find(MigrationProject.class, id);

        if (result == null)
        {
            throw new NotFoundException("MigrationProject with id: " + id + " not found!");
        }

        return result;
    }
}
