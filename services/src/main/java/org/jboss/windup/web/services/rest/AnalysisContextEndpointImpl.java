package org.jboss.windup.web.services.rest;

import java.util.logging.Logger;
import javax.ejb.Stateless;
import javax.inject.Inject;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.validation.Valid;
import javax.ws.rs.NotFoundException;

import org.jboss.windup.web.services.model.AnalysisContext;
import org.jboss.windup.web.services.model.MigrationProject;
import org.jboss.windup.web.services.service.AnalysisContextService;
import org.jboss.windup.web.services.service.MigrationProjectService;

/**
 * @author <a href="mailto:jesse.sightler@gmail.com">Jesse Sightler</a>
 * @author <a href="http://ondra.zizka.cz/">Ondrej Zizka, zizka@seznam.cz</a>
 */
@Stateless
public class AnalysisContextEndpointImpl implements AnalysisContextEndpoint
{
    private static final Logger LOG = Logger.getLogger(AnalysisContextEndpointImpl.class.getName());

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
            throw new NotFoundException("AnalysisContext with id" + id + "not found");
        return context;
    }

    @Override
    public AnalysisContext updateDefaultConfigForProject(@Valid AnalysisContext ctx, Long projectId)
    {
        LOG.info("Storing default config for project #" + projectId + ": " + ctx);
        MigrationProject project = this.migrationProjectService.getMigrationProject(projectId);
        AnalysisContext defaultAC = this.analysisContextService.getDefaultProjectAnalysisContext(projectId);

        defaultAC.setAdvancedOptions(ctx.getAdvancedOptions());
        defaultAC.setApplications(ctx.getApplications());
        defaultAC.setExcludePackages(ctx.getExcludePackages());
        defaultAC.setGenerateStaticReports(ctx.getGenerateStaticReports());
        defaultAC.setIncludePackages(ctx.getIncludePackages());
        defaultAC.setMigrationPath(ctx.getMigrationPath());
        defaultAC.setRulesPaths(ctx.getRulesPaths());

        analysisContextService.update(ctx);
        return defaultAC;
    }

}
