package org.jboss.windup.web.services.rest;

import java.util.List;

import org.jboss.windup.web.services.model.RuleProviderEntity;

import javax.ejb.Stateless;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;

/**
 * @author <a href="mailto:jesse.sightler@gmail.com">Jesse Sightler</a>
 */
@Stateless
public class RuleEndpointImpl implements RuleEndpoint
{
    @PersistenceContext
    private EntityManager entityManager;

    @Override
    public List<RuleProviderEntity> getAllProviders()
    {
        return entityManager.createNamedQuery(RuleProviderEntity.FIND_ALL).getResultList();
    }
}
