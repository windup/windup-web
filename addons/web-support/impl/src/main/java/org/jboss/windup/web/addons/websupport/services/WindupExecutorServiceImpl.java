package org.jboss.windup.web.addons.websupport.services;

import java.io.IOException;
import java.nio.file.Path;
import java.util.Collection;
import java.util.Collections;
import java.util.List;

import javax.inject.Inject;

import org.jboss.windup.config.KeepWorkDirsOption;
import org.jboss.windup.exec.WindupProcessor;
import org.jboss.windup.exec.WindupProgressMonitor;
import org.jboss.windup.exec.configuration.WindupConfiguration;
import org.jboss.windup.exec.configuration.options.OverwriteOption;
import org.jboss.windup.exec.configuration.options.SourceOption;
import org.jboss.windup.exec.configuration.options.TargetOption;
import org.jboss.windup.graph.GraphContext;
import org.jboss.windup.graph.GraphContextFactory;
import org.jboss.windup.graph.model.resource.FileModel;
import org.jboss.windup.graph.service.FileService;
import org.jboss.windup.reporting.model.ApplicationReportModel;
import org.jboss.windup.reporting.service.ApplicationReportService;
import org.jboss.windup.rules.apps.java.config.ExcludePackagesOption;
import org.jboss.windup.rules.apps.java.config.ScanPackagesOption;

/**
 * @author <a href="mailto:jesse.sightler@gmail.com">Jesse Sightler</a>
 */
public class WindupExecutorServiceImpl implements WindupExecutorService
{
    @Inject
    private WindupProcessor processor;

    @Inject
    private GraphContextFactory factory;

    @Override
    public void execute(WindupProgressMonitor progressMonitor, Collection<Path> rulesPaths, List<Path> inputPaths, Path outputPath, List<String> packages,
                        List<String> excludePackages, String source, String target)
    {
        Path graphPath = outputPath.resolve(GraphContextFactory.DEFAULT_GRAPH_SUBDIRECTORY);
        try (GraphContext context = factory.create(graphPath))
        {
            WindupConfiguration configuration = new WindupConfiguration()
                        .setGraphContext(context)
                        .setProgressMonitor(progressMonitor);

            for (Path rulesPath : rulesPaths)
                configuration.addDefaultUserRulesDirectory(rulesPath);

            inputPaths.forEach(configuration::addInputPath);

            configuration.setOutputDirectory(outputPath);

            if (packages != null)
                configuration.setOptionValue(ScanPackagesOption.NAME, packages);

            if (excludePackages != null)
                configuration.setOptionValue(ExcludePackagesOption.NAME, excludePackages);

            if (source != null)
                configuration.setOptionValue(SourceOption.NAME, Collections.singletonList(source));

            if (target != null)
                configuration.setOptionValue(TargetOption.NAME, Collections.singletonList(target));

            configuration.setOptionValue(OverwriteOption.NAME, true);

            configuration.setOptionValue(KeepWorkDirsOption.NAME, true);

            processor.execute(configuration);
        }
        catch (IOException e)
        {
            throw new RuntimeException("Failed to create graph due to: " + e.getMessage(), e);
        }
    }

    @Override
    public String getReportIndexPath(Path outputPath, Path applicationPath)
    {
        Path graphPath = outputPath.resolve(GraphContextFactory.DEFAULT_GRAPH_SUBDIRECTORY);
        try (GraphContext context = factory.load(graphPath))
        {
            FileModel applicationFileModel = new FileService(context).findByPath(applicationPath.toString());

            ApplicationReportService service = new ApplicationReportService(context);
            ApplicationReportModel reportModel = service.getMainApplicationReportForFile(applicationFileModel);

            if (reportModel == null)
                return null;

            return reportModel.getReportFilename();
        }
        catch (IOException e)
        {
            throw new RuntimeException("Failed to load graph due to: " + e.getMessage(), e);
        }
    }
}
