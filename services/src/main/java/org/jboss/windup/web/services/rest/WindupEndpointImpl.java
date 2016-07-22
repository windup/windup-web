package org.jboss.windup.web.services.rest;

import java.nio.file.Paths;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.logging.Level;
import java.util.logging.Logger;

import javax.annotation.Resource;
import javax.ejb.Stateless;
import javax.enterprise.concurrent.ManagedExecutorService;
import javax.inject.Inject;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Root;

import org.apache.commons.lang.RandomStringUtils;
import org.jboss.forge.furnace.Furnace;
import org.jboss.forge.furnace.services.Imported;
import org.jboss.forge.furnace.util.OperatingSystemUtils;
import org.jboss.windup.exec.WindupProcessor;
import org.jboss.windup.exec.configuration.WindupConfiguration;
import org.jboss.windup.graph.GraphContext;
import org.jboss.windup.graph.GraphContextFactory;
import org.jboss.windup.web.furnaceserviceprovider.WebProperties;
import org.jboss.windup.web.services.model.RegisteredApplication;
import org.jboss.windup.web.services.model.RegisteredApplication_;
import org.jboss.windup.web.services.WindupWebProgressMonitor;
import org.jboss.windup.web.services.dto.ProgressStatusDto;

@Stateless
public class WindupEndpointImpl implements WindupEndpoint
{
    private static Logger LOG = Logger.getLogger(WindupEndpointImpl.class.getSimpleName());

    private static Map<RegisteredApplication, WindupWebProgressMonitor> progressMonitors = new ConcurrentHashMap<>();

    @Inject
    private Furnace furnace;

    @PersistenceContext
    private EntityManager entityManager;

    private WebProperties webProperties = WebProperties.getInstance();

    @Resource
    private ManagedExecutorService managedExecutorService;

    @Override
    public ProgressStatusDto getStatus(RegisteredApplication registeredApplication)
    {
        WindupWebProgressMonitor progressMonitor = registeredApplication == null ? null : progressMonitors.get(registeredApplication);
        if (progressMonitor == null)
            return new ProgressStatusDto(0, 0, "Not Started", false, false, false);
        else
        {
            boolean failed = progressMonitor.isFailed();
            boolean done = failed || progressMonitor.isCancelled() || progressMonitor.isDone();
            return new ProgressStatusDto(progressMonitor.getTotalWork(), progressMonitor.getCurrentWork(), progressMonitor.getCurrentTask(), true,
                        done, failed);
        }
    }

    @Override
    public void executeWindup(RegisteredApplication originalRegisteredDto)
    {
        final String inputPath = originalRegisteredDto.getInputPath();

        // make sure we have the latest instance from the graph
        final RegisteredApplication registeredApplication = refreshModel(inputPath);

        Runnable windupProcess = () -> {
            Imported<WindupProcessor> importedProcessor = furnace.getAddonRegistry().getServices(WindupProcessor.class);
            Imported<GraphContextFactory> importedFactory = furnace.getAddonRegistry().getServices(GraphContextFactory.class);
            WindupProcessor processor = importedProcessor.get();
            GraphContextFactory factory = importedFactory.get();

            WindupWebProgressMonitor progressMonitor = new WindupWebProgressMonitor();
            progressMonitors.put(registeredApplication, progressMonitor);

            try (GraphContext context = factory.create(getDefaultPath()))
            {
                WindupConfiguration configuration = new WindupConfiguration()
                            .setGraphContext(context)
                            .setProgressMonitor(progressMonitor)
                            .addDefaultUserRulesDirectory(webProperties.getRulesRepository())
                            .addInputPath(Paths.get(inputPath))
                            .setOutputDirectory(Paths.get(registeredApplication.getOutputPath()));

                processor.execute(configuration);
            }
            catch (Exception e)
            {
                progressMonitor.setFailed(true);
                LOG.log(Level.WARNING, "Processing of " + inputPath + " failed due to: " + e.getMessage(), e);
                throw new RuntimeException(e);
            }
        };
        managedExecutorService.execute(windupProcess);
    }

    private RegisteredApplication refreshModel(String inputPath)
    {
        CriteriaBuilder builder = entityManager.getCriteriaBuilder();
        CriteriaQuery<RegisteredApplication> criteriaQuery = builder.createQuery(RegisteredApplication.class);
        Root<RegisteredApplication> root = criteriaQuery.from(RegisteredApplication.class);
        criteriaQuery.where(builder.equal(root.get(RegisteredApplication_.inputPath), inputPath));
        return entityManager.createQuery(criteriaQuery).getSingleResult();
    }

    private java.nio.file.Path getDefaultPath()
    {
        return OperatingSystemUtils.getTempDirectory().toPath().resolve("Windup")
                    .resolve("windupgraph_" + RandomStringUtils.randomAlphanumeric(6));
    }
}
