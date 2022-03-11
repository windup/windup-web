package org.jboss.windup.web.services.rest;

import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.logging.Logger;
import java.util.stream.Collectors;

import javax.ejb.Stateless;
import javax.inject.Inject;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.validation.Valid;
import javax.ws.rs.NotFoundException;

import org.jboss.windup.web.services.RuleProviderRegistryCache_UserProvidedProject;
import org.jboss.windup.web.services.model.AnalysisContext;
import org.jboss.windup.web.services.model.MigrationProject;
import org.jboss.windup.web.services.model.ScopeType;
import org.jboss.windup.web.services.service.AnalysisContextService;
import org.jboss.windup.web.services.service.MigrationProjectService;

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
    private MigrationProjectService migrationProjectService;

    @Inject
    private RuleProviderRegistryCache_UserProvidedProject ruleProviderRegistryCache_userProvidedProject;

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

        //
        List<Path> userRulesPaths = analysisContext.getRulesPaths().stream()
                .filter(rulesPath -> rulesPath.getScopeType().equals(ScopeType.PROJECT))
                .map(rulesPath -> Paths.get(rulesPath.getPath()))
                .collect(Collectors.toList());
        ruleProviderRegistryCache_userProvidedProject.setUserRulesPath(analysisContext, userRulesPaths);
        ruleProviderRegistryCache_userProvidedProject.getRuleProviderRegistry(analysisContext);

        return analysisContext;
    }
}
