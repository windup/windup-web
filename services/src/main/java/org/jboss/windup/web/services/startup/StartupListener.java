package org.jboss.windup.web.services.startup;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.util.Properties;

import javax.enterprise.inject.Instance;
import javax.inject.Inject;
import javax.servlet.ServletContextEvent;
import javax.servlet.ServletContextListener;
import javax.servlet.annotation.WebListener;

import org.apache.commons.lang3.StringUtils;
import org.jboss.windup.web.services.producer.FurnaceProducer;

/**
 * Application Lifecycle Listener implementation class StartupListener
 *
 */
@WebListener
public class StartupListener implements ServletContextListener
{
    public static final String FURNACE_PROPERTIES = "/furnace.properties";
    public static final String ADDON_REPOSITORY = "addon.repository";

    @Inject
    Instance<FurnaceProducer> furnaceProducer;

    @Override
    public void contextInitialized(ServletContextEvent sce)
    {
        File addonRepository = null;
        try (InputStream is = getClass().getResourceAsStream(FURNACE_PROPERTIES))
        {
            if (is != null)
            {
                Properties properties = new Properties();
                properties.load(is);

                addonRepository = new File(properties.getProperty(ADDON_REPOSITORY).trim());
            }
        }
        catch (IOException e)
        {
            throw new IllegalStateException("Cannot load addon repository due to: " + e.getMessage(), e);
        }

        if (addonRepository == null) {
            addonRepository = new File(sce.getServletContext().getRealPath("/WEB-INF/addon-repository"));
            if (!addonRepository.exists())
                throw new IllegalStateException("Cannot load addon repository: " + addonRepository);
        }
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
