package org.jboss.windup.web.services.rest.graph;

import java.nio.file.Path;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.logging.Logger;
import java.util.stream.Collectors;

import javax.ejb.Lock;
import javax.ejb.LockType;
import javax.ejb.Schedule;
import javax.ejb.Singleton;
import javax.inject.Inject;

import org.jboss.windup.graph.GraphContext;
import org.jboss.windup.graph.GraphContextFactory;
import org.jboss.windup.web.services.producer.WindupServicesProducer;

/**
 * Contains a cache for connecting to the graph efficiently from multiple threads. This will keep a connection open
 * for {@link GraphCache#MAX_AGE} millis after the last usage.
 *
 * @author <a href="mailto:jesse.sightler@gmail.com">Jesse Sightler</a>
 */
@Singleton
public class GraphCache
{
    private static Logger LOG = Logger.getLogger(GraphCache.class.getName());

    protected static final long MAX_AGE = 1000L * 60L * 10L;

    @Inject
    protected WindupServicesProducer servicesProducer;

    protected Map<Path, GraphCacheEntry> graphCacheEntryMap = new ConcurrentHashMap<>();

    /**
     * Gets the graph at the given {@link Path}. This will be from the cache if possible. If a cached entry is not
     * available, then a new one will be loaded.
     */
    @Lock(LockType.READ) // Allow concurrent reads
    public GraphContext getGraph(Path graphPath)
    {
        GraphCacheEntry graphCacheEntry = graphCacheEntryMap.get(graphPath);
        if (graphCacheEntry == null)
        {
            /*
             * In this case, call a separate method with a WRITE lock, as we will be altering the cache
             */
            loadGraphEntry(graphPath);
            graphCacheEntry = graphCacheEntryMap.get(graphPath);
        } else
        {
            LOG.info("Retrieving cached graph for: " + graphPath);
        }
        graphCacheEntry.updateLastUsageTime();
        return graphCacheEntry.graphContext;
    }

    /**
     * Loads the graph, and puts the new value into the Cache. This requires a write lock, for concurrency reasons.
     */
    @Lock(LockType.WRITE) // Disallow concurrency during cache modification
    public void loadGraphEntry(Path graphPath)
    {
        // If it is already cached, we don't need to proceed further.
        if (graphCacheEntryMap.containsKey(graphPath))
            return;

        LOG.info("Creating cached graph for: " + graphPath);
        GraphContextFactory graphContextFactory = servicesProducer.getGraphContextFactory();
        GraphContext graphContext = graphContextFactory.load(graphPath);
        GraphCacheEntry graphCacheEntry = new GraphCacheEntry(graphContext);
        this.graphCacheEntryMap.put(graphPath, graphCacheEntry);
    }

    @Schedule(hour = "*", minute = "43")
    @Lock(LockType.WRITE) // Disallow concurrency during graph modification
    public void purgeOldCachedGraphs()
    {
        long minAge = System.currentTimeMillis() - MAX_AGE;

        // Gets the list of GraphContexts that have not been used recently
        List<Path> pathsToRemove = this.graphCacheEntryMap.entrySet().stream()
                .filter((entry) -> entry.getValue().lastUsageTime < minAge)
                .map((entry) -> entry.getKey())
                .collect(Collectors.toList());

        // Close each one and remove it from the list
        pathsToRemove.forEach((path) -> {
            GraphCacheEntry entry = graphCacheEntryMap.remove(path);
            try
            {
                LOG.info("Purging connnection from the cache for graph path: " + path);
                entry.graphContext.close();
            } catch (Throwable t)
            {
                LOG.warning("Failed to close graph at: " + path + " due to: " + t.getMessage());
            }
        });
    }

    protected class GraphCacheEntry
    {
        protected long lastUsageTime;
        private GraphContext graphContext;

        public GraphCacheEntry(GraphContext graphContext)
        {
            this.lastUsageTime = System.currentTimeMillis();
            this.graphContext = graphContext;
        }

        public void updateLastUsageTime()
        {
            this.lastUsageTime = System.currentTimeMillis();
        }
    }
}
