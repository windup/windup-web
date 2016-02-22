package org.jboss.windup.web;

import org.jboss.windup.graph.GraphContext;
import org.jboss.windup.graph.GraphContextFactory;
import org.jboss.windup.web.addons.websupport.WindupWebServiceFactory;
import org.jboss.windup.web.addons.websupport.service.RegisteredApplicationService;

import javax.enterprise.context.ApplicationScoped;
import javax.inject.Inject;
import java.nio.file.Path;
import java.nio.file.Paths;

/**
 * @author <a href="mailto:jesse.sightler@gmail.com">Jesse Sightler</a>
 */
@ApplicationScoped
public class WindupWebServiceFactoryImpl implements WindupWebServiceFactory
{
    private static final String PROPERTY_DATA_DIR = "jboss.server.data.dir";
    private static final String DIR_NAME = "windup";

    @Inject
    private GraphContextFactory graphContextFactory;

    private GraphContext graphContext;

    public RegisteredApplicationService getRegisteredApplicationService()
    {
        return new RegisteredApplicationServiceImpl(getGlobalGraphContext());
    }

    public GraphContext getGlobalGraphContext()
    {
        if (graphContext == null)
        {
            synchronized (this)
            {
                if (graphContext == null)
                {
                    Path windupGraphDir = Paths.get(System.getProperty(PROPERTY_DATA_DIR)).resolve(DIR_NAME);
                    graphContext = graphContextFactory.create(windupGraphDir);
                }
            }
        }
        return this.graphContext;
    }
}
