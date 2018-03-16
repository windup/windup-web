package org.jboss.windup.web.addons.websupport.rest.graph;

import org.jboss.windup.graph.GraphContext;

import java.nio.file.Path;

/**
 *
 * Maintains a graph connection pool.
 *
 * @author <a href="mailto:jesse.sightler@gmail.com">Jesse Sightler</a>
 */
public interface GraphCache {
    /**
     * Gets the given graph from the cache, opening it if needed.
     *
     * @param graphPath
     * @param create
     * @return
     */
    GraphContext getGraph(Path graphPath, boolean create);

    /**
     * Closes the specified graph.
     *
     * @param graphPath
     */
    void closeGraph(Path graphPath);

    /**
     * Close all open graphs.
     */
    void closeAll();
}
