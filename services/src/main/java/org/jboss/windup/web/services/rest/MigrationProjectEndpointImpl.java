
package org.jboss.windup.web.services.rest;

import java.util.ArrayList;
import java.util.List;
import java.util.logging.Level;
import java.util.logging.Logger;
import java.util.stream.Collectors;

import javax.ejb.Stateful;
import javax.inject.Inject;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.PersistenceContextType;
import javax.ws.rs.NotFoundException;

import org.jboss.windup.util.exception.WindupException;

import org.jboss.windup.web.addons.websupport.WebPathUtil;
import org.jboss.windup.web.furnaceserviceprovider.FromFurnace;
import org.jboss.windup.web.services.model.AnalysisContext;
import org.jboss.windup.web.services.model.MigrationProject;
import org.jboss.windup.web.services.service.AnalysisContextService;
import org.jboss.windup.web.services.service.MigrationProjectService;

/**
 * @author <a href="http://ondra.zizka.cz/">Ondrej Zizka, zizka@seznam.cz</a>
 */
@Stateful
public class MigrationProjectEndpointImpl implements MigrationProjectEndpoint
{
    private static Logger LOG = Logger.getLogger(MigrationProjectEndpointImpl.class.getSimpleName());

    @PersistenceContext(type = PersistenceContextType.EXTENDED)
    private EntityManager entityManager;

    @Inject
    private MigrationProjectService migrationProjectService;

    @Inject
    private AnalysisContextService analysisContextService;

    @Inject
    @FromFurnace
    private WebPathUtil webPathUtil;

    @Override
    public List<MigrationProjectAndAppCount> getMigrationProjects()
    {
        try
        {
            final String query =
                    "SELECT project, COUNT(DISTINCT app) AS appCount "
                    + "FROM " + MigrationProject.class.getSimpleName() + " project "
                    + "LEFT JOIN project.applications AS app "
                    + "GROUP BY project.id";

            List<Object[]> entries = entityManager.createQuery(query, Object[].class).getResultList();
            return new ArrayList<>(entries.stream().map(e -> new MigrationProjectAndAppCount((MigrationProject)e[0], (long) e[1])).collect(Collectors.toList()));
        }
        catch (Exception ex)
        {
            LOG.log(Level.SEVERE, ex.getMessage(), ex);
            throw new WindupException(ex.getMessage(), ex);
        }
    }

    @Override
    public MigrationProject getMigrationProject(Long id)
    {
        MigrationProject result = entityManager.find(MigrationProject.class, id);
        if (result == null)
            throw new NotFoundException("MigrationProject with id: " + id + " not found!");
        return result;
    }

    @Override
    public MigrationProject createMigrationProject(MigrationProject migrationProject)
    {
        migrationProject = this.migrationProjectService.createProject(migrationProject);
        LOG.info("Creating a migration project: " + migrationProject.getId());

        return migrationProject;
    }

    @Override
    public MigrationProject updateMigrationProject(MigrationProject migrationProject)
    {
        return entityManager.merge(migrationProject);
    }

    @Override
    public void deleteProject(MigrationProject migrationProject)
    {
        MigrationProject project = this.getMigrationProject(migrationProject.getId());
        this.migrationProjectService.deleteProject(project);
    }


    /**
     * Impl notes:
     * Chooses the last AnalysisContext which has no execution attached, or, if there's no such, the AnalysisContext of the last execution.
     */
    @Override
    public AnalysisContext getDefaultAnalysisContext(Long projectId)
    {
        try
        {
            // The last AnalysisContext which has no execution attached
            String jql = "SELECT ctx FROM " + AnalysisContext.class.getSimpleName() + " AS ctx "
                    + " WHERE ctx.migrationProject.id = :projectId AND NOT EXISTS (FROM WindupExecution exec WHERE exec.analysisContext = ctx) "
                    + " ORDER BY ctx.id DESC";
            List<AnalysisContext> contexts = entityManager.createQuery(jql, AnalysisContext.class).setParameter("projectId", projectId).setMaxResults(1).getResultList();

            if (contexts.size() > 0)
                return contexts.get(0);

            // The AnalysisContext of the last execution.
            jql = "SELECT ctx FROM WindupExecution AS exec LEFT JOIN exec.analysisContext AS ctx "
                    + " WHERE exec.project.id = :projectId"
                    + " ORDER BY exec.id DESC";
            contexts = entityManager.createQuery(jql, AnalysisContext.class).setParameter("projectId", projectId).setMaxResults(1).getResultList();

            if (contexts.size() > 0)
                return contexts.get(0);

            return null;
        }
        catch (Exception ex)
        {
            LOG.log(Level.SEVERE, ex.getMessage(), ex);
            throw new WindupException("Error fetching last context used in this project: " + ex.getMessage(), ex);
        }
    }
}
