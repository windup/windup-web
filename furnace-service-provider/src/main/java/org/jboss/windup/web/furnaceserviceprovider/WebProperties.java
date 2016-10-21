package org.jboss.windup.web.furnaceserviceprovider;

import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Properties;
import java.util.logging.Logger;

/**
 * Implements tools for finding the addon and rules directories.
 *
 * @author <a href="mailto:jesse.sightler@gmail.com">Jesse Sightler</a>
 */
public class WebProperties
{
    public static final String FURNACE_PROPERTIES = "/windupweb.properties";
    public static final String ADDON_REPOSITORY = "addon.repository";
    public static final String RULES_REPOSITORY = "rules.repository";

    private static Logger LOG = Logger.getLogger(WebProperties.class.getName());

    private static class LazyHolder
    {
        private static final WebProperties INSTANCE = new WebProperties();
    }

    private Properties properties = new Properties();
    private Path addonRepository;
    private Path rulesRepository;

    public static WebProperties getInstance()
    {
        return LazyHolder.INSTANCE;
    }

    private WebProperties()
    {
        init();
    }

    public Path getAddonRepository()
    {
        return addonRepository;
    }

    public Path getRulesRepository()
    {
        return rulesRepository;
    }

    private void init()
    {
        if (addonRepository != null)
            return;

        try (InputStream is = getClass().getResourceAsStream(FURNACE_PROPERTIES))
        {
            if (is != null)
            {
                this.properties.load(is);
                addonRepository = Paths.get(properties.getProperty(ADDON_REPOSITORY).trim());
                rulesRepository = Paths.get(properties.getProperty(RULES_REPOSITORY));
            }
        }
        catch (IOException e)
        {
            throw new IllegalStateException("Cannot load addon repository due to: " + e.getMessage(), e);
        }

        Path servletContextPath = getServletContextPhysicalPath();
        if (servletContextPath == null && addonRepository == null)
            throw new IllegalArgumentException("Could not determine addon repository location!");

        if (servletContextPath == null && rulesRepository == null)
            throw new IllegalArgumentException("Could not determine rules repository location!");

        if (addonRepository == null)
        {
            addonRepository = servletContextPath.resolve("WEB-INF").resolve("windup-distribution").resolve("addons");

            if (!Files.isDirectory(addonRepository))
                throw new IllegalStateException("Cannot load addon repository: " + addonRepository);
        }

        if (rulesRepository == null)
        {
            rulesRepository = servletContextPath.resolve("WEB-INF").resolve("windup-distribution").resolve("rules");
            if (!Files.isDirectory(rulesRepository))
                throw new IllegalStateException("Cannot load rules repository: " + rulesRepository);
        }

        if (System.getProperty("windup.home") == null)
            System.setProperty("windup.home", rulesRepository.getParent().toAbsolutePath().toString());
    }

    private Path getServletContextPhysicalPath()
    {
        try
        {
            String pathString = FurnaceExtension.class.getProtectionDomain().getCodeSource().getLocation().toURI().getPath();
            LOG.info("Path String: " + pathString);
            Path path = Paths.get(pathString);
            if (!Files.isRegularFile(path))
                return null;

            // From /path/to/WEB-INF/libs/lib.jar to /path/to/
            path = path.getParent().getParent().getParent();
            if (!Files.isDirectory(path))
                return null;

            return path;
        } catch (Exception e)
        {
            return null;
        }
    }
}
