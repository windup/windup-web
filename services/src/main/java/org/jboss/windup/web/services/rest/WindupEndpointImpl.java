package org.jboss.windup.web.services.rest;

import java.io.File;
import java.io.IOException;
import java.nio.file.FileVisitOption;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Collection;
import java.util.Comparator;
import java.util.GregorianCalendar;
import java.util.logging.Level;
import java.util.logging.Logger;

import javax.annotation.Resource;
import javax.ejb.Stateless;
import javax.inject.Inject;
import javax.jms.JMSContext;
import javax.jms.Queue;
import javax.jms.Topic;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.ws.rs.BadRequestException;
import javax.ws.rs.NotFoundException;

import org.apache.commons.lang3.StringUtils;
import org.jboss.forge.furnace.Furnace;
import org.jboss.windup.web.addons.websupport.WebPathUtil;
import org.jboss.windup.web.addons.websupport.services.LogService;
import org.jboss.windup.web.furnaceserviceprovider.FromFurnace;
import org.jboss.windup.web.services.messaging.MessagingConstants;
import org.jboss.windup.web.services.model.AnalysisContext;
import org.jboss.windup.web.services.model.ExecutionState;
import org.jboss.windup.web.services.model.MigrationProject;
import org.jboss.windup.web.services.model.RegisteredApplication;
import org.jboss.windup.web.services.model.WindupExecution;
import org.jboss.windup.web.services.service.AnalysisContextService;
import org.jboss.windup.web.services.service.ConfigurationService;
import org.jboss.windup.web.services.service.MigrationProjectService;

@Stateless
public class WindupEndpointImpl implements WindupEndpoint
{
    private static Logger LOG = Logger.getLogger(WindupEndpointImpl.class.getSimpleName());

    private static int MAX_LOG_SIZE = 1024 * 1024 * 3; // 3 Megabytes

    @Inject
    private Furnace furnace;

    @PersistenceContext
    private EntityManager entityManager;

    @Inject
    private ConfigurationService configurationService;

    @Inject
    private AnalysisContextService analysisContextService;

    @Inject
    private MigrationProjectService migrationProjectService;

    @Inject
    private JMSContext messaging;

    @Inject
    @FromFurnace
    private WebPathUtil webPathUtil;

    @Inject
    @FromFurnace
    private LogService logService;

    @Resource(lookup = "java:/queues/" + MessagingConstants.EXECUTOR_QUEUE)
    private Queue executorQueue;

    @Resource(lookup = "java:/topics/" + MessagingConstants.CANCELLATION_TOPIC)
    private Topic cancellationTopic;

    /**
     * @see org.jboss.windup.web.services.messaging.ExecutorMDB
     */
    @Override
    public WindupExecution executeProjectWithContext(AnalysisContext originalContext, Long projectId)
    {
        if (originalContext == null)
        {
            throw new BadRequestException("AnalysisContext must be provided");
        }


        if (originalContext.getApplications().size() == 0)
        {
            throw new BadRequestException("Cannot execute windup without selected applications");
        }

        // make clone of analysis context and use it for execution
        AnalysisContext analysisContext = originalContext.clone();

        MigrationProject project = this.migrationProjectService.getMigrationProject(projectId);
        project.setLastModified(new GregorianCalendar());
        analysisContext.setMigrationProject(project); // ensure project is correctly set

        analysisContext = this.analysisContextService.create(analysisContext);

        for (RegisteredApplication application : analysisContext.getApplications())
        {
            application.setReportIndexPath(null);
        }

        WindupExecution execution = new WindupExecution(analysisContext);
        execution.setTimeStarted(new GregorianCalendar());
        execution.setState(ExecutionState.QUEUED);

        entityManager.persist(execution);

        Path reportOutputPath = this.webPathUtil.createWindupReportOutputPath(
                    execution.getProject().getId().toString(),
                    execution.getId().toString());

        execution.setOutputPath(reportOutputPath.toString());
        entityManager.merge(execution);

        messaging.createProducer().send(executorQueue, execution);

        return execution;
    }

    @Override
    public Collection<WindupExecution> getAllExecutions()
    {
        return this.entityManager.createQuery("SELECT ex from " + WindupExecution.class.getSimpleName() + " ex").getResultList();
    }

    @Override
    public WindupExecution getExecution(Long executionId)
    {
        WindupExecution execution = this.entityManager.find(WindupExecution.class, executionId);

        if (execution == null)
        {
            throw new NotFoundException("WindupExecution with id: " + executionId + " not found");
        }

        return execution;
    }

    @Override
    public void cancelExecution(Long executionID)
    {
        WindupExecution execution = this.getExecution(executionID);


        execution.setState(ExecutionState.CANCELLED);
        this.entityManager.merge(execution);

        messaging.createProducer().send(cancellationTopic, execution);
    }

    @Override
    public Collection<WindupExecution> getProjectExecutions(Long projectId)
    {
        if (projectId == null)
        {
            throw new BadRequestException("Invalid projectId");
        }

        MigrationProject project = this.entityManager.find(MigrationProject.class, projectId);

        if (project == null)
        {
            throw new NotFoundException("Migration project with id: " + projectId + " not found");
        }

        return this.entityManager.createQuery("SELECT ex FROM WindupExecution ex WHERE ex.project = :project", WindupExecution.class)
                    .setParameter("project", project)
                    .getResultList();
    }

    @Override
    public void deleteExecution(Long executionID)
    {
        WindupExecution execution = this.getExecution(executionID);
        if (StringUtils.isBlank(execution.getOutputPath()))
            return;

        File executionDir = new File(execution.getOutputPath());
        if (executionDir.exists())
        {
            Path rootPath = Paths.get(executionDir.getAbsolutePath());
            LOG.info("Removing report from: " + rootPath);
            try
            {
                Files.walk(rootPath, FileVisitOption.FOLLOW_LINKS)
                            .sorted(Comparator.reverseOrder())
                            .map(Path::toFile)
                            .forEach(File::delete);
            }
            catch (IOException e)
            {
                LOG.log(Level.WARNING, "Unable to execution contents at " + executionDir.getAbsolutePath() + " (cause: " + e.getMessage() + ")", e);
            }
        }
        this.entityManager.remove(execution);
    }

    @Override
    public List<String> getExecutionLogs(Long executionID)
    {
        WindupExecution execution = this.getExecution(executionID);
        if (StringUtils.isBlank(execution.getOutputPath()))
            return;

        Path reportPath = Paths.get(execution.getOutputPath());
        return this.logService.getLogData(reportPath, MAX_LOG_SIZE);
    }
}
