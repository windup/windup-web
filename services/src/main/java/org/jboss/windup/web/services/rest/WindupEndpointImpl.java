package org.jboss.windup.web.services.rest;

import java.nio.file.Paths;
import java.util.HashMap;
import java.util.Map;

import javax.annotation.Resource;
import javax.ejb.Stateless;
import javax.enterprise.concurrent.ManagedExecutorService;
import javax.inject.Inject;
import javax.ws.rs.QueryParam;

import org.apache.commons.lang.RandomStringUtils;
import org.jboss.forge.furnace.Furnace;
import org.jboss.forge.furnace.services.Imported;
import org.jboss.forge.furnace.util.OperatingSystemUtils;
import org.jboss.windup.exec.WindupProcessor;
import org.jboss.windup.exec.configuration.WindupConfiguration;
import org.jboss.windup.graph.GraphContext;
import org.jboss.windup.graph.GraphContextFactory;
import org.jboss.windup.web.services.WebProperties;
import org.jboss.windup.web.services.WindupWebProgressMonitor;
import org.jboss.windup.web.services.dto.ProgressStatusDto;

@Stateless
public class WindupEndpointImpl implements WindupEndpoint
{
    @Inject
    private Furnace furnace;

    @Resource
    private ManagedExecutorService managedExecutorService;

    private Map<String, WindupWebProgressMonitor> progressMonitors = new HashMap<>();

    public ProgressStatusDto getStatus(String inputPath)
    {
        WindupWebProgressMonitor progressMonitor = progressMonitors.get(inputPath);
        boolean done = progressMonitor.isCancelled() || progressMonitor.isDone();
        return new ProgressStatusDto(progressMonitor.getTotalWork(), progressMonitor.getCurrentWork(), progressMonitor.getCurrentTask(), done);
    }

    public void executeWindup(String inputPath, String outputPath)
    {
        Runnable windupProcess = () -> {
            Imported<WindupProcessor> importedProcessor = furnace.getAddonRegistry().getServices(WindupProcessor.class);
            Imported<GraphContextFactory> importedFactory = furnace.getAddonRegistry().getServices(GraphContextFactory.class);
            WindupProcessor processor = importedProcessor.get();
            GraphContextFactory factory = importedFactory.get();

            WindupWebProgressMonitor progressMonitor = new WindupWebProgressMonitor();
            progressMonitors.put(inputPath, progressMonitor);

            try (GraphContext context = factory.create(getDefaultPath()))
            {
                WindupConfiguration configuration = new WindupConfiguration()
                            .setGraphContext(context)
                            .setProgressMonitor(progressMonitor)
                            .addDefaultUserRulesDirectory(WebProperties.getRulesRepository())
                            .addInputPath(Paths.get(inputPath))
                            .setOutputDirectory(Paths.get(outputPath));

                processor.execute(configuration);
            }
            catch (Exception e)
            {
                throw new RuntimeException(e);
            }
        };
        managedExecutorService.execute(windupProcess);
    }

    private java.nio.file.Path getDefaultPath()
    {
        return OperatingSystemUtils.getTempDirectory().toPath().resolve("Windup")
                    .resolve("windupgraph_" + RandomStringUtils.randomAlphanumeric(6));
    }
}
