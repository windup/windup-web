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
        if (migrationProject.getId() != null)
        {
            migrationProject.setId(null); // creating new project, should not have id set
        }

        entityManager.persist(migrationProject);

        this.analysisContextService.createDefaultAnalysisContext(migrationProject);

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
     * Chooses the last execution of this project.
     */
    @Override
    public AnalysisContext getDefaultAnalysisContext(Long projectId)
    {
        try
        {
            String query = "SELECT ctx FROM " + AnalysisContext.class.getSimpleName() + " AS ctx WHERE ctx.migrationProject.id = :projectId ORDER BY ctx.id DESC";
            AnalysisContext ctx = entityManager.createQuery(query, AnalysisContext.class).setParameter("projectId", projectId).setMaxResults(1).getSingleResult();
            return ctx;
        }
        catch (Exception ex)
        {
            LOG.log(Level.SEVERE, ex.getMessage(), ex);
            throw new WindupException("Could not fetch last context used in this project: " + ex.getMessage(), ex);
        }
    }
}
