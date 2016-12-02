package org.jboss.windup.web.services.rest;

import javax.ejb.Stateless;
import javax.inject.Inject;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.validation.Valid;
import javax.ws.rs.BadRequestException;
import javax.ws.rs.NotFoundException;

import org.jboss.windup.web.services.model.AnalysisContext;
import org.jboss.windup.web.services.model.ApplicationGroup;
import org.jboss.windup.web.services.service.AnalysisContextService;

/**
 * @author <a href="mailto:jesse.sightler@gmail.com">Jesse Sightler</a>
 */
@Stateless
public class AnalysisContextEndpointImpl implements AnalysisContextEndpoint
{
    @PersistenceContext
    private EntityManager entityManager;

    @Inject
    private AnalysisContextService analysisContextService;

    @Override
    public AnalysisContext get(Long id)
    {
        AnalysisContext context = entityManager.find(AnalysisContext.class, id);

        if (context == null)
        {
            throw new NotFoundException("AnalysisContext with id" + id + "not found");
        }

        return context;
    }

    protected boolean validateApplicationGroup(ApplicationGroup applicationGroup)
    {
        if (applicationGroup == null || applicationGroup.getId() == null) {
            return false;
        }

        ApplicationGroup persistedAppGroup = this.entityManager.find(ApplicationGroup.class, applicationGroup.getId());

        return persistedAppGroup != null;
    }

    @Override
    public AnalysisContext create(@Valid AnalysisContext analysisContext)
    {
        if (!this.validateApplicationGroup(analysisContext.getApplicationGroup())) {
            throw new BadRequestException("Invalid application group");
        }

        return analysisContextService.create(analysisContext);
    }

    @Override
    public AnalysisContext update(@Valid AnalysisContext analysisContext)
    {
        return analysisContextService.update(analysisContext);
    }
}
