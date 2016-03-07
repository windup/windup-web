package org.jboss.windup.web.services.producer;

import java.io.File;
import java.nio.file.Path;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.Future;

import javax.annotation.PreDestroy;
import javax.enterprise.context.ApplicationScoped;
import javax.enterprise.inject.Produces;

import org.jboss.forge.furnace.Furnace;
import org.jboss.forge.furnace.repositories.AddonRepositoryMode;
import org.jboss.forge.furnace.se.FurnaceFactory;
import org.jboss.windup.web.services.WebProperties;

@ApplicationScoped
public class FurnaceProducer
{
    private Furnace furnace;

    private void setup(Path repoDir)
    {
        furnace = FurnaceFactory.getInstance(Thread.currentThread()
                    .getContextClassLoader(), Thread.currentThread()
                                .getContextClassLoader());
        furnace.addRepository(AddonRepositoryMode.IMMUTABLE, repoDir.toFile());
        Future<Furnace> future = furnace.startAsync();

        try
        {
            future.get();
        }
        catch (InterruptedException | ExecutionException e)
        {
            throw new RuntimeException("Furnace failed to start.", e);
        }

    }

    @Produces
    public Furnace getFurnace()
    {
        if (furnace == null)
        {
            synchronized (this)
            {
                if (furnace == null)
                {
                    setup(WebProperties.getAddonRepository());
                }
            }
        }

        return furnace;
    }

    @PreDestroy
    public void destroy()
    {
        furnace.stop();
    }
}
