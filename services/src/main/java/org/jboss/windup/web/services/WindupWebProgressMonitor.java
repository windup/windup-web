package org.jboss.windup.web.services;

import org.jboss.windup.exec.WindupProgressMonitor;

import java.util.logging.Logger;

/**
 * @author <a href="mailto:jesse.sightler@gmail.com">Jesse Sightler</a>
 */
public class WindupWebProgressMonitor implements WindupProgressMonitor
{
    private static final Logger LOG = Logger.getLogger(WindupWebProgressMonitor.class.getName());

    private String currentTask;
    private int totalWork;
    private int currentWork;
    private boolean cancelled;
    private boolean done;
    private boolean failed;

    public boolean isFailed()
    {
        return failed;
    }

    public void setFailed(boolean failed)
    {
        this.failed = failed;
    }

    public boolean isDone()
    {
        return done;
    }

    public String getCurrentTask()
    {
        return currentTask;
    }

    public int getTotalWork()
    {
        return totalWork;
    }

    public int getCurrentWork()
    {
        return currentWork;
    }

    @Override
    public void beginTask(String name, int totalWork)
    {
        this.totalWork = totalWork;
        this.currentTask = name;

        String message = String.format("[%d/%d] %s", currentWork, totalWork, name);
        LOG.info(message);
    }

    @Override
    public boolean isCancelled()
    {
        return cancelled;
    }

    @Override
    public void setCancelled(boolean cancelled)
    {
        this.cancelled = cancelled;
    }

    @Override
    public void setTaskName(String name)
    {
        this.currentTask = name;
        String message = String.format("[%d/%d] \t", currentWork, totalWork, name);
        LOG.info(message);
    }

    @Override
    public void subTask(String subTask)
    {
        this.currentTask = subTask;
        String message = String.format("[%d/%d] %s", currentWork, totalWork, subTask);
        LOG.info(message);
    }

    @Override
    public void worked(int work)
    {
        this.currentWork += work;
    }

    @Override
    public void done()
    {
        this.done = true;
    }
}
