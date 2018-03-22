package org.jboss.windup.web.services.service;

import javax.ejb.Stateless;
import javax.ejb.TransactionAttribute;
import javax.ejb.TransactionAttributeType;
import javax.inject.Inject;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.TypedQuery;
import javax.transaction.Transactional;
import javax.ws.rs.BadRequestException;
import javax.ws.rs.NotFoundException;

import org.jboss.windup.web.addons.websupport.WebPathUtil;
import org.jboss.windup.web.furnaceserviceprovider.FromFurnace;
import org.jboss.windup.web.services.model.AnalysisContext;
import org.jboss.windup.web.services.model.MigrationProject;

import java.io.File;
import java.io.IOException;
import java.nio.file.FileVisitOption;
import java.nio.file.Files;
import java.util.Calendar;
import java.util.Collection;
import java.util.Collections;
import java.util.Comparator;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.GregorianCalendar;
import java.util.List;
import java.util.logging.Level;
import java.util.logging.Logger;

/**
 * @author <a href="mailto:dklingenberg@gmail.com">David Klingenberg</a>
 * @author <a href="http://ondra.zizka.cz/">Ondrej Zizka, zizka@seznam.cz</a>
 */
@Stateless
public class MigrationProjectService
{
    private static Logger LOG = Logger.getLogger(MigrationProjectService.class.getSimpleName());

    @PersistenceContext
    EntityManager entityManager;

    @Inject
    @FromFurnace
    WebPathUtil webPathUtil;

    @Inject
    AnalysisContextService analysisContextService;

    /**
     * Gets migration project
     */
    public MigrationProject getMigrationProject(Long id)
    {
        MigrationProject result = entityManager.find(MigrationProject.class, id);

        if (result == null)
        {
            throw new NotFoundException("MigrationProject with id: " + id + " not found");
        }

        return result;
    }

    protected Collection<AnalysisContext> getAnalysisContexts(MigrationProject project)
    {
        String query = "SELECT ctxt FROM AnalysisContext ctxt WHERE ctxt.migrationProject = :project";

        return this.entityManager.createQuery(query, AnalysisContext.class)
            .setParameter("project", project)
            .getResultList();
    }

    /**
     * Gets project by title
     */
    public Collection<MigrationProject> getProjectByTitle(String title)
    {
        String query = "SELECT proj FROM MigrationProject proj WHERE proj.title = :title and proj.provisional = FALSE";

        return this.entityManager.createQuery(query, MigrationProject.class)
            .setParameter("title", title)
            .getResultList();
    }

    @Transactional
    public MigrationProject createProject(MigrationProject project)
    {
        if (this.getProjectByTitle(project.getTitle()).size() > 0) {
            throw new BadRequestException("Project with title: '" + project.getTitle() + "' already exists");
        }

        project.setId(null); // creating new project, should not have id set
        this.entityManager.persist(project); // get id for analysis context

        AnalysisContext analysisContext = this.analysisContextService.createDefaultAnalysisContext(project);
        project.setDefaultAnalysisContext(analysisContext);
        this.entityManager.persist(project);

        return project;
    }

    /**
     * Delete old projects created during wizard but not finished.
     *
     * @param olderThanMinutes The limit to consider provisional projects old.
     */
    @Transactional
    public void deleteOldProvisionalProjects(int olderThanMinutes)
    {
        String query = "SELECT pr FROM " + MigrationProject.class.getSimpleName() + " pr WHERE pr.provisional = TRUE ";

        List<MigrationProject> provisional;
        if (olderThanMinutes > 0)
        {
            Calendar newestTime = new GregorianCalendar();
            newestTime.add(Calendar.MINUTE, 0 - olderThanMinutes);
            query += " AND pr.lastModified < :newestDate"; // JPA had issues with a param here.
            provisional = entityManager.createQuery(query, MigrationProject.class)
                    .setParameter("newestDate", newestTime)
                    .getResultList();
        } else
        {
            provisional = entityManager.createQuery(query, MigrationProject.class).getResultList();
        }

        LOG.info("Deleting " + provisional.size() + " provisional projects older than "+olderThanMinutes+" minutes.");
        provisional.forEach(this::deleteProject);
    }

    @TransactionAttribute(TransactionAttributeType.REQUIRES_NEW)
    public void deleteProject(MigrationProject project)
    {
        // Reload to insure we have the latest version
        project = this.entityManager.find(MigrationProject.class, project.getId());

        /* TODO: This is workaround to remove report filters
           For some reason filter didn't get removed even though
           both WindupExecution and ReportFilter have cascade REMOVE set....

           Without this workaround, org.h2.jdbc.JdbcSQLException exception will appear:
            " NULL not allowed for column "WINDUPEXECUTION_WINDUP_EXECUTION_ID"; SQL statement:
              update ReportFilter set isEnabled=?, windupExecution_windup_execution_id=? where report_filter_id=? "
        */
        project.getExecutions().forEach(execution -> {
            entityManager.remove(execution.getReportFilter());
        });

        // removing all packages from packageMetadata due FK

        // First, clear them from the analysis contexts
        this.getAnalysisContexts(project).forEach(context -> {
            context.setApplications(Collections.emptySet());
            context.setIncludePackages(Collections.emptySet());
            context.setExcludePackages(Collections.emptySet());
        });
        project.getApplications().forEach( application -> {
            application.getPackageMetadata().setPackages(Collections.emptySet());
            entityManager.remove(application);
        });

        this.getAnalysisContexts(project).forEach(context -> entityManager.remove(context));
        project.setApplications(Collections.emptySet());

        entityManager.remove(project);

        File projectDir = new File(this.webPathUtil.createMigrationProjectPath(project.getId().toString()).toString());

        if (projectDir.exists()) {
            Path rootPath = Paths.get(projectDir.getAbsolutePath());
            try {
                Files.walk(rootPath, FileVisitOption.FOLLOW_LINKS)
                        .sorted(Comparator.reverseOrder())
                        .map(Path::toFile)
                        .forEach(File::delete);
            } catch (IOException e) {
                LOG.log(Level.WARNING, "Unable to delete directory " + projectDir.getAbsolutePath() + " (" + e.getMessage() + ")");
            }
        }
    }

}
