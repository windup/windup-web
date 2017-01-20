package org.jboss.windup.web.services.model;

/**
 * @author <a href="mailto:jesse.sightler@gmail.com">Jesse Sightler</a>
 * @author <a href="mailto:zizka@seznam.cz">Ondrej Zizka</a>
 */
public enum ExecutionState
{
    /**
     * Execution is about to be started.
     *//**
     * Execution is about to be started.
     */
    QUEUED,

    /**
     * Execution has started and is running.
     */
    STARTED,

    /**
     * Execution was successfully done.
     */
    COMPLETED,

    /**
     * Execution finished with an error.
     */
    FAILED,

    /**
     * Execution was requested to cancel.
     */
    CANCELLING,

    /**
     * Execution was canceled and already finished.
     */
    CANCELLED;

    /**
     * This indicates whether processing has ceased for some reason.
     * This includes a normal completion, as well as failure or cancellation of the task.
     */
    public boolean isDone()
    {
        return this == COMPLETED || this == FAILED || this == CANCELLED;
    }
}
