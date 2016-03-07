package org.jboss.windup.web.services.producer;

import org.jboss.forge.furnace.Furnace;
import org.jboss.windup.graph.GraphContextFactory;
import org.jboss.windup.web.addons.websupport.WindupWebServiceFactory;
import org.jboss.windup.web.addons.websupport.service.RegisteredApplicationService;

import javax.annotation.PostConstruct;
import javax.annotation.PreDestroy;
import javax.ejb.DependsOn;
import javax.enterprise.context.ApplicationScoped;
import javax.enterprise.event.Observes;
import javax.enterprise.inject.Produces;
import javax.inject.Inject;

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
    public RegisteredApplicationService getRegisteredApplicationService()
    {
        return getWindupWebServiceFactory().getRegisteredApplicationService();
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
