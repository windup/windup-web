package org.jboss.windup.web.services.rest;

import java.io.File;
import java.io.IOException;
import java.util.GregorianCalendar;
import java.util.HashSet;
import java.util.logging.Logger;

import javax.annotation.Resource;
import javax.ejb.Stateless;
import javax.inject.Inject;
import javax.jms.JMSContext;
import javax.jms.Queue;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;

import org.apache.commons.io.FileUtils;
import org.jboss.forge.furnace.Furnace;
import org.jboss.windup.web.addons.websupport.services.WindupExecutorService;
import org.jboss.windup.web.furnaceserviceprovider.FromFurnace;
import org.jboss.windup.web.services.messaging.MessagingConstants;
import org.jboss.windup.web.services.model.AnalysisContext;
import org.jboss.windup.web.services.model.ApplicationGroup;
import org.jboss.windup.web.services.model.ExecutionState;
import org.jboss.windup.web.services.model.WindupExecution;
import org.jboss.windup.web.services.model.RegisteredApplication;
import org.jboss.windup.web.services.service.ConfigurationService;

@Stateless
public class WindupEndpointImpl implements WindupEndpoint
{
    private static Logger LOG = Logger.getLogger(WindupEndpointImpl.class.getSimpleName());

    @Inject
    private Furnace furnace;

    @Inject @FromFurnace
    private WindupExecutorService windupExecutorService;

    @PersistenceContext
    private EntityManager entityManager;

    @Inject
    private ConfigurationService configurationService;

    @Inject
    private JMSContext messaging;

    @Resource(lookup = "java:/queues/" + MessagingConstants.EXECUTOR_QUEUE)
    private Queue executorQueue;

    @Override
    public WindupExecution getStatus(Long executionID)
    {
        return this.entityManager.find(WindupExecution.class, executionID);
    }

    @Override
    public WindupExecution executeGroup(Long groupID)
    {
        ApplicationGroup group = entityManager.find(ApplicationGroup.class, groupID);

        for (RegisteredApplication application : group.getApplications())
        {
            application.setReportIndexPath(null);
        }

        WindupExecution execution = new WindupExecution();
        execution.setGroup(group);
        execution.setTimeStarted(new GregorianCalendar());
        execution.setState(ExecutionState.STARTED);
        execution.setOutputPath(group.getOutputPath());

        if (group.getAnalysisContext() == null)
        {
            AnalysisContext defaultAnalysisContext = new AnalysisContext();
            entityManager.persist(defaultAnalysisContext);
            group.setAnalysisContext(defaultAnalysisContext);
        }
        group.getAnalysisContext().setRulesPaths(new HashSet<>(configurationService.getConfiguration().getRulesPaths()));
        entityManager.persist(execution);

        messaging.createProducer().send(executorQueue, execution);

        return execution;
    }

}
