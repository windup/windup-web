package org.jboss.windup.web.addons.websupport;

import java.nio.file.Files;
import java.nio.file.Path;

import javax.enterprise.context.ApplicationScoped;
import javax.inject.Inject;

import org.jboss.windup.graph.GraphContext;
import org.jboss.windup.graph.GraphContextFactory;

/**
 * @author <a href="mailto:jesse.sightler@gmail.com">Jesse Sightler</a>
 */
@ApplicationScoped
public class WindupWebServiceFactoryImpl implements WindupWebServiceFactory
{

    @Inject
    private GraphContextFactory graphContextFactory;

    @Inject
    private WebPathUtil webPathUtil;

    private GraphContext graphContext;

    @Override
    public void destroy()
    {
        try
        {
            getGlobalGraphContext().close();
        }
        catch (Throwable t)
        {
            // ignore for now
        }
    }

    public GraphContext getGlobalGraphContext()
    {
        if (graphContext == null)
        {
            synchronized (this)
            {
                if (graphContext == null)
                {
                    Path globalWindupPath = webPathUtil.getGlobalWindupDataPath();
                    Path globalGraphPath = globalWindupPath.resolve(GraphContextFactory.DEFAULT_GRAPH_SUBDIRECTORY);
                    if (Files.exists(globalGraphPath))
                        graphContext = graphContextFactory.load(globalGraphPath);
                    else
                        graphContext = graphContextFactory.create(globalGraphPath);
                }
            }
        }
        return this.graphContext;
    }
}
