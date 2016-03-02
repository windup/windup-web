package org.jboss.windup.web.services.rest;

import java.nio.file.Paths;
import java.util.concurrent.Callable;

import javax.annotation.Resource;
import javax.ejb.Stateless;
import javax.enterprise.concurrent.ManagedExecutorService;
import javax.inject.Inject;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;

import org.apache.commons.lang.RandomStringUtils;
import org.jboss.forge.furnace.Furnace;
import org.jboss.forge.furnace.services.Imported;
import org.jboss.forge.furnace.util.OperatingSystemUtils;
import org.jboss.windup.exec.WindupProcessor;
import org.jboss.windup.exec.configuration.WindupConfiguration;
import org.jboss.windup.graph.GraphContext;
import org.jboss.windup.graph.GraphContextFactory;

@Stateless
@Path("windup")
@Produces("application/json")
public class WindupEndpoint
{
    @Inject
    private Furnace furnace;

    @Resource
    private ManagedExecutorService managedExecutorService;

    @POST
    public void registerApplication(@QueryParam("inputPath") String inputPath)
    {

    }

    @GET
    public void executeWindup(@QueryParam("inputPath") String inputPath, @QueryParam("outputPath") String outputPath)
    {
        Runnable windupProcess = () -> {
            Imported<WindupProcessor> importedProcessor = furnace.getAddonRegistry().getServices(WindupProcessor.class);
            Imported<GraphContextFactory> importedFactory = furnace.getAddonRegistry().getServices(GraphContextFactory.class);
            WindupProcessor processor = importedProcessor.get();
            GraphContextFactory factory = importedFactory.get();

            try (GraphContext context = factory.create(getDefaultPath()))
            {
                WindupConfiguration configuration = new WindupConfiguration()
                            .setGraphContext(context)
                            .setProgressMonitor(progressMonitor)
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
