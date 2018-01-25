package org.jboss.windup.web.services.rest;

import org.jboss.windup.web.addons.websupport.rest.graph.HardcodedIPResource;
import org.jboss.windup.web.addons.websupport.rest.graph.HibernateResource;
import org.jboss.windup.web.addons.websupport.rest.graph.RemoteServicesResource;
import org.jboss.windup.web.addons.websupport.rest.graph.aggregatedStatistics.AggregatedStatisticsEndpoint;
import org.jboss.windup.web.addons.websupport.rest.FurnaceRESTGraphAPI;
import org.jboss.windup.web.addons.websupport.rest.MigrationIssuesEndpoint;
import org.jboss.windup.web.addons.websupport.rest.TagResource;
import org.jboss.windup.web.addons.websupport.rest.graph.ClassificationResource;
import org.jboss.windup.web.addons.websupport.rest.graph.DependenciesReportResource;
import org.jboss.windup.web.addons.websupport.rest.graph.EJBResource;
import org.jboss.windup.web.addons.websupport.rest.graph.HintResource;
import org.jboss.windup.web.addons.websupport.rest.graph.LinkResource;
import org.jboss.windup.web.addons.websupport.rest.graph.applicationDetails.ApplicationDetailsResource;
import org.jboss.windup.web.addons.websupport.rest.graph.TechnologyTagResource;
import org.jboss.windup.web.services.service.DefaultGraphPathLookup;
import org.jboss.windup.web.addons.websupport.rest.graph.FileModelResource;
import org.jboss.windup.web.addons.websupport.rest.graph.GraphResource;
import org.jboss.windup.web.furnaceserviceprovider.FromFurnace;
import org.jboss.windup.web.services.service.ReportFilterServiceImpl;

import javax.inject.Inject;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.ws.rs.ApplicationPath;
import javax.ws.rs.core.Application;
import java.util.HashSet;
import java.util.Set;
import java.util.logging.Logger;

/**
 * @author <a href="mailto:jesse.sightler@gmail.com">Jesse Sightler</a>
 */
@ApplicationPath(RestApplicationFurnace.REST_BASE)
public class RestApplicationFurnace extends Application {
    private static Logger LOG = Logger.getLogger(RestApplicationFurnace.class.getName());

    public static final String REST_BASE = "/furnace";

    @Inject @FromFurnace
    private GraphResource graphResource;

    @Inject @FromFurnace
    private FileModelResource fileModelResource;

    @Inject @FromFurnace
    private MigrationIssuesEndpoint migrationIssuesEndpoint;

    @Inject
    @FromFurnace
    private AggregatedStatisticsEndpoint aggregatedStatisticsEndPoint;

    @Inject @FromFurnace
    private ClassificationResource classificationResource;

    @Inject @FromFurnace
    private HintResource hintResource;

    @Inject @FromFurnace
    private TechnologyTagResource technologyTagResource;

    @Inject @FromFurnace
    private LinkResource linkResource;

    @Inject @FromFurnace
    private ApplicationDetailsResource applicationDetailsResource;

    @Inject @FromFurnace
    private TagResource tagResource;

    @Inject @FromFurnace
    private DependenciesReportResource dependenciesReportResource;

    @Inject @FromFurnace
    private EJBResource ejbResource;

    @Inject @FromFurnace
    private HardcodedIPResource hardcodedIPResource;

    @Inject @FromFurnace
    private HibernateResource hibernateResource;

    @Inject @FromFurnace
    private RemoteServicesResource remoteServicesResource;

    @PersistenceContext
    private EntityManager entityManager;

    @Override
    public Set<Class<?>> getClasses() {
        Set<Class<?>> singletons = new HashSet<>(super.getClasses());
        singletons.add(ForgeProxyMarshaller.class);
        singletons.add(ExceptionHandler.class);
        singletons.add(UnhandledExceptionHandler.class);
        return singletons;
    }

    @Override
    public Set<Object> getSingletons()
    {
        Set<Object> singletons = new HashSet<>(super.getSingletons());
        addService(singletons, graphResource);
        addService(singletons, fileModelResource);
        addService(singletons, migrationIssuesEndpoint);
        addService(singletons, aggregatedStatisticsEndPoint);
        addService(singletons, classificationResource);
        addService(singletons, hintResource);
        addService(singletons, technologyTagResource);
        addService(singletons, linkResource);
        addService(singletons, applicationDetailsResource);
        addService(singletons, tagResource);
        addService(singletons, dependenciesReportResource);
        addService(singletons, ejbResource);
        addService(singletons, hardcodedIPResource);
        addService(singletons, hibernateResource);
        addService(singletons, remoteServicesResource);

        return singletons;
    }

    private void addService(Set<Object> singletons, Object service)
    {
        if (service instanceof FurnaceRESTGraphAPI)
        {
            LOG.info("Adding graph REST service from furnace: " + service);
            FurnaceRESTGraphAPI furnaceService = ((FurnaceRESTGraphAPI) service);
            furnaceService.setGraphPathLookup(new DefaultGraphPathLookup(this.entityManager));
            furnaceService.setReportFilterService(new ReportFilterServiceImpl(this.entityManager));
        }
        else
        {
            LOG.info("Adding REST service from furnace: " + service);
        }

        singletons.add(service);
    }
}
