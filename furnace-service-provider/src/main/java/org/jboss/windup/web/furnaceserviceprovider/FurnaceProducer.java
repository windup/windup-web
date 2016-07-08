package org.jboss.windup.web.furnaceserviceprovider;

import java.nio.file.Path;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.Future;

import javax.enterprise.inject.spi.BeanManager;

import org.jboss.forge.furnace.Furnace;
import org.jboss.forge.furnace.exception.ContainerException;
import org.jboss.forge.furnace.repositories.AddonRepositoryMode;
import org.jboss.forge.furnace.se.FurnaceFactory;
import org.jboss.forge.furnace.spi.ContainerLifecycleListener;

public class FurnaceProducer
{
    private Furnace furnace;

    public Furnace getFurnace()
    {
        return furnace;
    }

    public void setup(Path repoDir)
    {
        System.out.println("Starting with repo: " + repoDir);
        Furnace furnace = FurnaceFactory.getInstance(Thread.currentThread()
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

        this.furnace = furnace;
    }

    public void destroy(BeanManager beanManager)
    {
        System.out.println("Shutting down forge!");
        beanManager.fireEvent(new FurnaceShutdownEvent());

        if (furnace != null)
        {
            FurnaceProducerFurnaceShutdownListener listener = new FurnaceProducerFurnaceShutdownListener();
            furnace.addContainerLifecycleListener(listener);

            furnace.stop();

            // make sure it is stopped
            while (!listener.shutdownComplete)
            {
                try
                {
                    Thread.sleep(100);
                }
                catch (Throwable t)
                {
                    return;
                }
            }
        }
    }

    private class FurnaceProducerFurnaceShutdownListener implements ContainerLifecycleListener
    {
        private boolean shutdownComplete;

        @Override
        public void beforeStart(Furnace furnace) throws ContainerException
        {

        }

        @Override
        public void beforeConfigurationScan(Furnace furnace) throws ContainerException
        {

        }

        @Override
        public void afterConfigurationScan(Furnace furnace) throws ContainerException
        {

        }

        @Override
        public void afterStart(Furnace furnace) throws ContainerException
        {

        }

        @Override
        public void beforeStop(Furnace furnace) throws ContainerException
        {

        }

        @Override
        public void afterStop(Furnace furnace) throws ContainerException
        {
            this.shutdownComplete = true;
        }
    }
}
