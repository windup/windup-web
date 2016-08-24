package org.jboss.windup.web.services;

import java.util.Queue;
import java.util.concurrent.ConcurrentLinkedQueue;
import java.util.logging.Level;
import java.util.logging.Logger;

import javax.annotation.Resource;
import javax.enterprise.concurrent.ManagedExecutorService;
import javax.naming.InitialContext;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.transaction.UserTransaction;

import org.jboss.windup.exec.WindupProgressMonitor;
import org.jboss.windup.web.services.model.ExecutionState;
import org.jboss.windup.web.services.model.WindupExecution;

/**
 * @author <a href="mailto:jesse.sightler@gmail.com">Jesse Sightler</a>
 */
public class WindupWebProgressMonitor implements WindupProgressMonitor
{
    private static final Logger LOG = Logger.getLogger(WindupWebProgressMonitor.class.getName());

    @PersistenceContext
    private EntityManager entityManager;

    @Resource
    private ManagedExecutorService executorService;

    private boolean done = false;
    private Long executionID;
    private Queue<Runnable> statusUpdateTasks = new ConcurrentLinkedQueue<>();

    /**
     * Contains an Entity that keeps the current execution information in storage.
     */
    public void setExecution(WindupExecution execution)
    {
        this.executionID = execution.getId();
        executorService.execute(() -> {
            while (!done || !statusUpdateTasks.isEmpty())
            {
                try
                {
                    if (!statusUpdateTasks.isEmpty())
                    {
                        Runnable task = statusUpdateTasks.remove();
                        task.run();
                    }
                    else
                    {
                        Thread.sleep(100L);
                    }
                }
                catch (Throwable t)
                {
                    t.printStackTrace();
                }
            }
        });
    }

    public void setFailed()
    {
        statusUpdateTasks.add(() -> {
            WindupExecution execution = this.entityManager.find(WindupExecution.class, executionID);
            execution.setState(ExecutionState.FAILED);
            mergeAndCommit(execution);
        });
        this.done = true;
    }

    @Override
    public void beginTask(String name, int totalWork)
    {
        statusUpdateTasks.add(() -> {
            WindupExecution execution = this.entityManager.find(WindupExecution.class, executionID);
            execution.setTotalWork(totalWork);
            execution.setCurrentTask(name);
            mergeAndCommit(execution);
        });

        WindupExecution execution = this.entityManager.find(WindupExecution.class, executionID);
        String message = String.format("[%d/%d] %s", execution.getWorkCompleted(), totalWork, name);
        LOG.info(message);
    }

    @Override
    public boolean isCancelled()
    {
        WindupExecution execution = this.entityManager.find(WindupExecution.class, executionID);
        return execution.getState() == ExecutionState.CANCELLED;
    }

    @Override
    public void setCancelled(boolean cancelled)
    {
        statusUpdateTasks.add(() -> {
            WindupExecution execution = this.entityManager.find(WindupExecution.class, executionID);
            execution.setState(ExecutionState.CANCELLED);
            mergeAndCommit(execution);
        });
    }

    @Override
    public void setTaskName(String name)
    {
        statusUpdateTasks.add(() -> {
            WindupExecution execution = this.entityManager.find(WindupExecution.class, executionID);
            execution.setCurrentTask(name);
            mergeAndCommit(execution);
        });

        WindupExecution execution = this.entityManager.find(WindupExecution.class, executionID);
        String message = String.format("[%d/%d] %s", execution.getWorkCompleted(), execution.getTotalWork(), name);
        LOG.info(message);
    }

    @Override
    public void subTask(String subTask)
    {
        statusUpdateTasks.add(() -> {
            WindupExecution execution = this.entityManager.find(WindupExecution.class, executionID);
            execution.setCurrentTask(subTask);
            mergeAndCommit(execution);
        });

        WindupExecution execution = this.entityManager.find(WindupExecution.class, executionID);
        String message = String.format("[%d/%d] %s", execution.getWorkCompleted(), execution.getTotalWork(), subTask);
        LOG.info(message);
    }

    @Override
    public void worked(int work)
    {
        statusUpdateTasks.add(() -> {
            WindupExecution execution = this.entityManager.find(WindupExecution.class, executionID);
            execution.setWorkCompleted(execution.getWorkCompleted() + work);
            mergeAndCommit(execution);
        });
    }

    @Override
    public void done()
    {
        statusUpdateTasks.add(() -> {
            WindupExecution execution = this.entityManager.find(WindupExecution.class, executionID);
            execution.setState(ExecutionState.COMPLETED);
            mergeAndCommit(execution);
        });
        this.done = true;
    }

    private void mergeAndCommit(WindupExecution execution)
    {
        try
        {
            InitialContext ic = new InitialContext();
            UserTransaction userTransaction = (UserTransaction) ic.lookup("java:comp/UserTransaction");

            userTransaction.begin();
            this.entityManager.merge(execution);
            userTransaction.commit();
        }
        catch (Throwable t)
        {
            LOG.log(Level.SEVERE, "Could not commit transaction due to: " + t.getMessage(), t);
            throw new RuntimeException("Could not commit transaction due to: " + t.getMessage(), t);
        }
    }
}
