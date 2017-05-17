package org.jboss.windup.web.services.service;

import javax.annotation.Resource;
import javax.ejb.Stateless;
import javax.ejb.TransactionAttribute;
import javax.ejb.TransactionAttributeType;
import javax.inject.Inject;
import javax.jms.JMSContext;
import javax.jms.Queue;
import javax.jms.Topic;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.ws.rs.NotFoundException;

import org.apache.commons.io.FileUtils;
import org.apache.commons.lang3.StringUtils;
import org.jboss.windup.web.addons.websupport.WebPathUtil;
import org.jboss.windup.web.furnaceserviceprovider.FromFurnace;
import org.jboss.windup.web.services.messaging.ExecutionStateCache;
import org.jboss.windup.web.services.messaging.MessagingConstants;
import org.jboss.windup.web.services.model.AnalysisContext;
import org.jboss.windup.web.services.model.ExecutionState;
import org.jboss.windup.web.services.model.MigrationProject;
import org.jboss.windup.web.services.model.RegisteredApplication;
import org.jboss.windup.web.services.model.WindupExecution;
import org.jboss.windup.web.services.rest.WindupEndpointImpl;

import java.io.File;
import java.io.IOException;
import java.lang.management.ManagementFactory;
import java.nio.file.Path;
import java.util.Calendar;
import java.util.GregorianCalendar;
import java.util.List;
import java.util.logging.Level;
import java.util.logging.Logger;

/**
 * @author <a href="mailto:dklingenberg@gmail.com">David Klingenberg</a>
 */
@Stateless
public class WindupExecutionService
{
    private static Logger LOG = Logger.getLogger(WindupEndpointImpl.class.getSimpleName());

    @PersistenceContext
    private EntityManager entityManager;

    @Inject
    @FromFurnace
    private WebPathUtil webPathUtil;

    @Inject
    private ConfigurationService configurationService;

    @Inject
    private AnalysisContextService analysisContextService;

    @Inject
    private MigrationProjectService migrationProjectService;

    @Inject
    private JMSContext messaging;

    @Resource(lookup = "java:/queues/" + MessagingConstants.EXECUTOR_QUEUE)
    private Queue executorQueue;

    @Resource(lookup = "java:/queues/" + MessagingConstants.STATUS_UPDATE_QUEUE)
    private Queue statusUpdateQueue;

    @Resource(lookup = "java:/topics/" + MessagingConstants.CANCELLATION_TOPIC)
    private Topic cancellationTopic;


    /**
     * Gets an execution by ID, or throws NotFoundException if it does not exist.
     *
     * @param id
     * @return
     */
    public WindupExecution get(Long id)
    {
        WindupExecution execution = this.entityManager.find(WindupExecution.class, id);

        if (execution == null)
        {
            throw new NotFoundException("Analysis with id " + id + " not found");
        }

        return execution;
    }

    public WindupExecution executeProjectWithContext(AnalysisContext originalContext, Long projectId)
    {
        // make clone of analysis context and use it for execution
        AnalysisContext analysisContext = originalContext.clone();

        MigrationProject project = this.migrationProjectService.getMigrationProject(projectId);
        project.setLastModified(new GregorianCalendar());
        analysisContext.setMigrationProject(project); // ensure project is correctly set

        analysisContext = this.analysisContextService.create(analysisContext);

        for (RegisteredApplication application : analysisContext.getApplications())
        {
            application.setReportIndexPath(null);
        }

        WindupExecution execution = new WindupExecution(analysisContext);
        execution.setTimeStarted(new GregorianCalendar());
        execution.setState(ExecutionState.QUEUED);

        entityManager.persist(execution);

        Path reportOutputPath = this.webPathUtil.createWindupReportOutputPath(
                execution.getProject().getId().toString(),
                execution.getId().toString());

        execution.setOutputPath(reportOutputPath.toString());
        entityManager.merge(execution);

        messaging.createProducer().send(executorQueue, execution);

        return execution;
    }

    @TransactionAttribute(TransactionAttributeType.REQUIRES_NEW)
    public void cancelExecution(Long executionID)
    {
        WindupExecution execution = this.get(executionID);

        ExecutionStateCache.setCancelled(execution);

        execution.setState(ExecutionState.CANCELLED);

        messaging.createProducer().send(statusUpdateQueue, execution);
        messaging.createProducer().send(cancellationTopic, execution);
    }

    public void deleteExecution(Long executionID)
    {
        WindupExecution execution = this.get(executionID);
        if (StringUtils.isBlank(execution.getOutputPath()))
            return;

        File executionDir = new File(execution.getOutputPath());
        if (executionDir.exists())
        {
            LOG.info("Removing report from: " + executionDir);
            try
            {
                FileUtils.deleteDirectory(executionDir);
            }
            catch (IOException e)
            {
                LOG.log(Level.WARNING, "Unable to execution contents at " + executionDir.getAbsolutePath() + " (cause: " + e.getMessage() + ")", e);
            }
        }
        this.entityManager.remove(execution);
    }

    public void cleanupStaleExecutions()
    {
        LOG.info("Cleaning up stale executions.");

        long jvmStartTimeMs = ManagementFactory.getRuntimeMXBean().getStartTime();
        Calendar serverBootTime = GregorianCalendar.getInstance();
        serverBootTime.setTimeInMillis(jvmStartTimeMs);

        final String query = String.format("FROM %s AS exec WHERE exec.timeStarted < :serverBoot AND exec.state = :state", WindupExecution.class.getSimpleName());
        List<WindupExecution> staleExecutions = this.entityManager.createQuery(query)
                .setParameter("serverBoot", serverBootTime)
                .setParameter("state", ExecutionState.STARTED).getResultList();

        for (WindupExecution staleExecution : staleExecutions)
        {
            LOG.info("    Changing status of stale execution to CANCELLED:\n    " + staleExecution);
            staleExecution.setState(ExecutionState.CANCELLED);
            entityManager.merge(staleExecution);
        }
        entityManager.flush();
    }
}
