package org.jboss.windup.web.services.producer;

import javax.annotation.PostConstruct;
import javax.enterprise.context.ApplicationScoped;
import javax.enterprise.event.Observes;
import javax.enterprise.inject.Produces;
import javax.inject.Inject;

import org.jboss.forge.furnace.Furnace;
import org.jboss.windup.config.metadata.RuleProviderRegistryCache;
import org.jboss.windup.graph.GraphContext;
import org.jboss.windup.graph.GraphContextFactory;
import org.jboss.windup.graph.model.WindupVertexFrame;
import org.jboss.windup.graph.service.Service;
import org.jboss.windup.web.addons.websupport.WebPathUtil;
import org.jboss.windup.web.addons.websupport.WindupWebServiceFactory;
import org.jboss.windup.web.addons.websupport.service.RegisteredApplicationService;

/**
 * Provides CDI Producer methods that take services from Furnace and allow them to be injected via CDI
 * as if they were provided by the web container itself.
 *
 * @author <a href="mailto:jesse.sightler@gmail.com">Jesse Sightler</a>
 */
@ApplicationScoped
public class WindupServicesProducer
{
    @Inject
    private Furnace furnace;

    private GraphContextFactory graphContextFactory;

    @PostConstruct
    public void postConstruct()
    {
        graphContextFactory = furnace.getAddonRegistry().getServices(GraphContextFactory.class).get();
    }

    public void destroy(@Observes FurnaceShutdownEvent shutdownEvent)
    {
        this.getWindupWebServiceFactory().destroy();
    }

    public <T extends WindupVertexFrame> Service<T> getService(Class<T> frameType)
    {
        return getGlobalGraphContext().service(frameType);
    }

    @Produces
    public WebPathUtil getWebPathUtil()
    {
        return furnace.getAddonRegistry().getServices(WebPathUtil.class).get();
    }

    @Produces
    public RuleProviderRegistryCache getRuleProviderRegistryCache()
    {
        return furnace.getAddonRegistry().getServices(RuleProviderRegistryCache.class).get();
    }

    @Produces
    public RegisteredApplicationService getRegisteredApplicationService()
    {
        return getWindupWebServiceFactory().getRegisteredApplicationService();
    }

    /**
     * Returns the graph used for the main windup UI (for example, maintaining a list of registered applications.
     */
    public GraphContext getGlobalGraphContext()
    {
        return getWindupWebServiceFactory().getGlobalGraphContext();
    }

    private WindupWebServiceFactory getWindupWebServiceFactory()
    {
        return furnace.getAddonRegistry().getServices(WindupWebServiceFactory.class).get();
    }

    @Produces
    public GraphContextFactory getGraphContextFactory()
    {
        return graphContextFactory;
    }
}
