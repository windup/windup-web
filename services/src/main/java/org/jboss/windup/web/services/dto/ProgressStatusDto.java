package org.jboss.windup.web.services.dto;

/**
 * @author <a href="mailto:jesse.sightler@gmail.com">Jesse Sightler</a>
 */
public class ProgressStatusDto
{
    private int totalWork;
    private int workCompleted;
    private String currentTask;

    public ProgressStatusDto()
    {
    }

    public ProgressStatusDto(int totalWork, int workCompleted, String currentTask)
    {
        this.currentTask = currentTask;
        this.workCompleted = workCompleted;
        this.totalWork = totalWork;
    }

    public String getCurrentTask()
    {
        return currentTask;
    }

    public int getWorkCompleted()
    {
        return workCompleted;
    }

    public int getTotalWork()
    {
        return totalWork;
    }
}
