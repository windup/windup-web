package org.jboss.windup.rest.startup;

import java.io.File;

import javax.enterprise.inject.Instance;
import javax.inject.Inject;
import javax.servlet.ServletContextEvent;
import javax.servlet.ServletContextListener;
import javax.servlet.annotation.WebListener;

import org.jboss.windup.rest.producer.FurnaceProducer;

/**
 * Application Lifecycle Listener implementation class StartupListener
 *
 */
@WebListener
public class StartupListener implements ServletContextListener
{

    @Inject
    Instance<FurnaceProducer> furnaceProducer;

    @Override
    public void contextInitialized(ServletContextEvent sce)
    {
        /**
         * FIXME - This should probably unzip the addons from WEB-INF/addon-repository and use that temp directory
         * instead of trying to access the exploded WAR directly (we can't assume that the WAR will actually be run
         * exploded.)
         */
        File addonRepository = new File(sce.getServletContext().getRealPath("/WEB-INF/addon-repository"));
        if (!addonRepository.exists())
            addonRepository = new File(
                        "/home/jsightler/project/migration/software/windup-distribution/target/windup-distribution-2.5.0-SNAPSHOT/addons/");
        if (!addonRepository.exists())
            throw new IllegalStateException("Cannot load addon repository: " + addonRepository);
        furnaceProducer.get().setup(addonRepository);
    }

    /**
     * @see ServletContextListener#contextDestroyed(ServletContextEvent)
     */
    @Override
    public void contextDestroyed(ServletContextEvent sce)
    {
    }

}
