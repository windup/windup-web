package org.jboss.windup.web.services.rest;

import java.io.IOException;
import java.net.URL;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Collection;
import java.util.Enumeration;
import java.util.List;
import java.util.Properties;
import java.util.jar.Manifest;
import java.util.logging.Logger;

import javax.ejb.Stateless;
import javax.inject.Inject;
import javax.persistence.EntityManager;
import javax.persistence.OptimisticLockException;
import javax.persistence.PersistenceContext;
import javax.ws.rs.BadRequestException;
import javax.ws.rs.NotFoundException;

import org.apache.commons.lang3.StringUtils;
import org.jboss.windup.config.GraphRewrite;
import org.jboss.windup.web.addons.websupport.services.LogService;
import org.jboss.windup.web.furnaceserviceprovider.FromFurnace;
import org.jboss.windup.web.services.model.AnalysisContext;
import org.jboss.windup.web.services.model.MigrationProject;
import org.jboss.windup.web.services.model.WindupExecution;
import org.jboss.windup.web.services.service.WindupExecutionService;

@Stateless
public class WindupEndpointImpl implements WindupEndpoint
{
    private static Logger LOG = Logger.getLogger(WindupEndpointImpl.class.getSimpleName());

    private static int MAX_LOG_SIZE = 1024 * 1024 * 3; // 3 Megabytes
    private static String cachedCoreVersion = null;
    private static String cachedCoreScmRevision = null;

    @PersistenceContext
    private EntityManager entityManager;
    @Inject
    private WindupExecutionService windupExecutionService;
    @Inject
    @FromFurnace
    private LogService logService;

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

        return this.windupExecutionService.executeProjectWithContext(originalContext, projectId);
    }

    @Override
    public Collection<WindupExecution> getAllExecutions()
    {
        return this.entityManager.createQuery("SELECT ex from " + WindupExecution.class.getSimpleName() + " ex").getResultList();
    }

    @Override
    public WindupExecution getExecution(Long executionId)
    {
        return this.windupExecutionService.get(executionId);
    }

    @Override
    public void cancelExecution(Long executionID)
    {
        for (int i = 0; i < 10; i++)
        {
            try
            {
                this.windupExecutionService.cancelExecution(executionID);
                return;
            }
            catch (Exception e)
            {
                if (!isOptimisticLockException(e))
                    return;

                LOG.info("Optimistic lock on first cancellation attempt for execution: " + executionID + "... trying again.");
                try
                {
                    Thread.sleep(5000L);
                }
                catch (Exception ignored)
                {
                }
            }
        }
    }

    private boolean isOptimisticLockException(Throwable e)
    {
        if (e instanceof OptimisticLockException)
            return true;
        else
            return isOptimisticLockException(e.getCause());
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
        this.windupExecutionService.deleteExecution(executionID);
    }

    @Override
    public List<String> getExecutionLogs(Long executionID)
    {
        WindupExecution execution = this.getExecution(executionID);

        Path reportPath = Paths.get(execution.getOutputPath());
        return this.logService.getLogData(reportPath, MAX_LOG_SIZE);
    }

    @Override
    public VersionAndRevision getCoreVersion()
    {
        if (cachedCoreVersion == null)
        {
            try
            {
                Properties props = new Properties();
                props.load(WindupEndpointImpl.class.getClassLoader().getResourceAsStream("/META-INF/windup-web-services.build.properties"));
                cachedCoreVersion = props.getProperty("version.windup.core");

                /*
                 * Get GraphRewrite (a class in windup config api) and use it to get the windup core manifest.
                 *
                 * Then use that to get the scmversion.
                 */
                Enumeration<URL> resources = GraphRewrite.class.getClassLoader().getResources("META-INF/MANIFEST.MF");
                while (resources.hasMoreElements())
                {
                    try
                    {
                        Manifest manifest = new Manifest(resources.nextElement().openStream());
                        // check that this is your manifest and do what you need or get the next one
                        String vendorID = manifest.getMainAttributes().getValue("Implementation-Vendor-Id");
                        if (!StringUtils.equals(vendorID, "org.jboss.windup.config"))
                            continue;

                        cachedCoreScmRevision = manifest.getMainAttributes().getValue("Scm-Revision");
                    }
                    catch (IOException E)
                    {
                        // handle
                    }
                }
            }
            catch (IOException ex)
            {
                LOG.severe("Couldn't read build.properties.");
                cachedCoreVersion = "(failed to read)";
            }
        }
        return new VersionAndRevision(cachedCoreVersion, cachedCoreScmRevision);
    }
}
