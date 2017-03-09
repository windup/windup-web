package org.jboss.windup.web.addons.websupport.services;

import org.jboss.windup.exec.WindupProgressMonitor;

import java.nio.file.Path;
import java.util.Collection;
import java.util.List;
import java.util.Map;

/**
 * This exists to provide the Web API with access to Windup services through a simplified API.
 *
 * @author <a href="mailto:jesse.sightler@gmail.com">Jesse Sightler</a>
 */
public interface WindupExecutorService
{
    /**
     * Executes Windup with the given parameters.
     *
     * @param progressMonitor This will receive callbacks to report the current execution progress.
     * @param inputPaths An {@link Iterable} containing paths to the input applications.
     * @param outputPath The path where the reports and graph will be populated.
     * @param packages The packages to include. This should generally be a list of all customer packages containing
     *                 client (not third party) to to be migrated.
     * @param excludePackages The list of any packages to explicitly exclude from analysis for migration.
     * @param source The source technology and version range (for example, "eap:6").
     * @param target The target technology and version range (for example, "eap:7").
     */
    void execute(
            WindupProgressMonitor progressMonitor,
            Collection<Path> rulesPaths,
            List<Path> inputPaths,
            Path outputPath,
            List<String> packages,
            List<String> excludePackages,
            String source,
            String target,
            Map<String, Object> otherOptions,
            boolean generateStaticReports);

    /**
     * Gets the filesystem path to the report for a given application.
     *
     * @param outputDirectory This should be the path to a directory containing the reports from a previous execution of
     *                        Windup.
     * @param applicationPath This is the input application to search for.
     */
    String getReportIndexPath(Path outputDirectory, Path applicationPath);
}
