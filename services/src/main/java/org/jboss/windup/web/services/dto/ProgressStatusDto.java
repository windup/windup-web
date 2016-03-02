package org.jboss.windup.web.services.dto;

/**
 * @author <a href="mailto:jesse.sightler@gmail.com">Jesse Sightler</a>
 */
public class ProgressStatusDto
{
    private int totalWork;
    private int workCompleted;
    private String currentTask;
    private boolean completed;

    public ProgressStatusDto()
    {
    }

    public ProgressStatusDto(int totalWork, int workCompleted, String currentTask, boolean completed)
    {
        this.currentTask = currentTask;
        this.workCompleted = workCompleted;
        this.totalWork = totalWork;
        this.completed = completed;
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

    public boolean isCompleted()
    {
        return completed;
    }

    @Override
    public String toString()
    {
        return "ProgressStatusDto{" +
                    "totalWork=" + totalWork +
                    ", workCompleted=" + workCompleted +
                    ", currentTask='" + currentTask + '\'' +
                    ", completed=" + completed +
                    '}';
    }
}
