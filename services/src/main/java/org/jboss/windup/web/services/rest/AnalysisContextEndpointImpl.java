package org.jboss.windup.web.services.rest;

import org.jboss.windup.web.services.SourceTargetTechnologies;
import org.jboss.windup.web.services.model.AnalysisContext;
import org.jboss.windup.web.services.model.MigrationProject;
import org.jboss.windup.web.services.service.AnalysisContextService;
import org.jboss.windup.web.services.service.MigrationProjectService;
import org.jboss.windup.web.services.service.RulesPathService;

import javax.ejb.Stateless;
import javax.inject.Inject;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.validation.Valid;
import javax.ws.rs.NotFoundException;
import java.util.logging.Logger;
import java.util.stream.Collectors;

/**
 * @author <a href="mailto:jesse.sightler@gmail.com">Jesse Sightler</a>
 */
@Stateless
public class AnalysisContextEndpointImpl implements AnalysisContextEndpoint
{
    private static Logger LOG = Logger.getLogger(AnalysisContextEndpoint.class.getName());

    @PersistenceContext
    private EntityManager entityManager;

    @Inject
    private AnalysisContextService analysisContextService;

    @Inject
    private RulesPathService rulesPathService;

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
    public SourceTargetTechnologies getCustomTechnologies(Long id) {
        AnalysisContext context = entityManager.find(AnalysisContext.class, id);

        if (context == null)
        {
            throw new NotFoundException("AnalysisContext with id" + id + "not found");
        }

        return rulesPathService.getSourceTargetTechnologies(context.getRulesPaths());
    }

    @Override
    public AnalysisContext saveAsProjectDefault(@Valid AnalysisContext analysisContext, Long projectId, boolean skipChangeToProvisional)
    {
        MigrationProject project = this.migrationProjectService.getMigrationProject(projectId);
        analysisContext.setApplications(analysisContext
                    .getApplications().stream()
                    .filter(application -> !application.isDeleted())
                    .collect(Collectors.toSet()));

        if (project.getDefaultAnalysisContext() == null)
        {
            LOG.warning("Project doesn't have default AnalysisContext - something is wrong");

            analysisContext.setMigrationProject(project);
            analysisContext = analysisContextService.create(analysisContext);

            project.setDefaultAnalysisContext(analysisContext);
            this.entityManager.persist(project);
        }
        else
        {
            AnalysisContext defaultAnalysisContext = project.getDefaultAnalysisContext();
            analysisContext = analysisContextService.update(defaultAnalysisContext.getId(), analysisContext, skipChangeToProvisional);
        }

        // Update custom sources/targets
        analysisContextService.addProjectScopedCustomTechnologies(analysisContext);
        analysisContextService.pruneTechnologies(analysisContext);

        this.entityManager.merge(analysisContext);
        return analysisContext;
    }
}
