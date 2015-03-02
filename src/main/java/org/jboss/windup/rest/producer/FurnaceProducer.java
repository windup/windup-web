package org.jboss.windup.rest.producer;

import java.io.File;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.Future;

import javax.annotation.PreDestroy;
import javax.enterprise.context.ApplicationScoped;
import javax.enterprise.inject.Produces;

import org.jboss.forge.furnace.Furnace;
import org.jboss.forge.furnace.repositories.AddonRepositoryMode;
import org.jboss.forge.furnace.se.FurnaceFactory;

@ApplicationScoped
public class FurnaceProducer
{

    private Furnace furnace;

    public void setup(File repoDir)
    {
        furnace = FurnaceFactory.getInstance(Thread.currentThread()
                    .getContextClassLoader(), Thread.currentThread()
                    .getContextClassLoader());
        furnace.addRepository(AddonRepositoryMode.IMMUTABLE, repoDir);
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
        return furnace;
    }

    @PreDestroy
    public void destroy()
    {
        furnace.stop();
    }
}
