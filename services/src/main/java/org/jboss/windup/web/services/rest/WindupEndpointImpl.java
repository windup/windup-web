package org.jboss.windup.web.services.rest;

import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.Collections;
import java.util.GregorianCalendar;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.logging.Level;
import java.util.logging.Logger;

import javax.annotation.Resource;
import javax.ejb.Stateless;
import javax.enterprise.concurrent.ManagedExecutorService;
import javax.inject.Inject;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Root;

import org.apache.commons.lang.RandomStringUtils;
import org.jboss.forge.furnace.Furnace;
import org.jboss.forge.furnace.services.Imported;
import org.jboss.forge.furnace.util.OperatingSystemUtils;
import org.jboss.windup.exec.WindupProcessor;
import org.jboss.windup.exec.configuration.WindupConfiguration;
import org.jboss.windup.exec.configuration.options.SourceOption;
import org.jboss.windup.exec.configuration.options.TargetOption;
import org.jboss.windup.graph.GraphContext;
import org.jboss.windup.graph.GraphContextFactory;
import org.jboss.windup.web.furnaceserviceprovider.WebProperties;
import org.jboss.windup.web.services.model.AnalysisContext;
import org.jboss.windup.web.services.model.ApplicationGroup;
import org.jboss.windup.web.services.model.MigrationPath;
import org.jboss.windup.web.services.model.RegisteredApplication;
import org.jboss.windup.web.services.model.RegisteredApplication_;
import org.jboss.windup.web.services.WindupWebProgressMonitor;
import org.jboss.windup.web.services.dto.ProgressStatusDto;

@Stateless
public class WindupEndpointImpl implements WindupEndpoint
{
    private static Logger LOG = Logger.getLogger(WindupEndpointImpl.class.getSimpleName());

    private static Map<String, WindupWebProgressMonitor> progressMonitors = new ConcurrentHashMap<>();

    @Inject
    private Furnace furnace;

    @PersistenceContext
    private EntityManager entityManager;

    private WebProperties webProperties = WebProperties.getInstance();

    @Resource
    private ManagedExecutorService managedExecutorService;

    @Override
    public ProgressStatusDto getStatus(RegisteredApplication registeredApplication)
    {
        String statusKey = getStatusKey(registeredApplication);
        WindupWebProgressMonitor progressMonitor = registeredApplication == null ? null : progressMonitors.get(statusKey);
        if (progressMonitor == null)
            return new ProgressStatusDto(0, 0, "Not Started", false, false, false);
        else
        {
            boolean failed = progressMonitor.isFailed();
            boolean done = failed || progressMonitor.isCancelled() || progressMonitor.isDone();
            return new ProgressStatusDto(progressMonitor.getTotalWork(), progressMonitor.getCurrentWork(), progressMonitor.getCurrentTask(), true,
                        done, failed);
        }
    }

    @Override
    public void executeWindup(RegisteredApplication originalRegisteredDto)
    {
        final String inputPath = originalRegisteredDto.getInputPath();

        // make sure we have the latest instance from the graph
        final RegisteredApplication registeredApplication = refreshModel(inputPath);

        Runnable windupProcess = () -> {
            Imported<WindupProcessor> importedProcessor = furnace.getAddonRegistry().getServices(WindupProcessor.class);
            Imported<GraphContextFactory> importedFactory = furnace.getAddonRegistry().getServices(GraphContextFactory.class);
            WindupProcessor processor = importedProcessor.get();
            GraphContextFactory factory = importedFactory.get();

            WindupWebProgressMonitor progressMonitor = new WindupWebProgressMonitor();
            progressMonitors.put(getStatusKey(registeredApplication), progressMonitor);

            try (GraphContext context = factory.create(getDefaultPath()))
            {
                WindupConfiguration configuration = new WindupConfiguration()
                            .setGraphContext(context)
                            .setProgressMonitor(progressMonitor)
                            .addDefaultUserRulesDirectory(webProperties.getRulesRepository())
                            .addInputPath(Paths.get(inputPath))
                            .setOutputDirectory(Paths.get(registeredApplication.getOutputPath()));

                processor.execute(configuration);
            }
            catch (Exception e)
            {
                progressMonitor.setFailed(true);
                LOG.log(Level.WARNING, "Processing of " + inputPath + " failed due to: " + e.getMessage(), e);
                throw new RuntimeException(e);
            }
        };
        managedExecutorService.execute(windupProcess);
    }

    @Override
    public ProgressStatusDto getStatus(Long groupID)
    {
        String statusKey = getStatusKeyGroup(groupID);
        WindupWebProgressMonitor progressMonitor = groupID == null ? null : progressMonitors.get(statusKey);
        if (progressMonitor == null)
            return new ProgressStatusDto(0, 0, "Not Started", false, false, false);
        else
        {
            boolean failed = progressMonitor.isFailed();
            boolean done = failed || progressMonitor.isCancelled() || progressMonitor.isDone();
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
            Imported<WindupProcessor> importedProcessor = furnace.getAddonRegistry().getServices(WindupProcessor.class);
            Imported<GraphContextFactory> importedFactory = furnace.getAddonRegistry().getServices(GraphContextFactory.class);
            WindupProcessor processor = importedProcessor.get();
            GraphContextFactory factory = importedFactory.get();

            WindupWebProgressMonitor progressMonitor = new WindupWebProgressMonitor();
            progressMonitors.put(getStatusKeyGroup(groupID), progressMonitor);

            try (GraphContext context = factory.create(getDefaultPath()))
            {
                WindupConfiguration configuration = new WindupConfiguration()
                        .setGraphContext(context)
                        .setProgressMonitor(progressMonitor)
                        .addDefaultUserRulesDirectory(webProperties.getRulesRepository());

                for (RegisteredApplication application : group.getApplications())
                {
                    Path inputPath = Paths.get(application.getInputPath());
                    configuration.addInputPath(inputPath);
                }
                configuration.setOutputDirectory(Paths.get(group.getOutputPath()));

                if (analysisContext != null)
                {
                    if (analysisContext.getPackages() != null)
                        configuration.setOptionValue("packages", new ArrayList<>(analysisContext.getPackages()));

                    if (analysisContext.getExcludePackages() != null)
                        configuration.setOptionValue("excludePackages", new ArrayList<>(analysisContext.getExcludePackages()));

                    MigrationPath migrationPath = analysisContext.getMigrationPath();
                    if (migrationPath != null)
                    {
                        String source = migrationPath.getSource().toString();
                        String target = migrationPath.getTarget().toString();

                        configuration.setOptionValue(SourceOption.NAME, Collections.singletonList(source));
                        configuration.setOptionValue(TargetOption.NAME, Collections.singletonList(target));
                    }
                }

                processor.execute(configuration);
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

    private RegisteredApplication refreshModel(String inputPath)
    {
        CriteriaBuilder builder = entityManager.getCriteriaBuilder();
        CriteriaQuery<RegisteredApplication> criteriaQuery = builder.createQuery(RegisteredApplication.class);
        Root<RegisteredApplication> root = criteriaQuery.from(RegisteredApplication.class);
        criteriaQuery.where(builder.equal(root.get(RegisteredApplication_.inputPath), inputPath));
        return entityManager.createQuery(criteriaQuery).getSingleResult();
    }

    private String getStatusKey(RegisteredApplication registeredApplication)
    {
        return "RegisteredApp_" + registeredApplication.getId();
    }

    private String getStatusKeyGroup(Long groupID)
    {
        return "Group_" + groupID;
    }

    private java.nio.file.Path getDefaultPath()
    {
        return OperatingSystemUtils.getTempDirectory().toPath().resolve("Windup")
                    .resolve("windupgraph_" + RandomStringUtils.randomAlphanumeric(6));
    }
}
