package org.jboss.windup.web.messaging.executor;

import org.jboss.windup.web.services.model.AnalysisContext;
import org.jboss.windup.web.services.model.WindupExecution;

/**
 * Contains code for executing Windup and managing the status information from the process.
 *
 * @author <a href="mailto:jesse.sightler@gmail.com">Jesse Sightler</a>
 */
public interface WindupExecutionTask extends Runnable
{
    /**
     * Initialize an execution for the given project and analysis context.
     */
    void init(Long projectID, WindupExecution execution, AnalysisContext context);

    /**
     * This is just here so that Forge will proxy it correctly.
     */
    @Override
    void run();
}