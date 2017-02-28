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
import org.jboss.windup.web.addons.websupport.WebPathUtil;
import org.jboss.windup.web.addons.websupport.services.WindupExecutorService;
import org.jboss.windup.web.furnaceserviceprovider.FromFurnace;
import org.jboss.windup.web.services.messaging.MessagingConstants;
import org.jboss.windup.web.services.model.ApplicationGroup;
import org.jboss.windup.web.services.model.ExecutionState;
import org.jboss.windup.web.services.model.MigrationProject;
import org.jboss.windup.web.services.model.RegisteredApplication;
import org.jboss.windup.web.services.model.WindupExecution;
import org.jboss.windup.web.services.service.AnalysisContextService;
import org.jboss.windup.web.services.service.ApplicationGroupService;
import org.jboss.windup.web.services.service.ConfigurationService;

@Stateless
public class WindupEndpointImpl implements WindupEndpoint
{
    private static Logger LOG = Logger.getLogger(WindupEndpointImpl.class.getSimpleName());

    @Inject
    private Furnace furnace;

    @Inject
    @FromFurnace
    private WindupExecutorService windupExecutorService;

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

    @Inject
    private ApplicationGroupService applicationGroupService;

    @Resource(lookup = "java:/queues/" + MessagingConstants.EXECUTOR_QUEUE)
    private Queue executorQueue;

    @Override
    public WindupExecution executeGroup(Long groupID)
    {
        ApplicationGroup group = this.applicationGroupService.getApplicationGroup(groupID);

        if (group.getApplications().size() == 0)
        {
            throw new BadRequestException("Cannot execute windup on empty group");
        }

        for (RegisteredApplication application : group.getApplications())
        {
            application.setReportIndexPath(null);
        }

        WindupExecution execution = new WindupExecution();
        execution.setGroup(group);
        execution.setTimeStarted(new GregorianCalendar());
        execution.setState(ExecutionState.QUEUED);

        entityManager.persist(execution);

        Path reportOutputPath = this.webPathUtil.createWindupReportOutputPath(
                execution.getGroup().getMigrationProject().getId().toString(),
                execution.getGroup().getId().toString(),
                execution.getId().toString()
        );

        execution.setOutputPath(reportOutputPath.toString());

        if (group.getAnalysisContext() == null)
        {
            group.setAnalysisContext(analysisContextService.createDefaultAnalysisContext(group));
        }
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
        if (projectId == null) {
            throw new BadRequestException("Invalid projectId");
        }

        MigrationProject project = this.entityManager.find(MigrationProject.class, projectId);

        if (project == null) {
            throw new NotFoundException("Migration project with id: " + projectId + " not found");
        }

       return this.entityManager.createQuery("SELECT ex FROM WindupExecution ex JOIN ex.group AS gr WHERE gr.migrationProject = :project")
               .setParameter("project", project)
               .getResultList();
    }
}
