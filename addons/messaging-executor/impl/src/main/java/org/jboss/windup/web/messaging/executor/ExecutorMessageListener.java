package org.jboss.windup.web.messaging.executor;

import java.nio.file.Paths;
import java.util.logging.Level;
import java.util.logging.Logger;

import javax.enterprise.inject.Instance;
import javax.inject.Inject;
import javax.jms.Message;
import javax.jms.MessageListener;

import org.jboss.windup.web.services.model.WindupExecution;

/**
 * @author <a href="mailto:jesse.sightler@gmail.com">Jesse Sightler</a>
 */
public class ExecutorMessageListener implements MessageListener
{
    private static Logger LOG = Logger.getLogger(ExecutorMessageListener.class.getSimpleName());

    @Inject
    private ExecutionSerializerRegistry executionSerializerRegistry;

    @Inject
    private ExecutionStateCache executionStateCache;

    @Inject
    private Instance<WindupExecutionTask> windupExecutionTaskInstance;

    @Override
    public void onMessage(Message message)
    {
        ExecutionSerializer serializer = this.executionSerializerRegistry.getDefaultSerializer();
        ExecutionRequest executionRequest = serializer.deserializeExecutionRequest(message);
        Long projectID = executionRequest.getProjectID();
        WindupExecution execution = executionRequest.getExecution();

        try
        {
            if (this.executionStateCache.isCancelled(execution.getId()))
            {
                LOG.info("Not executing " + execution.getId() + " as it has been marked cancelled!");
                return;
            }

            LOG.info("Executing: " + execution);
            WindupExecutionTask executionTask = windupExecutionTaskInstance.get();
            executionTask.init(projectID, execution, execution.getAnalysisContext());
            executionTask.run();
        }
        catch (Throwable e)
        {
            LOG.log(Level.SEVERE, "Failed to execute windup due to: " + e.getMessage(), e);
        }
    }
}
