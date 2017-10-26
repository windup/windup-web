package org.jboss.windup.web.messaging.executor;

import org.jboss.windup.web.services.model.WindupExecution;

/**
 * Contains methods for calling the appropriate JMS APIs to send status update
 * information to clients of the system.
 *
 * @author <a href="mailto:jesse.sightler@gmail.com">Jesse Sightler</a>
 */
public interface JMSServiceAdapter
{
    /**
     * Sends a status update for the provided execution.
     */
    void sendStatusUpdate(Long projectID, WindupExecution execution);

    /**
     * Sends the final completion notice with the result contents.
     *
     * NOTE: This should only be done after all analysis is completed and the graph has been closed.
     */
    void sendCompleted(Long projectID, WindupExecution execution);
}
