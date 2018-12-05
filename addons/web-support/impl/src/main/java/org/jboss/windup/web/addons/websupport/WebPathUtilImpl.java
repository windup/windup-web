package org.jboss.windup.web.addons.websupport;

import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.SortedSet;
import java.util.TreeSet;

import org.apache.commons.lang.RandomStringUtils;
import org.apache.commons.lang.StringUtils;
import org.jboss.windup.graph.GraphContextFactory;

/**
 * @author <a href="mailto:jesse.sightler@gmail.com">Jesse Sightler</a>
 */
public class WebPathUtilImpl implements WebPathUtil
{
    private static final String DEFAULT_DATA_DIR = "jboss.server.data.dir";
    private static final String PROPERTY_DATA_DIR = "windup.data.dir";
    private static final String DIR_NAME = "windup";
    private static final String REPORT_DIR = "reports";
    private static final String APPS_DIR = "apps";
    private static final String RULES_DIR = "rules";
    private static final String GRAPH_BASE_OUTPUT_PATH = "GRAPH_BASE_OUTPUT_PATH";

    @Override
    public Path createWindupReportOutputPath(String name)
    {
        Path reportBasePath = getGlobalWindupDataPath().resolve(REPORT_DIR);
        String dirName = name + "." + RandomStringUtils.randomAlphabetic(12) + ".report";
        return reportBasePath.resolve(dirName);
    }

    @Override
    public Path createWindupReportOutputPath(String projectPath, String reportPath)
    {
        return this.createMigrationProjectPath(projectPath)
                .resolve("reports")
                .resolve(reportPath);
    }

    @Override
    public Path createWindupGraphOutputPath(Path outputPath)
    {
        String graphBaseOutputPath = System.getenv(GRAPH_BASE_OUTPUT_PATH);
        Path graphPath;
        if (graphBaseOutputPath != null)
        {
            graphPath = Paths.get(outputPath.toString().replace(getGlobalWindupDataPath().toString(), graphBaseOutputPath), GraphContextFactory.DEFAULT_GRAPH_SUBDIRECTORY);
        }
        else
        {
            graphPath = outputPath.resolve(GraphContextFactory.DEFAULT_GRAPH_SUBDIRECTORY);
        }
        return graphPath;
    }

    @Override
    public Path getGlobalWindupDataPath()
    {
        String windupDataDir = System.getProperty(PROPERTY_DATA_DIR);
        String dataDir = (windupDataDir != null) ? windupDataDir : System.getProperty(DEFAULT_DATA_DIR);
        if (StringUtils.isBlank(dataDir))
            throw new RuntimeException("Data directory not found via system property: " + PROPERTY_DATA_DIR);

        return Paths.get(dataDir).resolve(DIR_NAME);
    }

    @Override
    public Path getAppPath()
    {
        return this.getGlobalWindupDataPath().resolve(APPS_DIR);
    }

    @Override
    public String expandVariables(String basePath)
    {
        // Longer strings first
        SortedSet<String> namesByLength = new TreeSet<>((String o1, String o2) -> {
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

    @Override
    public Path createMigrationProjectPath(String projectPath)
    {
        return Paths.get(this.getGlobalWindupDataPath().toString(), projectPath);
    }

    @Override
    public Path getCustomRulesPath()
    {
        return this.getGlobalWindupDataPath().resolve(RULES_DIR);
    }
}
