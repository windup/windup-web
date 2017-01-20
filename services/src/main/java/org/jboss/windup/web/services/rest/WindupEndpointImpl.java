package org.jboss.windup.web.services.rest;

import java.util.Collection;
import java.nio.file.Path;
import java.util.GregorianCalendar;
import java.util.logging.Logger;

import javax.annotation.Resource;
import javax.ejb.Stateless;
import javax.ejb.TransactionAttribute;
import javax.ejb.TransactionAttributeType;
import javax.enterprise.inject.Instance;
import javax.inject.Inject;
import javax.jms.JMSContext;
import javax.jms.Queue;
import javax.jms.Topic;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.ws.rs.BadRequestException;
import javax.ws.rs.NotFoundException;

import org.jboss.forge.furnace.Furnace;
import org.jboss.windup.util.exception.WindupException;
import org.jboss.windup.web.addons.websupport.WebPathUtil;
import org.jboss.windup.web.addons.websupport.services.WindupExecutorService;
import org.jboss.windup.web.furnaceserviceprovider.FromFurnace;
import org.jboss.windup.web.services.WindupWebProgressMonitor;
import org.jboss.windup.web.services.messaging.MessagingConstants;
import org.jboss.windup.web.services.model.ApplicationGroup;
import org.jboss.windup.web.services.model.ExecutionState;
import org.jboss.windup.web.services.model.RegisteredApplication;
import org.jboss.windup.web.services.model.WindupExecution;
import org.jboss.windup.web.services.service.AnalysisContextService;
import org.jboss.windup.web.services.service.ApplicationGroupService;
import org.jboss.windup.web.services.service.ConfigurationService;

/**
 * @author <a href="mailto:jesse.sightler@gmail.com">Jesse Sightler</a>
 * @author <a href="mailto:zizka@seznam.cz">Ondrej Zizka</a>
 */
@Stateless
public class WindupEndpointImpl implements WindupEndpoint
{
    private static Logger LOG = Logger.getLogger(WindupEndpointImpl.class.getSimpleName());

    @Inject
    private Furnace furnace;

    @Inject
    @FromFurnace
    private WindupExecutorService windupExecutorService;

    @Inject
    private Instance<WindupWebProgressMonitor> progressMonitorInstance;

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

    @Resource(lookup = "java:/queues/" + MessagingConstants.STATUS_UPDATE_QUEUE)
    private Queue statusUpdateQueue;

    @Resource(lookup = "java:/topics/" + MessagingConstants.EXEC_CHANGE_REQUEST_TOPIC)
    private Topic changeRequestTopic;


    @Override
    public WindupExecution getStatus(Long executionID)
    {
        WindupExecution execution = this.entityManager.find(WindupExecution.class, executionID);
        if (execution == null)
            throw new NotFoundException("WindupExecution not found: #" + executionID);
        return execution;
    }

    @Override
    public WindupExecution executeGroup(Long groupID)
    {
        ApplicationGroup group = this.applicationGroupService.getApplicationGroup(groupID);

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

    private ApplicationGroup getApplicationGroup(Long groupID)
    {
        ApplicationGroup applicationGroup = entityManager.find(ApplicationGroup.class, groupID);
        if (applicationGroup == null)
            throw new NotFoundException("ApplicationGroup with id: " + groupID + " not found");

        return applicationGroup;
    }

    @Override
    public Collection<WindupExecution> getAllExecutions()
    {
        return this.entityManager.createQuery("SELECT ex from " + WindupExecution.class.getSimpleName() + " ex").getResultList();
    }

    protected WindupExecution getExecution(Long executionId)
    {
        WindupExecution execution = this.entityManager.find(WindupExecution.class, executionId);
        if (execution == null)
            throw new NotFoundException("WindupExecution with id: " + executionId + " not found");

        return execution;
    }

    /**
     * Requests the given Windup execution to be stopped.
     * Can be requested when QUEUED or STARTED.
     *
     * This is passed to the Windup core through {@link WindupWebProgressMonitor}'s isCancelled()
     * which returns state == {@link ExecutionState}.CANCELLING .
     */
    @Override
    ///@TransactionAttribute(TransactionAttributeType.REQUIRES_NEW)
    public void cancelExecution(Long executionID)
    {
        LOG.info("cancelExecution() #" + executionID);
        WindupExecution execution = this.getExecution(executionID);
        if (execution.getState().equals(ExecutionState.CANCELLING))
        {
            LOG.info("WindupExecution #" + executionID + " is already cancelling.");
            return;
        }

        if (execution.getState().isDone())
        {
            throw new BadRequestException("WindupExecution #" + executionID + " was"
                + " already done, cannot be cancelled in state: " + execution.getState());
        }

        try
        {
            execution.setState(ExecutionState.CANCELLING);
            this.entityManager.merge(execution);
            //messaging.createProducer().send(statusUpdateQueue, execution);
            LOG.info("cancelExecution() - sending to changeRequestTopic: " + execution);
            messaging.createProducer().send(changeRequestTopic, execution);
        }
        catch (Exception e)
        {
            throw new WindupException("Failed updating execution status: " + e.getMessage() + "\n\t" + execution, e);
        }
    }
}
