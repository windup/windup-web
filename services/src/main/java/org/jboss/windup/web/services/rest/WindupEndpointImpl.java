package org.jboss.windup.web.services.rest;

import java.nio.file.Paths;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

import javax.annotation.Resource;
import javax.ejb.Stateless;
import javax.enterprise.concurrent.ManagedExecutorService;
import javax.inject.Inject;

import org.apache.commons.lang.RandomStringUtils;
import org.jboss.forge.furnace.Furnace;
import org.jboss.forge.furnace.services.Imported;
import org.jboss.forge.furnace.util.OperatingSystemUtils;
import org.jboss.windup.exec.WindupProcessor;
import org.jboss.windup.exec.configuration.WindupConfiguration;
import org.jboss.windup.graph.GraphContext;
import org.jboss.windup.graph.GraphContextFactory;
import org.jboss.windup.web.addons.websupport.model.RegisteredApplicationModel;
import org.jboss.windup.web.addons.websupport.service.RegisteredApplicationService;
import org.jboss.windup.web.services.WebProperties;
import org.jboss.windup.web.services.WindupWebProgressMonitor;
import org.jboss.windup.web.services.dto.ProgressStatusDto;

@Stateless
public class WindupEndpointImpl implements WindupEndpoint
{
    private static Map<RegisteredApplicationModel, WindupWebProgressMonitor> progressMonitors = new ConcurrentHashMap<>();
    @Inject
    private Furnace furnace;
    @Inject
    private WebProperties webProperties;
    @Inject
    private RegisteredApplicationService registeredApplicationService;
    @Resource
    private ManagedExecutorService managedExecutorService;

    @Override
    public ProgressStatusDto getStatus(RegisteredApplicationModel registeredApplicationModel)
    {
        registeredApplicationModel = refreshModel(registeredApplicationModel.getInputPath());
        WindupWebProgressMonitor progressMonitor = registeredApplicationModel == null ? null : progressMonitors.get(registeredApplicationModel);
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
    public void executeWindup(RegisteredApplicationModel originalRegisteredModel)
    {
        final String inputPath = originalRegisteredModel.getInputPath();

        // make sure we have the latest instance from the graph
        final RegisteredApplicationModel registeredApplicationModel = refreshModel(inputPath);

        Runnable windupProcess = () -> {
            Imported<WindupProcessor> importedProcessor = furnace.getAddonRegistry().getServices(WindupProcessor.class);
            Imported<GraphContextFactory> importedFactory = furnace.getAddonRegistry().getServices(GraphContextFactory.class);
            WindupProcessor processor = importedProcessor.get();
            GraphContextFactory factory = importedFactory.get();

            WindupWebProgressMonitor progressMonitor = new WindupWebProgressMonitor();
            progressMonitors.put(registeredApplicationModel, progressMonitor);

            try (GraphContext context = factory.create(getDefaultPath()))
            {
                WindupConfiguration configuration = new WindupConfiguration()
                            .setGraphContext(context)
                            .setProgressMonitor(progressMonitor)
                            .addDefaultUserRulesDirectory(webProperties.getRulesRepository())
                            .addInputPath(Paths.get(inputPath))
                            .setOutputDirectory(Paths.get(registeredApplicationModel.getOutputPath()));

                processor.execute(configuration);
            }
            catch (Exception e)
            {
                progressMonitor.setFailed(true);
                throw new RuntimeException(e);
            }
        };
        managedExecutorService.execute(windupProcess);
    }

    private RegisteredApplicationModel refreshModel(String inputPath)
    {
        return registeredApplicationService.getByInputPath(inputPath);
    }

    private java.nio.file.Path getDefaultPath()
    {
        return OperatingSystemUtils.getTempDirectory().toPath().resolve("Windup")
                    .resolve("windupgraph_" + RandomStringUtils.randomAlphanumeric(6));
    }
}
