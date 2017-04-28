package org.jboss.windup.web.services.rest;

import java.util.ArrayList;
import java.util.List;
import java.util.logging.Level;
import java.util.logging.Logger;
import java.util.stream.Collectors;

import javax.ejb.Stateful;
import javax.ejb.TransactionAttribute;
import javax.ejb.TransactionAttributeType;
import javax.inject.Inject;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.PersistenceContextType;
import javax.validation.ValidationException;
import javax.ws.rs.NotFoundException;

import org.jboss.windup.util.exception.WindupException;
import org.jboss.windup.web.addons.websupport.WebPathUtil;
import org.jboss.windup.web.furnaceserviceprovider.FromFurnace;
import org.jboss.windup.web.services.model.ExecutionState;
import org.jboss.windup.web.services.model.MigrationProject;
import org.jboss.windup.web.services.model.WindupExecution;
import org.jboss.windup.web.services.service.AnalysisContextService;
import org.jboss.windup.web.services.service.MigrationProjectService;
import org.jboss.windup.web.services.service.WindupExecutionService;

/**
 * @author <a href="http://ondra.zizka.cz/">Ondrej Zizka, zizka@seznam.cz</a>
 */
@Stateful
public class MigrationProjectEndpointImpl implements MigrationProjectEndpoint
{
    private static Logger LOG = Logger.getLogger(MigrationProjectEndpointImpl.class.getSimpleName());

    @PersistenceContext(type = PersistenceContextType.EXTENDED)
    private EntityManager entityManager;

    @Inject
    private MigrationProjectService migrationProjectService;

    @Inject
    private AnalysisContextService analysisContextService;

    @Inject
    private WindupExecutionService windupExecutionService;

    @Inject
    @FromFurnace
    private WebPathUtil webPathUtil;

    @Override
    public List<MigrationProjectAndAppCount> getMigrationProjects()
    {
        try
        {
            final String query =
                    "SELECT project, COUNT(DISTINCT app) AS appCount "
                    + "\n FROM " + MigrationProject.class.getSimpleName() + " AS project "
                    + "\n LEFT JOIN project.applications AS app "
                    + "\n WHERE project.provisional = FALSE"
                    + "\n GROUP BY project.id";

            List<Object[]> entries = entityManager.createQuery(query, Object[].class).getResultList();
            return new ArrayList<>(entries.stream().map(e -> new MigrationProjectAndAppCount((MigrationProject) e[0], (long) e[1]))
                        .collect(Collectors.toList()));
        }
        catch (Exception ex)
        {
            LOG.log(Level.SEVERE, ex.getMessage(), ex);
            throw new WindupException(ex.getMessage(), ex);
        }
    }

    @Override
    public MigrationProject getMigrationProject(Long id)
    {
        MigrationProject result = entityManager.find(MigrationProject.class, id);
        if (result == null)
            throw new NotFoundException("MigrationProject with id: " + id + " not found!");
        return result;
    }

    @Override
    public MigrationProject createMigrationProject(MigrationProject migrationProject)
    {
        if (null != getProjectIdByName(migrationProject.getTitle()))
            throw new ValidationException("The project name is already in use: " + migrationProject.getTitle());

        migrationProject = this.migrationProjectService.createProject(migrationProject);
        LOG.info("Creating a migration project: " + migrationProject.getId());

        return migrationProject;
    }

    @Override
    public MigrationProject updateMigrationProject(MigrationProject migrationProject)
    {
        Long otherProjectID = getProjectIdByName(migrationProject.getTitle());
        if (otherProjectID != null && !otherProjectID.equals(migrationProject.getId()))
            throw new ValidationException("The project name is already in use: " + migrationProject.getTitle());

        return entityManager.merge(migrationProject);
    }

    @Override
    @TransactionAttribute(TransactionAttributeType.NOT_SUPPORTED)
    public void deleteProject(MigrationProject migrationProject)
    {
        MigrationProject project = this.getMigrationProject(migrationProject.getId());

        List<WindupExecution> pendingExecutions = new ArrayList<>();
        for (WindupExecution execution : project.getExecutions())
        {
            switch (execution.getState())
            {
            case QUEUED:
            case STARTED:
                this.windupExecutionService.cancelExecution(execution.getId());

                pendingExecutions.add(execution);
                break;
            }
        }

        waitOnPendingExecutions(pendingExecutions);

        this.migrationProjectService.deleteProject(project);
    }

    private void waitOnPendingExecutions(List<WindupExecution> pendingExecutions) {
        // Silly little hack to make sure that we don't proceed until executions are
        // at least in the cancelled state.
        pendingExecutions.forEach(execution -> {
            while (!isFinished(execution)) {
                try {
                    Thread.sleep(100);
                } catch (Exception e) {
                    return;
                }
            }

        });
    }

    @TransactionAttribute(TransactionAttributeType.REQUIRES_NEW)
    private boolean isFinished(WindupExecution execution)
    {
        WindupExecution reloaded = this.windupExecutionService.get(execution.getId());
        LOG.info("Is cancelled? " + reloaded.getState());
        return reloaded.getState() != ExecutionState.QUEUED && reloaded.getState() != ExecutionState.STARTED;
    }

    @Override
    public void deleteOldProvisionalProjects()
    {
        this.migrationProjectService.deleteOldProvisionalProjects(180);
    }

    @Override
    public Long getProjectIdByName(String title)
    {
        String jql = "SELECT p.id FROM MigrationProject p WHERE LOWER(p.title) = LOWER(:title) AND p.provisional = FALSE";
        List<Long> ids = this.entityManager.createQuery(jql, Long.class)
                    .setParameter("title", title)
                    .getResultList();
        return ids.isEmpty() ? null : ids.get(0);
    }
}
