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
import org.jboss.windup.web.services.service.MigrationProjectService;

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

    @Inject
    private MigrationProjectService migrationProjectService;

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

    @Override
    public AnalysisContext create(@Valid AnalysisContext analysisContext, Long projectId)
    {
        MigrationProject project = this.migrationProjectService.getMigrationProject(projectId);

        if (project.getDefaultAnalysisContext() != null)
        {
            throw new BadRequestException("Project already has default AnalysisContext");
        }

        analysisContext.setMigrationProject(project);
        analysisContext = analysisContextService.create(analysisContext);

        project.setDefaultAnalysisContext(analysisContext);
        this.entityManager.persist(project);

        return analysisContext;
    }

    @Override
    public AnalysisContext update(Long id, @Valid AnalysisContext analysisContext)
    {
        return analysisContextService.update(analysisContext);
    }
}
