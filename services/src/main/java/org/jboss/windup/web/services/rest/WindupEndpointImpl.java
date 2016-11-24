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
import javax.ws.rs.NotFoundException;

import org.jboss.forge.furnace.Furnace;
import org.jboss.windup.web.addons.websupport.WebPathUtil;
import org.jboss.windup.web.addons.websupport.services.WindupExecutorService;
import org.jboss.windup.web.furnaceserviceprovider.FromFurnace;
import org.jboss.windup.web.services.messaging.MessagingConstants;
import org.jboss.windup.web.services.model.ApplicationGroup;
import org.jboss.windup.web.services.model.ExecutionState;
import org.jboss.windup.web.services.model.RegisteredApplication;
import org.jboss.windup.web.services.model.WindupExecution;
import org.jboss.windup.web.services.service.AnalysisContextService;
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

    @Resource(lookup = "java:/queues/" + MessagingConstants.EXECUTOR_QUEUE)
    private Queue executorQueue;

    @Override
    public WindupExecution getStatus(Long executionID)
    {
        WindupExecution execution = this.entityManager.find(WindupExecution.class, executionID);

        if (execution == null)
        {
            throw new NotFoundException("WindupExecution with id: " + executionID + " not found");
        }

        return execution;
    }

    @Override
    public WindupExecution executeGroup(Long groupID)
    {
        ApplicationGroup group = getApplicationGroup(groupID);

        for (RegisteredApplication application : group.getApplications())
        {
            application.setReportIndexPath(null);
        }

        WindupExecution execution = new WindupExecution();
        execution.setGroup(group);
        execution.setTimeStarted(new GregorianCalendar());
        execution.setState(ExecutionState.STARTED);

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
        {
            throw new NotFoundException("ApplicationGroup with id: " + groupID + " not found");
        }

        return applicationGroup;
    }

    @Override
    public Collection<WindupExecution> getAllExecutions()
    {
        return this.entityManager.createQuery("SELECT ex from " + WindupExecution.class.getSimpleName() + " ex").getResultList();
    }
}
