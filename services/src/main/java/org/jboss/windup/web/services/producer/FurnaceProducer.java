package org.jboss.windup.web.services.producer;

import java.nio.file.Path;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.Future;

import javax.annotation.PreDestroy;
import javax.enterprise.context.ApplicationScoped;
import javax.enterprise.context.Destroyed;
import javax.enterprise.event.Observes;
import javax.enterprise.inject.Produces;
import javax.enterprise.inject.spi.BeanManager;
import javax.inject.Inject;

import org.jboss.forge.furnace.ContainerStatus;
import org.jboss.forge.furnace.Furnace;
import org.jboss.forge.furnace.exception.ContainerException;
import org.jboss.forge.furnace.repositories.AddonRepositoryMode;
import org.jboss.forge.furnace.se.FurnaceFactory;
import org.jboss.forge.furnace.spi.ContainerLifecycleListener;
import org.jboss.windup.web.services.WebProperties;

@ApplicationScoped
public class FurnaceProducer
{
    @Inject
    private WebProperties webProperties;

    @Inject
    private BeanManager beanManager;

    private boolean destroyed = false;
    private Furnace furnace;

    private void setup(Path repoDir)
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

    @Produces
    public Furnace getFurnace()
    {
        if (!destroyed && furnace == null)
        {
            synchronized (this)
            {
                if (furnace == null)
                {
                    setup(webProperties.getAddonRepository());
                }
            }
        }

        return furnace;
    }

    @PreDestroy
    public void destroy(@Observes @Destroyed(ApplicationScoped.class) Object applicationScoped)
    {
        beanManager.fireEvent(new FurnaceShutdownEvent());

        this.destroyed = true;
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
