package org.jboss.windup.web.addons.websupport.rest.graph;

import java.nio.file.Paths;

import static org.mockito.Mockito.*;

import org.janusgraph.core.JanusGraph;
import org.jboss.windup.graph.GraphContext;
import org.jboss.windup.graph.GraphContextFactory;
import org.junit.Assert;
import org.junit.Test;

/**
 * Tests the {@link GraphContext} caching behavior.
 *
 * @author <a href="mailto:jesse.sightler@gmail.com">Jesse Sightler</a>
 */
public class GraphCacheTest
{
    private GraphContextFactory graphContextFactory;
    private GraphContext graphContext1;
    private GraphContext graphContext2;

    @SuppressWarnings("unchecked")
    public GraphContext getGraphContext1()
    {
        if (graphContext1 == null)
        {
            this.graphContext1 = mock(GraphContext.class);
            when(graphContext1.getGraph()).thenReturn(mock(JanusGraph.class));
        }
        return this.graphContext1;
    }

    @SuppressWarnings("unchecked")
    public GraphContext getGraphContext2()
    {
        if (graphContext2 == null)
        {
            this.graphContext2 = mock(GraphContext.class);
            when(graphContext2.getGraph()).thenReturn(mock(JanusGraph.class));
        }
        return this.graphContext2;
    }

    public GraphContextFactory getGraphContextFactory()
    {
        if (this.graphContextFactory == null)
            this.graphContextFactory = mock(GraphContextFactory.class);
        return this.graphContextFactory;
    }

    private GraphCacheImpl getGraphCache()
    {
        GraphCacheImpl graphCache = new GraphCacheImpl();

        GraphContextFactory graphContextFactory = getGraphContextFactory();
        graphCache.graphContextFactory = graphContextFactory;

        GraphContext graphContext1 = getGraphContext1();
        GraphContext graphContext2 = getGraphContext2();

        when(graphContextFactory.load(Paths.get("/path1"))).thenReturn(graphContext1);
        when(graphContextFactory.load(Paths.get("/path2"))).thenReturn(graphContext2);

        return graphCache;
    }

    @Test
    public void testReloadFromCache()
    {
        GraphCache cache = getGraphCache();
        GraphContext graph1 = cache.getGraph(Paths.get("/path1"), false);
        Assert.assertTrue(getGraphContext1() == graph1);

        // Confirm that this grabs the cached one
        graph1 = cache.getGraph(Paths.get("/path1"), false);

        // Since it should be cached, the actual graph load should only happen once
        inOrder(getGraphContextFactory())
                .verify(getGraphContextFactory(), calls(1)).load(Paths.get("/path1"));
    }

    @Test
    public void testPurgeFromCache()
    {
        GraphCacheImpl cache = getGraphCache();
        GraphContext graph1 = cache.getGraph(Paths.get("/path1"), false);
        Assert.assertTrue(getGraphContext1() == graph1);

        GraphContext graph2 = cache.getGraph(Paths.get("/path2"), false);
        Assert.assertTrue(getGraphContext2() == graph2);

        cache.graphCacheEntryMap.get(Paths.get("/path1")).lastUsageTime = System.currentTimeMillis() - (2*GraphCacheImpl.MAX_AGE);
        cache.purgeOldCachedGraphs();

        // Confirm that this grabs the cached one
        graph1 = cache.getGraph(Paths.get("/path1"), false);
        graph2 = cache.getGraph(Paths.get("/path2"), false);

        // Since it should be cached, the actual graph load should only happen once
        inOrder(getGraphContextFactory())
                .verify(getGraphContextFactory(), calls(2)).load(Paths.get("/path1"));
        inOrder(getGraphContextFactory())
                .verify(getGraphContextFactory(), calls(1)).load(Paths.get("/path2"));
    }
}
