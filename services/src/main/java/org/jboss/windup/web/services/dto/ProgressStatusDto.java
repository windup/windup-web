package org.jboss.windup.web.services.dto;

/**
 * @author <a href="mailto:jesse.sightler@gmail.com">Jesse Sightler</a>
 */
public class ProgressStatusDto
{
    private int totalWork;
    private int workCompleted;
    private String currentTask;
    private boolean started;
    private boolean completed;
    private boolean failed;

    public ProgressStatusDto()
    {
    }

    public ProgressStatusDto(int totalWork, int workCompleted, String currentTask, boolean started, boolean completed, boolean failed)
    {
        this.currentTask = currentTask;
        this.workCompleted = workCompleted;
        this.totalWork = totalWork;
        this.started = started;
        this.completed = completed;
        this.failed = failed;
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

    public boolean isStarted()
    {
        return started;
    }

    public boolean isFailed()
    {
        return failed;
    }

    @Override
    public String toString() {
        return "ProgressStatusDto{" +
                "totalWork=" + totalWork +
                ", workCompleted=" + workCompleted +
                ", currentTask='" + currentTask + '\'' +
                ", started=" + started +
                ", completed=" + completed +
                ", failed=" + failed +
                '}';
    }
}
