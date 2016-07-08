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
import org.jboss.windup.web.addons.websupport.WebPathUtil;
import org.jboss.windup.web.addons.websupport.WindupWebServiceFactory;
import org.jboss.windup.web.addons.websupport.service.RegisteredApplicationService;
import org.jboss.windup.web.furnaceserviceprovider.FurnaceShutdownEvent;

/**
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

    @Produces
    public RuleProviderRegistryCache getRuleProviderRegistryCache()
    {
        return furnace.getAddonRegistry().getServices(RuleProviderRegistryCache.class).get();
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
