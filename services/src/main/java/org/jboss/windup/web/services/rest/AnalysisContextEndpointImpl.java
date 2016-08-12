package org.jboss.windup.web.services.rest;

import javax.ejb.Stateless;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.validation.Valid;

import org.jboss.windup.web.services.model.AnalysisContext;

/**
 * @author <a href="mailto:jesse.sightler@gmail.com">Jesse Sightler</a>
 */
@Stateless
public class AnalysisContextEndpointImpl implements AnalysisContextEndpoint
{
    @PersistenceContext
    private EntityManager entityManager;

    @Override
    public AnalysisContext get(Long id)
    {
        return entityManager.find(AnalysisContext.class, id);
    }

    @Override
    public AnalysisContext create(@Valid AnalysisContext analysisContext)
    {
        entityManager.persist(analysisContext);
        return analysisContext;
    }

    @Override
    public AnalysisContext update(@Valid AnalysisContext analysisContext)
    {
        return entityManager.merge(analysisContext);
    }
}
