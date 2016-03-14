package org.jboss.windup.web.addons.websupport;

import org.apache.commons.lang.StringUtils;

import java.nio.file.Path;
import java.nio.file.Paths;

/**
 * Gets global paths (for example a global shared data directory).
 *
 * @author <a href="mailto:jesse.sightler@gmail.com">Jesse Sightler</a>
 */
public class WebPathUtil
{
    private static final String PROPERTY_DATA_DIR = "jboss.server.data.dir";
    private static final String DIR_NAME = "windup";

    /**
     * Gets the path that should be used for storage of the global graph and other windup artifacts (for example, reports).
     */
    public static Path getGlobalWindupDataPath()
    {
        String dataDir = System.getProperty(PROPERTY_DATA_DIR);
        if (StringUtils.isBlank(dataDir))
            throw new RuntimeException("Data directory not found via system property: " + PROPERTY_DATA_DIR);

        return Paths.get(dataDir).resolve(DIR_NAME);
    }
}
