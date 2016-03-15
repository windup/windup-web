package org.jboss.windup.web.services;

import java.nio.file.Path;
import java.util.logging.Logger;

import javax.servlet.ServletContextEvent;
import javax.servlet.ServletContextListener;
import javax.servlet.annotation.WebListener;

import org.apache.commons.io.FileUtils;
import org.jboss.windup.web.addons.websupport.WebPathUtil;

/**
 * @author <a href="mailto:jesse.sightler@gmail.com">Jesse Sightler</a>
 */
@WebListener
public class ServerCleanupOnStartup implements ServletContextListener
{
    private static Logger LOG = Logger.getLogger(ServerCleanupOnStartup.class.getSimpleName());

    public ServerCleanupOnStartup()
    {
    }

    @Override
    public void contextInitialized(ServletContextEvent sce)
    {
        clearData();
    }

    @Override
    public void contextDestroyed(ServletContextEvent sce)
    {
    }

    private void clearData()
    {
        Path globalWindupDir = WebPathUtil.getGlobalWindupDataPath();
        LOG.info("Clearing windup data from: " + globalWindupDir);
        try
        {
            FileUtils.deleteDirectory(globalWindupDir.toFile());
        }
        catch (Exception e)
        {
            LOG.warning("Failed to delete: " + WebPathUtil.getGlobalWindupDataPath() + " due to: " + e.getMessage());
        }
    }
}
