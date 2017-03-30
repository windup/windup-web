package org.jboss.windup.web.services.rest;

import java.util.Collection;
import java.nio.file.Path;
import java.util.GregorianCalendar;
import java.util.logging.Logger;

import javax.annotation.Resource;
import javax.ejb.Stateless;
import javax.inject.Inject;
import javax.jms.JMSContext;
import javax.jms.Queue;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.ws.rs.BadRequestException;
import javax.ws.rs.NotFoundException;

import org.jboss.forge.furnace.Furnace;
import org.jboss.windup.util.exception.WindupException;
import org.jboss.windup.web.addons.websupport.WebPathUtil;
import org.jboss.windup.web.furnaceserviceprovider.FromFurnace;
import org.jboss.windup.web.services.messaging.MessagingConstants;
import org.jboss.windup.web.services.model.AnalysisContext;
import org.jboss.windup.web.services.model.ExecutionState;
import org.jboss.windup.web.services.model.MigrationProject;
import org.jboss.windup.web.services.model.WindupExecution;
import org.jboss.windup.web.services.service.AnalysisContextService;
import org.jboss.windup.web.services.service.ConfigurationService;

@Stateless
public class WindupEndpointImpl implements WindupEndpoint
{
    private static Logger LOG = Logger.getLogger(WindupEndpointImpl.class.getSimpleName());

    @Inject
    private Furnace furnace;

    @PersistenceContext
    private EntityManager entityManager;

    @Inject
    private ConfigurationService configurationService;

    @Inject
    private AnalysisContextService analysisContextService;

    @Inject
    private JMSContext messaging;

    @Inject
    @FromFurnace
    private WebPathUtil webPathUtil;

    @Resource(lookup = "java:/queues/" + MessagingConstants.EXECUTOR_QUEUE)
    private Queue executorQueue;

    /**
     * @see org.jboss.windup.web.services.messaging.ExecutorMDB
     */
    @Override
    public WindupExecution executeProjectWithContext(AnalysisContext analysisContext, Long projectId)
    {
        if (analysisContext == null)
        {
            analysisContext = this.analysisContextService.getDefaultProjectAnalysisContext(projectId);
            if (analysisContext == null)
                throw new WindupException("AnalysisContext not provided and there's no default one for project #" + projectId + ".");
        }
        else {
            // AnalysisContext came as input, save it as a new one and also as the default for the project.
            analysisContext.setId(null);
            analysisContext.setVersion(0);

            //MigrationProject projectRef = entityManager.getReference(MigrationProject.class, projectId);
            MigrationProject projectRef = entityManager.find(MigrationProject.class, projectId);
            analysisContext.setMigrationProject(projectRef);

            // If there is a default context, delete it and clone the new analysisContext to use it as a new default.
            AnalysisContext defaultContext = this.analysisContextService.getDefaultProjectAnalysisContext(projectId);
            if (null != defaultContext)
            {
                this.entityManager.remove(defaultContext);
            }
            // This one is the new default.
            this.analysisContextService.create(analysisContext);

            // This one will be used for execution.
            analysisContext = this.analysisContextService.create(analysisContext);
        }

        WindupExecution execution = createAndTriggerExecution(analysisContext);
        return execution;
    }


    private WindupExecution createAndTriggerExecution(AnalysisContext analysisContext)
    {
        LOG.info("Creating execution. AnalysisContext: " + analysisContext);
        if (analysisContext.getApplications().isEmpty())
            throw new BadRequestException("Cannot execute windup without selected applications");

        WindupExecution execution = new WindupExecution(analysisContext);
        execution.setAnalysisContext(analysisContext);
        execution.setProject(analysisContext.getMigrationProject());
        execution.setTimeStarted(new GregorianCalendar());
        execution.setState(ExecutionState.QUEUED);
        entityManager.persist(execution);

        Path reportOutputPath = this.webPathUtil.createWindupReportOutputPath("p" + execution.getProjectId(), "e" + execution.getId());
        execution.setOutputPath(reportOutputPath.toString());
        entityManager.merge(execution);

        messaging.createProducer().send(executorQueue, execution);

        return execution;
    }


    @Override
    public Collection<WindupExecution> getAllExecutions()
    {
        return this.entityManager.createQuery("SELECT ex from " + WindupExecution.class.getSimpleName() + " ex").getResultList();
    }

    @Override
    public WindupExecution getExecution(Long executionId)
    {
        WindupExecution execution = this.entityManager.find(WindupExecution.class, executionId);

        if (execution == null)
        {
            throw new NotFoundException("WindupExecution with id: " + executionId + " not found");
        }

        return execution;
    }

    @Override
    public void cancelExecution(Long executionID)
    {
        WindupExecution execution = this.getExecution(executionID);

        if (execution.getState() != ExecutionState.QUEUED)
        {
            throw new BadRequestException("WindupExecution with id: " + executionID + " cannot be cancelled. \n" +
                        " It is in state: " + execution.getState() + " which doesn't allow cancelling.");
        }


        // TODO: Cancel execution here
        execution.setState(ExecutionState.CANCELLED);
        this.entityManager.merge(execution);
    }

    @Override
    public Collection<WindupExecution> getProjectExecutions(Long projectId)
    {
        if (projectId == null)
        {
            throw new BadRequestException("Invalid projectId");
        }

        MigrationProject project = this.entityManager.find(MigrationProject.class, projectId);

        if (project == null)
        {
            throw new NotFoundException("Migration project with id: " + projectId + " not found");
        }

       return this.entityManager.createQuery("SELECT ex FROM WindupExecution ex WHERE ex.project = :project", WindupExecution.class)
               .setParameter("project", project)
               .getResultList();
    }
}
