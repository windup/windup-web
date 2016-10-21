package org.jboss.windup.web.services.model;

/**
 * @author <a href="mailto:jesse.sightler@gmail.com">Jesse Sightler</a>
 */
public enum ExecutionState
{
    QUEUED,
    STARTED,
    COMPLETED,
    FAILED,
    CANCELLED;

    /**
     * This indicates whether processing has ceased for some reason. This includes a normal completion, as well
     * as failure or cancellation of the task.
     *
     * @return
     */
    public boolean isDone()
    {
        return this == COMPLETED || this == FAILED || this == CANCELLED;
    }
}
