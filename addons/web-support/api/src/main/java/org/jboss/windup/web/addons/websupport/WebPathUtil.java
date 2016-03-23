package org.jboss.windup.web.addons.websupport;

import org.apache.commons.lang.StringUtils;

import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.SortedSet;
import java.util.TreeSet;

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


    /**
     * Replaces the variables within the string with their value. Meant primarily for these:
     *
        jboss.server.base.dir     The base directory for server content. 	jboss.home.dir/standalone
        jboss.server.config.dir   The base configuration directory. 	jboss.server.base.dir/configuration
        jboss.server.data.dir     The directory used for persistent data file storage. 	jboss.server.base.dir/data
        jboss.server.log.dir      The directory containing the server.log file. 	jboss.server.base.dir/log
        jboss.server.temp.dir     The directory used for temporary file storage. 	jboss.server.base.dir/tmp
        jboss.server.deploy.dir   The directory used to store deployed content 	jboss.server.data.dir/content

     * @see https://docs.jboss.org/author/display/WFLY8/Command+line+parameters
     */
    public static String expandVariables(String basePath)
    {
        // Longer strings first
        SortedSet<String> namesByLength = new TreeSet<>((String o1, String o2) ->
        {
            int lenDiff = o2.length() - o1.length();
            return lenDiff != 0 ? lenDiff : o2.compareTo(o1);
        });
        namesByLength.addAll(System.getProperties().stringPropertyNames());

        for (String propertyName : namesByLength)
        {
            basePath = basePath.replace("${" + propertyName + "}", System.getProperty(propertyName));
        }

        return basePath;
    }
}
