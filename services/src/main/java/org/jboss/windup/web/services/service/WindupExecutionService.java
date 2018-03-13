package org.jboss.windup.web.services.service;

import java.io.File;
import java.io.IOException;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.GregorianCalendar;
import java.util.logging.Level;
import java.util.logging.Logger;

import javax.annotation.Resource;
import javax.ejb.Stateless;
import javax.ejb.TransactionAttribute;
import javax.ejb.TransactionAttributeType;
import javax.inject.Inject;
import javax.jms.JMSContext;
import javax.jms.Message;
import javax.jms.Queue;
import javax.jms.Topic;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.ws.rs.NotFoundException;

import org.apache.commons.io.FileUtils;
import org.apache.commons.lang3.StringUtils;
import org.jboss.forge.furnace.proxy.Proxies;
import org.jboss.windup.graph.GraphContextFactory;
import org.jboss.windup.web.addons.websupport.WebPathUtil;
import org.jboss.windup.web.addons.websupport.rest.graph.GraphCache;
import org.jboss.windup.web.furnaceserviceprovider.FromFurnace;
import org.jboss.windup.web.messaging.executor.AMQConstants;
import org.jboss.windup.web.messaging.executor.ExecutionSerializerRegistry;
import org.jboss.windup.web.messaging.executor.ExecutionStateCache;
import org.jboss.windup.web.services.model.AnalysisContext;
import org.jboss.windup.web.services.model.ExecutionState;
import org.jboss.windup.web.services.model.MigrationProject;
import org.jboss.windup.web.services.model.RegisteredApplication;
import org.jboss.windup.web.services.model.WindupExecution;
import org.jboss.windup.web.services.rest.WindupEndpointImpl;

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
    @FromFurnace
    private ExecutionSerializerRegistry executionSerializerRegistry;

    @Inject
    private AnalysisContextService analysisContextService;

    @Inject
    private MigrationProjectService migrationProjectService;

    @Inject
    @FromFurnace
    private ExecutionStateCache executionStateCache;

    @Inject
    @FromFurnace
    private GraphCache graphCache;

    @Inject
    private JMSContext messaging;

    @Resource(lookup = "java:/queues/" + AMQConstants.EXECUTOR_QUEUE)
    private Queue executorQueue;

    @Resource(lookup = "java:/queues/" + AMQConstants.STATUS_UPDATE_QUEUE)
    private Queue statusUpdateQueue;

    @Resource(lookup = "java:/topics/" + AMQConstants.CANCELLATION_TOPIC)
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

    /**
     * Gets an execution by ID
     *
     * This method is workaround for {@link org.jboss.windup.web.services.servlet.FileDefaultServlet} (exception thrown from get method cannot be
     * caught in it, it is processed somewhere inside EJB container and it creates default error message output and adds lots of errors to log)
     *
     */
    public WindupExecution getNoThrow(Long id)
    {
        return this.entityManager.find(WindupExecution.class, id);
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
        execution.setTimeQueued(new GregorianCalendar());
        execution.setState(ExecutionState.QUEUED);

        entityManager.persist(execution);

        Path reportOutputPath = this.webPathUtil.createWindupReportOutputPath(
                    execution.getProject().getId().toString(),
                    execution.getId().toString());

        execution.setOutputPath(reportOutputPath.toString());
        entityManager.merge(execution);

        Message executionRequestMessage = this.executionSerializerRegistry.getDefaultSerializer().serializeExecutionRequest(messaging, execution);

        // Make sure not to use Forge types as this can break AMQ
        if (Proxies.isForgeProxy(executionRequestMessage))
            executionRequestMessage = Proxies.unwrap(executionRequestMessage);

        // See ExecutorMDB
        messaging.createProducer().send(executorQueue, executionRequestMessage);

        return execution;
    }

    @TransactionAttribute(TransactionAttributeType.REQUIRES_NEW)
    public void cancelExecution(Long executionID)
    {
        WindupExecution execution = this.get(executionID);

        this.executionStateCache.setCancelled(execution.getId());

        execution.setState(ExecutionState.CANCELLED);

        Message message = this.executionSerializerRegistry.getDefaultSerializer()
                    .serializeStatusUpdate(messaging, execution.getProjectId(), execution, false);

        messaging.createProducer().send(statusUpdateQueue, unwrap(message));

        message = this.executionSerializerRegistry.getDefaultSerializer()
                    .serializeStatusUpdate(messaging, execution.getProjectId(), execution, false);
        messaging.createProducer().send(cancellationTopic, unwrap(message));
    }

    private <T> T unwrap(T object)
    {
        if (Proxies.isForgeProxy(object))
            return Proxies.unwrap(object);

        return object;
    }

    public void deleteExecution(Long executionID)
    {
        WindupExecution execution = this.get(executionID);
        AnalysisContext analysisContext = execution.getAnalysisContext();

        // without deleting it will stay in DB forever
        if (analysisContext != null)
        {
            execution.setAnalysisContext(null);
            this.entityManager.remove(analysisContext);
        }

        if (StringUtils.isBlank(execution.getOutputPath()))
            return;

        // Make sure the graph is closed
        Path graphPath = Paths.get(execution.getOutputPath()).resolve(GraphContextFactory.DEFAULT_GRAPH_SUBDIRECTORY);

        try
        {
            graphCache.closeGraph(graphPath);
        }
        catch (Throwable t)
        {
            // A failure to close can generally be ignored.
            LOG.log(Level.FINE, "Could not close the graph at: " + graphPath + " due to: " + t.getMessage(), t);
        }

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
                LOG.log(Level.WARNING,
                            "Unable to remove execution contents at " + executionDir.getAbsolutePath() + " (cause: " + e.getMessage() + ")", e);
            }
        }
        this.entityManager.remove(execution);
    }
}
