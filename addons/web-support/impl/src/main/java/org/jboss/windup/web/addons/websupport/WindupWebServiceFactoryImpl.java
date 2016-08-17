package org.jboss.windup.web.addons.websupport;

import java.nio.file.Files;
import java.nio.file.Path;

import javax.enterprise.context.ApplicationScoped;
import javax.inject.Inject;

import org.jboss.windup.graph.GraphContext;
import org.jboss.windup.graph.GraphContextFactory;
import org.jboss.windup.web.addons.websupport.WebPathUtil;
import org.jboss.windup.web.addons.websupport.WindupWebServiceFactory;

/**
 * @author <a href="mailto:jesse.sightler@gmail.com">Jesse Sightler</a>
 */
@ApplicationScoped
public class WindupWebServiceFactoryImpl implements WindupWebServiceFactory
{
    private static String GRAPH_PATH = "graph";

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
                    Path globalGraphPath = globalWindupPath.resolve(GRAPH_PATH);
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
