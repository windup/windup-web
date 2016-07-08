package org.jboss.windup.web.furnaceserviceprovider;

import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Properties;

/**
 * @author <a href="mailto:jesse.sightler@gmail.com">Jesse Sightler</a>
 */
public class WebProperties
{
    public static final String FURNACE_PROPERTIES = "/windupweb.properties";
    public static final String ADDON_REPOSITORY = "addon.repository";
    public static final String RULES_REPOSITORY = "rules.repository";

    private static WebProperties instance;
    private Properties properties = new Properties();
    private Path addonRepository;
    private Path rulesRepository;

    public static WebProperties getInstance()
    {
        if (instance == null)
        {
            synchronized (WebProperties.class)
            {
                if (instance == null)
                    instance = new WebProperties();
            }
        }
        return instance;
    }

    private WebProperties()
    {
    }

    public Path getAddonRepository()
    {
        init();
        return addonRepository;
    }

    public Path getRulesRepository()
    {
        init();
        return rulesRepository;
    }

    public void init()
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
            addonRepository = servletContextPath.resolve("WEB-INF").resolve("addon-repository");

            if (!Files.isDirectory(addonRepository))
                throw new IllegalStateException("Cannot load addon repository: " + addonRepository);
        }

        if (rulesRepository == null)
        {
            rulesRepository = servletContextPath.resolve("WEB-INF").resolve("rules");
            if (!Files.isDirectory(rulesRepository))
                throw new IllegalStateException("Cannot load rules repository: " + rulesRepository);
        }
    }

    private Path getServletContextPhysicalPath()
    {
        try
        {
            String pathString = FurnaceExtension.class.getProtectionDomain().getCodeSource().getLocation().toURI().getPath();
            System.out.println("Path String: " + pathString);
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
