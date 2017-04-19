package org.jboss.windup.web.services.messaging;

import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.locks.ReadWriteLock;
import java.util.concurrent.locks.ReentrantReadWriteLock;

import org.jboss.windup.web.services.model.WindupExecution;

/**
 * Maintains the status of whether or not an executor should proceed.
 *
 * @author <a href="mailto:jesse.sightler@gmail.com">Jesse Sightler</a>
 */
public class ExecutionStateCache
{
    private static Map<Long, Boolean> cancelledMap = new HashMap<>();
    private static ReadWriteLock lock = new ReentrantReadWriteLock();

    /**
     * Indicates whether or not the given execution has been cancelled.
     */
    public static boolean isCancelled(WindupExecution execution)
    {
        lock.readLock().lock();
        try
        {
            Boolean cancelled = cancelledMap.get(execution.getId());
            return cancelled != null && cancelled;
        }
        finally
        {
            lock.readLock().unlock();
        }
    }

    /**
     * Marks the execution as cancelled.
     */
    public static void setCancelled(WindupExecution execution)
    {
        lock.writeLock().lock();
        try
        {
            cancelledMap.put(execution.getId(), true);
        }
        finally
        {
            lock.writeLock().unlock();
        }
    }
}
