package org.jboss.windup.web.messaging.executor;

import org.jboss.windup.web.services.model.WindupExecution;

/**
 * Maintains the status of whether or not an executor should proceed.
 *
 * @author <a href="mailto:jesse.sightler@gmail.com">Jesse Sightler</a>
 */
public interface ExecutionStateCache
{
    /**
     * Indicates whether or not the given execution has been cancelled.
     */
    boolean isCancelled(Long executionID);

    /**
     * Marks the execution as cancelled.
     */
    void setCancelled(Long executionID);
}
