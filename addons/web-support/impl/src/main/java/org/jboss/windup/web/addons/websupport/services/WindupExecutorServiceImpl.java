package org.jboss.windup.web.addons.websupport.services;

import java.io.IOException;
import java.nio.file.Path;
import java.util.Collection;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.logging.Handler;
import java.util.logging.Logger;

import javax.inject.Inject;

import org.jboss.windup.config.KeepWorkDirsOption;
import org.jboss.windup.config.phase.ReportRenderingPhase;
import org.jboss.windup.exec.WindupProcessor;
import org.jboss.windup.exec.WindupProgressMonitor;
import org.jboss.windup.exec.configuration.WindupConfiguration;
import org.jboss.windup.exec.configuration.options.OverwriteOption;
import org.jboss.windup.exec.configuration.options.SourceOption;
import org.jboss.windup.exec.configuration.options.TargetOption;
import org.jboss.windup.exec.rulefilters.NotPredicate;
import org.jboss.windup.exec.rulefilters.RuleProviderPhasePredicate;
import org.jboss.windup.graph.GraphContext;
import org.jboss.windup.graph.GraphContextFactory;
import org.jboss.windup.rules.apps.java.config.ExcludePackagesOption;
import org.jboss.windup.rules.apps.java.config.ScanPackagesOption;
import org.jboss.windup.util.exception.WindupException;
import org.jboss.windup.web.addons.websupport.rest.graph.GraphCache;

/**
 * @author <a href="mailto:jesse.sightler@gmail.com">Jesse Sightler</a>
 */
public class WindupExecutorServiceImpl implements WindupExecutorService
{
    @Inject
    private WindupProcessor processor;

    @Inject
    private LogService logService;

    @Inject
    private GraphCache graphCache;

    @Override
    public void execute(WindupProgressMonitor progressMonitor, Collection<Path> rulesPaths, List<Path> inputPaths, Path outputPath,
                List<String> packages,
                List<String> excludePackages, String source, List<String> targets, Map<String, Object> otherOptions, boolean generateStaticReports)
    {
        Path graphPath = outputPath.resolve(GraphContextFactory.DEFAULT_GRAPH_SUBDIRECTORY);
        // Close it here, since we will be deleting the old one and rewriting
        graphCache.closeGraph(graphPath);

        // As this is from the cache, we don't have to manually close it
        GraphContext context = graphCache.getGraph(graphPath, true);

        WindupConfiguration configuration = new WindupConfiguration()
                    .setGraphContext(context)
                    .setProgressMonitor(progressMonitor);

        if (!generateStaticReports)
        {
            configuration.setRuleProviderFilter(new NotPredicate(new RuleProviderPhasePredicate(ReportRenderingPhase.class)));
        }

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

        if (targets != null && targets.size() > 0) {
            configuration.setOptionValue(TargetOption.NAME, targets);
        }

        configuration.setOptionValue(OverwriteOption.NAME, true);
        configuration.setOptionValue(KeepWorkDirsOption.NAME, true);

        for (Map.Entry<String, Object> optionEntry : otherOptions.entrySet())
        {
            configuration.setOptionValue(optionEntry.getKey(), optionEntry.getValue());
        }
        
        Logger globalLogger = Logger.getLogger("org.jboss.windup");
        Handler logHandler = null;
        try
        {
            logHandler = this.logService.createLogHandler(configuration);
        }
        catch (IOException e)
        {
            throw new WindupException("Failed to create log handler due to: " + e.getMessage(), e);
        }
        try
        {
            globalLogger.addHandler(logHandler);

            processor.execute(configuration);
        }
        finally
        {
            graphCache.closeGraph(graphPath);
            logHandler.flush();
            globalLogger.removeHandler(logHandler);
        }
    }

}
