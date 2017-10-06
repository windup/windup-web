package org.jboss.windup.web.messaging.executor;

import javax.enterprise.inject.Vetoed;

import org.jboss.windup.web.services.model.WindupExecution;

/**
 * This contains the information in a request to execute windup.
 *
 * For example, this contains the project id and the execution itself.
 *
 * @author <a href="mailto:jesse.sightler@gmail.com">Jesse Sightler</a>
 */
@Vetoed
public class ExecutionRequest
{
    private Long projectID;
    private WindupExecution execution;

    public ExecutionRequest()
    {
    }

    public ExecutionRequest(Long projectID, WindupExecution execution)
    {
        this.projectID = projectID;
        this.execution = execution;
    }

    /**
     * Contains the ID of the project being executed.
     */
    public Long getProjectID()
    {
        return projectID;
    }

    /**
     * Contains the execution request itself.
     */
    public WindupExecution getExecution()
    {
        return execution;
    }
}
