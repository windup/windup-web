package org.jboss.windup.web.services.rest;

import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.Collections;
import java.util.GregorianCalendar;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.logging.Level;
import java.util.logging.Logger;
import java.util.stream.Collectors;

import javax.annotation.Resource;
import javax.ejb.Stateless;
import javax.enterprise.concurrent.ManagedExecutorService;
import javax.inject.Inject;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;

import org.jboss.forge.furnace.Furnace;
import org.jboss.windup.web.addons.websupport.services.WindupExecutorService;
import org.jboss.windup.web.furnaceserviceprovider.FromFurnace;
import org.jboss.windup.web.furnaceserviceprovider.WebProperties;
import org.jboss.windup.web.services.WindupWebProgressMonitor;
import org.jboss.windup.web.services.dto.ProgressStatusDto;
import org.jboss.windup.web.services.model.AnalysisContext;
import org.jboss.windup.web.services.model.ApplicationGroup;
import org.jboss.windup.web.services.model.MigrationPath;
import org.jboss.windup.web.services.model.RegisteredApplication;

@Stateless
public class WindupEndpointImpl implements WindupEndpoint
{
    private static Logger LOG = Logger.getLogger(WindupEndpointImpl.class.getSimpleName());

    private static Map<Long, WindupWebProgressMonitor> progressMonitors = new ConcurrentHashMap<>();

    @Inject
    private Furnace furnace;

    @PersistenceContext
    private EntityManager entityManager;

    private WebProperties webProperties = WebProperties.getInstance();

    @Resource
    private ManagedExecutorService managedExecutorService;

    @Inject
    @FromFurnace
    private WindupExecutorService windupExecutorService;

    @Override
    public ProgressStatusDto getStatus(Long groupID)
    {
        WindupWebProgressMonitor progressMonitor = groupID == null ? null : progressMonitors.get(groupID);
        if (progressMonitor == null)
            return new ProgressStatusDto(0, 0, "Not Started", false, false, false);
        else
        {
            boolean failed = progressMonitor.isFailed();
            boolean done = failed || progressMonitor.isCancelled() || progressMonitor.isDone();

            if (done)
            {
                ApplicationGroup group = entityManager.find(ApplicationGroup.class, groupID);
                Path reportDirectory = Paths.get(group.getOutputPath());
                for (RegisteredApplication application : group.getApplications()) {
                    Path applicationPath = Paths.get(application.getInputPath());

                    /*
                     * FIXME - This is a little bit of a hack to just get the relative path for the web client.
                     *
                     *          Could potentially be moved into a service inside of the Windup Furnace API?
                     */
                    String reportDirectoryName = reportDirectory.getFileName().toString();
                    String reportIndexFilename = windupExecutorService.getReportIndexPath(reportDirectory, applicationPath);

                    application.setReportIndexPath(reportDirectoryName + "/reports/" + reportIndexFilename);
                    // END FIXME
                }
            }

            return new ProgressStatusDto(progressMonitor.getTotalWork(), progressMonitor.getCurrentWork(), progressMonitor.getCurrentTask(), true,
                        done, failed);
        }
    }

    @Override
    public void executeGroup(Long groupID)
    {
        ApplicationGroup group = entityManager.find(ApplicationGroup.class, groupID);
        group.setExecutionTime(new GregorianCalendar());

        AnalysisContext analysisContext = group.getAnalysisContext();

        Runnable windupProcess = () -> {
            WindupWebProgressMonitor progressMonitor = new WindupWebProgressMonitor();
            progressMonitors.put(groupID, progressMonitor);

            try
            {
                Path rulesDirectory = webProperties.getRulesRepository();

                List<Path> inputPaths = group
                            .getApplications()
                            .stream()
                            .map(application -> Paths.get(application.getInputPath()))
                            .collect(Collectors.toList());

                List<String> packages = Collections.emptyList();
                List<String> excludePackages = Collections.emptyList();
                String source = null;
                String target = null;

                if (analysisContext != null)
                {
                    if (analysisContext.getPackages() != null)
                        packages = new ArrayList<>(analysisContext.getPackages());

                    if (analysisContext.getExcludePackages() != null)
                        excludePackages = new ArrayList<>(analysisContext.getExcludePackages());

                    MigrationPath migrationPath = analysisContext.getMigrationPath();
                    if (migrationPath != null)
                    {
                        if (migrationPath.getSource() != null)
                            source = migrationPath.getSource().toString();

                        if (migrationPath.getTarget() != null)
                            target = migrationPath.getTarget().toString();
                    }
                }

                windupExecutorService.execute(
                            progressMonitor,
                            rulesDirectory,
                            inputPaths,
                            Paths.get(group.getOutputPath()),
                            packages,
                            excludePackages,
                            source,
                            target);
            }
            catch (Exception e)
            {
                progressMonitor.setFailed(true);
                LOG.log(Level.WARNING, "Processing of " + group + " failed due to: " + e.getMessage(), e);
                throw new RuntimeException(e);
            }
        };
        managedExecutorService.execute(windupProcess);
    }

}
