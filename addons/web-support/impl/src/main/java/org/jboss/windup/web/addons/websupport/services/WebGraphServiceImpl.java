package org.jboss.windup.web.addons.websupport.services;

import com.tinkerpop.blueprints.Vertex;
import org.jboss.windup.graph.GraphContext;
import org.jboss.windup.graph.GraphContextFactory;

import javax.inject.Inject;
import java.nio.file.Path;
import java.nio.file.Paths;

/**
 * @author <a href="mailto:jesse.sightler@gmail.com">Jesse Sightler</a>
 */
public class WebGraphServiceImpl implements WebGraphService
{
    @Inject
    private GraphContextFactory graphContextFactory;

    @Override
    public Iterable<Vertex> getVerticesByType(String path, String vertexType)
    {
        return null;
    }

    private GraphContext loadGraph(String path)
    {
        Path graphPath = Paths.get(path);
        return graphContextFactory.load(graphPath);
    }
}
