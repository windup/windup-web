package org.jboss.windup.web.furnaceserviceprovider;

import org.jboss.vfs.VFS;
import org.jboss.vfs.VirtualFile;

import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.net.URL;
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
    public static final String LABELS_REPOSITORY = "labels.repository";

    private static Logger LOG = Logger.getLogger(WebProperties.class.getName());

    private static class LazyHolder
    {
        private static final WebProperties INSTANCE = new WebProperties();
    }

    private Properties properties = new Properties();
    private Path addonRepository;
    private Path rulesRepository;
    private Path labelsRepository;

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

    public Path getLabelsRepository()
    {
        return labelsRepository;
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
                labelsRepository = Paths.get(properties.getProperty(LABELS_REPOSITORY));
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
        if (servletContextPath == null && labelsRepository == null)
            throw new IllegalArgumentException("Could not determine labels repository location!");

        if (addonRepository == null)
        {
            addonRepository = servletContextPath.resolve("WEB-INF").resolve("mta-cli").resolve("addons");

            if (!Files.isDirectory(addonRepository))
                throw new IllegalStateException("Cannot load addon repository: " + addonRepository);
        }

        if (rulesRepository == null)
        {
            rulesRepository = servletContextPath.resolve("WEB-INF").resolve("mta-cli").resolve("rules");
            if (!Files.isDirectory(rulesRepository))
                throw new IllegalStateException("Cannot load rules repository: " + rulesRepository);
        }
        if (labelsRepository == null)
        {
            // TODO loading core labels from 'rules' directory because labels and rules are stored in the same folder
//            labelsRepository = servletContextPath.resolve("WEB-INF").resolve("mta-cli").resolve("labels");
            labelsRepository = servletContextPath.resolve("WEB-INF").resolve("mta-cli").resolve("rules");
            if (!Files.isDirectory(labelsRepository))
                throw new IllegalStateException("Cannot load labels repository: " + labelsRepository);
        }

        if (System.getProperty("windup.home") == null)
            System.setProperty("windup.home", rulesRepository.getParent().toAbsolutePath().toString());
    }

    private Path getServletContextPhysicalPath()
    {
        try
        {
            URL pathUrl = FurnaceExtension.class.getProtectionDomain().getCodeSource().getLocation();
            String pathString;
            if (pathUrl.toString().startsWith("vfs:"))
            {
                VirtualFile virtualFile = VFS.getChild(pathUrl.toURI());
                pathString = virtualFile.getParent().getParent().getParent().getPhysicalFile().getCanonicalPath();
                LOG.info("From VFS - Path String: " + pathString);
                return Paths.get(pathString);
            }

            pathString = pathUrl.getFile();
            LOG.info("Regular Path String: " + pathString);


            // This is here to work around an issue on Windows. Sometimes Windows will give us a path like
            // "/C:/path/to/api.war". The File API will properly see this as "C:/path/to/api.war", but
            // Paths.get() would fail completely.
            File file = new File(pathString);
            Path path = Paths.get(file.getCanonicalPath());
            if (!Files.isRegularFile(path))
                return null;

            // From /path/to/WEB-INF/libs/lib.jar to /path/to/
            path = path.getParent().getParent().getParent();
            if (!Files.isDirectory(path))
                return null;

            return path;
        } catch (Exception e)
        {
            LOG.warning("Failed to get servlet context physical path due to: " + e.getMessage());
            return null;
        }
    }
}
