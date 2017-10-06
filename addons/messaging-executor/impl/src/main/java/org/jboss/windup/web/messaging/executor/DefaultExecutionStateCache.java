package org.jboss.windup.web.messaging.executor;

import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.locks.ReadWriteLock;
import java.util.concurrent.locks.ReentrantReadWriteLock;

import javax.inject.Singleton;

import org.jboss.windup.web.services.model.WindupExecution;

/**
 * @author <a href="mailto:jesse.sightler@gmail.com">Jesse Sightler</a>
 */
@Singleton
public class DefaultExecutionStateCache implements ExecutionStateCache
{
    private static Map<Long, Boolean> cancelledMap = new HashMap<>();
    private static ReadWriteLock lock = new ReentrantReadWriteLock();

    @Override
    public boolean isCancelled(Long executionID)
    {
        lock.readLock().lock();
        try
        {
            Boolean cancelled = cancelledMap.get(executionID);
            return cancelled != null && cancelled;
        }
        finally
        {
            lock.readLock().unlock();
        }
    }

    @Override
    public void setCancelled(Long executionID)
    {
        lock.writeLock().lock();
        try
        {
            cancelledMap.put(executionID, true);
        }
        finally
        {
            lock.writeLock().unlock();
        }
    }
}
