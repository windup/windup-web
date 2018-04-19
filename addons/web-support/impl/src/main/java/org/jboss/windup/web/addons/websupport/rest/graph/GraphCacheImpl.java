package org.jboss.windup.web.addons.websupport.rest.graph;

import java.nio.file.Path;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.logging.Logger;
import java.util.stream.Collectors;

import javax.annotation.PostConstruct;
import javax.inject.Inject;
import javax.inject.Singleton;

import org.apache.tinkerpop.gremlin.structure.Property;
import org.apache.tinkerpop.gremlin.structure.Vertex;
import org.jboss.forge.furnace.Furnace;
import org.jboss.forge.furnace.exception.ContainerException;
import org.jboss.forge.furnace.spi.ContainerLifecycleListener;
import org.jboss.windup.graph.GraphContext;
import org.jboss.windup.graph.GraphContextFactory;
import org.jboss.windup.graph.GraphListener;

/**
 * Contains a cache for connecting to the graph efficiently from multiple threads. This will keep a connection open for {@link GraphCache#MAX_AGE}
 * millis after the last usage.
 *
 * @author <a href="mailto:jesse.sightler@gmail.com">Jesse Sightler</a>
 */
@Singleton
public class GraphCacheImpl implements GraphCache
{
    protected static final long MAX_AGE = 1000L * 60L * 10L;
    private static Logger LOG = Logger.getLogger(GraphCache.class.getName());

    @Inject
    protected GraphContextFactory graphContextFactory;
    protected Map<Path, GraphCacheEntry> graphCacheEntryMap = new ConcurrentHashMap<>();

    @Inject
    private Furnace furnace;

    @PostConstruct
    public void postConstruct()
    {
        this.furnace.addContainerLifecycleListener(new ContainerLifecycleListener()
        {
            @Override
            public void beforeStart(Furnace furnace) throws ContainerException
            {

            }

            @Override
            public void beforeConfigurationScan(Furnace furnace) throws ContainerException
            {

            }

            @Override
            public void afterConfigurationScan(Furnace furnace) throws ContainerException
            {

            }

            @Override
            public void afterStart(Furnace furnace) throws ContainerException
            {

            }

            @Override
            public void beforeStop(Furnace furnace) throws ContainerException
            {
                GraphCacheImpl.this.cleanup();
            }

            @Override
            public void afterStop(Furnace furnace) throws ContainerException
            {

            }
        });
    }

    @Override
    public void closeAll() {
        graphContextFactory.closeAll();
    }

    private void cleanup()
    {
        LOG.info("Furnace is shutting down, closing existing graph connections.");
        // Close each one and remove it from the list
        graphCacheEntryMap.entrySet().forEach((entry) -> {
            Path path = entry.getKey();
            try
            {
                LOG.info("Purging connnection from the cache for graph path: " + path);
                entry.getValue().graphContext.close();
                LOG.info("Connection closed for: " + path);
            }
            catch (Throwable t)
            {
                t.printStackTrace();
                LOG.warning("Failed to close graph at: " + path + " due to: " + t.getMessage());
            }
        });
        graphCacheEntryMap.clear();
    }

    /**
     * Gets the graph at the given {@link Path}. This will be from the cache if possible. If a cached entry is not available, then a new one will be
     * loaded.
     */
    @Override
    public GraphContext getGraph(Path graphPath, boolean create)
    {
        GraphCacheEntry graphCacheEntry = graphCacheEntryMap.get(graphPath);
        if (graphCacheEntry == null)
        {
            loadGraphEntry(graphPath, create);
            graphCacheEntry = graphCacheEntryMap.get(graphPath);
        }
        else
        {
            LOG.info("Retrieving cached graph for: " + graphPath);
        }
        graphCacheEntry.updateLastUsageTime();
        return graphCacheEntry.graphContext;
    }

    /**
     * If a graph is open for this path, insure that it is closed.
     */
    @Override
    public void closeGraph(Path graphPath)
    {
        GraphCacheEntry cacheEntry = graphCacheEntryMap.get(graphPath);
        if (cacheEntry == null)
            return;

        try
        {
            cacheEntry.graphContext.close();
        }
        catch (Exception e)
        {
            LOG.warning("Failed to close graph at: " + graphPath + " due to: " + e.getMessage());
        }
        graphCacheEntryMap.remove(graphPath);
    }

    /**
     * Loads the graph, and puts the new value into the Cache.
     */
    public void loadGraphEntry(Path graphPath, boolean create)
    {
        // If it is already cached, we don't need to proceed further.
        if (graphCacheEntryMap.containsKey(graphPath))
            return;

        LOG.info("Creating cached graph for: " + graphPath);
        GraphContext graphContext = create ? graphContextFactory.create(graphPath, true) : graphContextFactory.load(graphPath);
        GraphCacheEntry graphCacheEntry = new GraphCacheEntry(graphContext);
        this.graphCacheEntryMap.put(graphPath, graphCacheEntry);
    }

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
            }
            catch (Throwable t)
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
            graphContext.registerGraphListener(new GraphListener() {
                @Override
                public void vertexAdded(Vertex vertex) {
                    updateLastUsageTime();
                }


                @Override
                public void vertexPropertyChanged(Vertex element, Property oldValue, Object setValue, Object... vertexPropertyKeyValues) {
                    updateLastUsageTime();
                }
            });
        }

        public void updateLastUsageTime()
        {
            this.lastUsageTime = System.currentTimeMillis();
        }
    }
}
