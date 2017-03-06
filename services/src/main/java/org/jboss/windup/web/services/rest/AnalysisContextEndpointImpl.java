package org.jboss.windup.web.services.rest;

import javax.ejb.Stateless;
import javax.inject.Inject;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.validation.Valid;
import javax.ws.rs.BadRequestException;
import javax.ws.rs.NotFoundException;

import org.jboss.windup.web.services.model.AnalysisContext;
import org.jboss.windup.web.services.model.MigrationProject;
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

    protected boolean validateMigrationProject(MigrationProject project)
    {
        if (project == null || project.getId() == null)
        {
            return false;
        }

        MigrationProject persistedProject = this.entityManager.find(MigrationProject.class, project.getId());

        return persistedProject != null;
    }

    @Override
    public AnalysisContext create(@Valid AnalysisContext analysisContext)
    {
        if (!this.validateMigrationProject(analysisContext.getMigrationProject()))
        {
            throw new BadRequestException("Invalid migration project");
        }

        return analysisContextService.create(analysisContext);
    }

    @Override
    public AnalysisContext update(@Valid AnalysisContext analysisContext)
    {
        return analysisContextService.update(analysisContext);
    }
}
