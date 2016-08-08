package org.jboss.windup.web.services.rest;

import java.util.Collection;
import java.util.logging.Logger;

import javax.ejb.Stateless;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.validation.Valid;

import org.jboss.windup.web.services.model.ApplicationGroup;
import org.jboss.windup.web.services.model.MigrationProject;

/**
 * Implementation of {@link ApplicationGroupEndpoint}.
 *
 * @author <a href="mailto:jesse.sightler@gmail.com">Jesse Sightler</a>
 */
@Stateless
public class ApplicationGroupEndpointImpl implements ApplicationGroupEndpoint
{
    private static Logger LOG = Logger.getLogger(ApplicationGroupEndpointImpl.class.getName());

    @PersistenceContext
    private EntityManager entityManager;

    @Override
    public Collection<ApplicationGroup> getApplicationGroups()
    {
        return entityManager.createQuery("select ag from " + ApplicationGroup.class.getSimpleName() + " ag").getResultList();
    }

    @Override
    public Collection<ApplicationGroup> getApplicationGroups(Long projectID)
    {
        for (ApplicationGroup group : getApplicationGroups())
        {
            if (group.getMigrationProject() == null)
                LOG.info("Group: " + group + " project: null");
            else
                LOG.info("Group: " + group + " project: " + group.getMigrationProject().getId());
        }

        return entityManager.find(MigrationProject.class, projectID).getGroups();
    }

    @Override
    public ApplicationGroup getApplicationGroup(Long id)
    {
        return entityManager.find(ApplicationGroup.class, id);
    }

    @Override
    public ApplicationGroup create(@Valid ApplicationGroup applicationGroup)
    {
        LOG.info("Creating group: " + applicationGroup + " with project: " + applicationGroup.getMigrationProject());
        entityManager.persist(applicationGroup);
        return entityManager.find(ApplicationGroup.class, applicationGroup.getId());
    }

    @Override
    public ApplicationGroup update(@Valid ApplicationGroup applicationGroup)
    {
        return entityManager.merge(applicationGroup);
    }

    @Override
    public void delete(ApplicationGroup applicationGroup)
    {
        entityManager.remove(applicationGroup);
    }
}
