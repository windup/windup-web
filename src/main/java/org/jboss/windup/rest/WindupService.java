package org.jboss.windup.rest;

import java.nio.file.Paths;

import javax.ejb.Stateless;
import javax.inject.Inject;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
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
@Path("/windup")
public class WindupService
{
    @Inject
    private Furnace furnace;

    @GET
    public void executeWindup(@QueryParam("inputPath") String inputPath, @QueryParam("outputPath") String outputPath)
    {
        Imported<WindupProcessor> importedProcessor = furnace.getAddonRegistry().getServices(WindupProcessor.class);
        Imported<GraphContextFactory> importedFactory = furnace.getAddonRegistry().getServices(GraphContextFactory.class);
        WindupProcessor processor = importedProcessor.get();
        GraphContextFactory factory = importedFactory.get();

        try (GraphContext context = factory.create(getDefaultPath()))
        {
            WindupConfiguration configuration = new WindupConfiguration()
                        .setGraphContext(context)
                        .addInputPath(Paths.get(inputPath))
                        .setOutputDirectory(Paths.get(outputPath));

            processor.execute(configuration);
        }
        catch (Exception e)
        {
            throw new RuntimeException(e);
        }
    }

    private java.nio.file.Path getDefaultPath()
    {
        return OperatingSystemUtils.getTempDirectory().toPath().resolve("Windup")
                    .resolve("windupgraph_" + RandomStringUtils.randomAlphanumeric(6));
    }
}
