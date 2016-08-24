package org.jboss.windup.web.services.rest;

import java.io.File;
import java.io.IOException;
import java.util.GregorianCalendar;
import java.util.logging.Logger;

import javax.annotation.Resource;
import javax.ejb.Stateless;
import javax.enterprise.concurrent.ManagedExecutorService;
import javax.enterprise.inject.Instance;
import javax.inject.Inject;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;

import org.apache.commons.io.FileUtils;
import org.jboss.forge.furnace.Furnace;
import org.jboss.windup.web.addons.websupport.services.WindupExecutorService;
import org.jboss.windup.web.furnaceserviceprovider.FromFurnace;
import org.jboss.windup.web.services.model.ApplicationGroup;
import org.jboss.windup.web.services.model.ExecutionState;
import org.jboss.windup.web.services.model.WindupExecution;
import org.jboss.windup.web.services.model.RegisteredApplication;
import org.jboss.windup.web.services.service.WindupExecutionTask;

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

    @Resource
    private ManagedExecutorService managedExecutorService;

    @Inject
    private Instance<WindupExecutionTask> windupExecutionTaskInstance;

    @Override
    public WindupExecution getStatus(Long executionID)
    {
        return this.entityManager.find(WindupExecution.class, executionID);
    }

    @Override
    public WindupExecution executeGroup(Long groupID)
    {
        ApplicationGroup group = entityManager.find(ApplicationGroup.class, groupID);

        // Clean out the output directory first
        try
        {
            FileUtils.deleteDirectory(new File(group.getOutputPath()));
        } catch (IOException e)
        {
            LOG.warning("Failed to delete output directory: " + group.getOutputPath() + ", due to: " + e.getMessage());
        }

        for (RegisteredApplication application : group.getApplications())
        {
            application.setReportIndexPath(null);
        }

        WindupExecution execution = new WindupExecution();
        execution.setGroup(group);
        execution.setTimeStarted(new GregorianCalendar());
        execution.setState(ExecutionState.STARTED);
        execution.setOutputPath(group.getOutputPath());
        entityManager.persist(execution);

        WindupExecutionTask executionTask = windupExecutionTaskInstance.get();
        executionTask.init(execution, group);
        managedExecutorService.execute(executionTask);
        return execution;
    }

}
