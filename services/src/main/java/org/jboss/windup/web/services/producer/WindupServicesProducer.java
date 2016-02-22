package org.jboss.windup.web.services.producer;

import org.jboss.forge.furnace.Furnace;
import org.jboss.windup.graph.GraphContextFactory;
import org.jboss.windup.web.addons.websupport.WindupWebServiceFactory;
import org.jboss.windup.web.addons.websupport.service.RegisteredApplicationService;

import javax.annotation.PostConstruct;
import javax.enterprise.context.ApplicationScoped;
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

    @Produces
    public RegisteredApplicationService getRegisteredApplicationService()
    {
        WindupWebServiceFactory factory = furnace.getAddonRegistry().getServices(WindupWebServiceFactory.class).get();
        return factory.getRegisteredApplicationService();
    }

    @Produces
    public GraphContextFactory getGraphContextFactory()
    {
        return graphContextFactory;
    }
}
