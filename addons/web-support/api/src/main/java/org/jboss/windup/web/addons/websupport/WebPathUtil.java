package org.jboss.windup.web.addons.websupport;

import java.nio.file.Path;

/**
 * Gets global paths (for example a global shared data directory).
 *
 * @author <a href="mailto:jesse.sightler@gmail.com">Jesse Sightler</a>
 */
public interface WebPathUtil
{
    /**
     * Gets a randomly generated path for the results of a Windup analysis run.
     */
    Path createWindupReportOutputPath(String name);

    /**
     * Creates an output path for the given project and group and name.
     */
    Path createWindupReportOutputPath(String projectPath, String name);

    /**
     * Creates an output path for the graph for the given project and group and name.
     */
    Path createWindupGraphOutputPath(Path outputPath);

    /**
     * Creates an output path for the given project path.
     */
    Path createMigrationProjectPath(String projectPath);

    /**
     * Gets the path that should be used for storage of the global graph and other windup artifacts (for example, reports).
     */
    Path getGlobalWindupDataPath();

    /**
     * Gets the path where custom rule providers are stored
     */
    Path getCustomRulesPath();

    /**
     * Gets the path where user uploaded applications are stored
     * @return Path
     */
    Path getAppPath();

    /**
     * Replaces the variables within the string with their value. Meant primarily for these:
     *
        jboss.server.base.dir     The base directory for server content.    jboss.home.dir/standalone
        jboss.server.config.dir   The base configuration directory.     jboss.server.base.dir/configuration
        jboss.server.data.dir     The directory used for persistent data file storage.  jboss.server.base.dir/data
        jboss.server.log.dir      The directory containing the server.log file.     jboss.server.base.dir/log
        jboss.server.temp.dir     The directory used for temporary file storage.    jboss.server.base.dir/tmp
        jboss.server.deploy.dir   The directory used to store deployed content  jboss.server.data.dir/content

     * @see https://docs.jboss.org/author/display/WFLY8/Command+line+parameters
     */
    String expandVariables(String basePath);
}
