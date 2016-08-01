package org.jboss.windup.web.services.rest;

import java.util.Collection;

import javax.ejb.Stateless;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.validation.Valid;

import org.jboss.windup.web.services.model.ApplicationGroup;

/**
 * Implementation of {@link ApplicationGroupEndpoint}.
 *
 * @author <a href="mailto:jesse.sightler@gmail.com">Jesse Sightler</a>
 */
@Stateless
public class ApplicationGroupEndpointImpl implements ApplicationGroupEndpoint
{
    @PersistenceContext
    private EntityManager entityManager;

    @Override
    public Collection<ApplicationGroup> getApplicationGroups()
    {
        return entityManager.createQuery("select ag from " + ApplicationGroup.class.getSimpleName() + " ag").getResultList();
    }

    @Override
    public ApplicationGroup create(@Valid ApplicationGroup applicationGroup)
    {
        entityManager.persist(applicationGroup);
        return applicationGroup;
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
