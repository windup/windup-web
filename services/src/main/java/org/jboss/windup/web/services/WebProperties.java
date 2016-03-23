package org.jboss.windup.web.services;

import javax.annotation.PostConstruct;
import javax.annotation.Resource;
import javax.ejb.Singleton;
import javax.ejb.Startup;
import javax.inject.Inject;
import javax.servlet.ServletContext;
import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Properties;

/**
 * @author <a href="mailto:jesse.sightler@gmail.com">Jesse Sightler</a>
 */
@Singleton
@Startup
public class WebProperties
{
    public static final String FURNACE_PROPERTIES = "/windupweb.properties";
    public static final String ADDON_REPOSITORY = "addon.repository";
    public static final String RULES_REPOSITORY = "rules.repository";

    private Properties properties = new Properties();
    private Path addonRepository;
    private Path rulesRepository;

    @Inject
    private ServletContext servletContext;

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

    public void init () {
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

        if (addonRepository == null)
        {
            addonRepository = Paths.get(servletContext.getRealPath("/WEB-INF/addon-repository"));
            if (!Files.isDirectory(addonRepository))
                throw new IllegalStateException("Cannot load addon repository: " + addonRepository);
        }

        if (rulesRepository == null)
        {
            rulesRepository = Paths.get(servletContext.getRealPath("/WEB-INF/rules"));
            if (!Files.isDirectory(rulesRepository))
                throw new IllegalStateException("Cannot load rules repository: " + rulesRepository);
        }
    }
}
