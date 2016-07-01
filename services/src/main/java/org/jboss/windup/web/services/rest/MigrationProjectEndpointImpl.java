package org.jboss.windup.web.services.rest;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.logging.Logger;

import javax.ejb.Stateless;
import javax.inject.Inject;
import org.jboss.windup.web.addons.websupport.model.MigrationProjectModel;

import org.jboss.windup.web.addons.websupport.service.MigrationProjectService;
import org.jboss.windup.web.services.dto.MigrationProjectDto;

/**
 * @author <a href="http://ondra.zizka.cz/">Ondrej Zizka, zizka@seznam.cz</a>
 */
@Stateless
public class MigrationProjectEndpointImpl implements MigrationProjectEndpoint
{
    private static Logger LOG = Logger.getLogger(MigrationProjectEndpointImpl.class.getSimpleName());

    @Inject
    private MigrationProjectService migrationProjectService;

    @Override
    public Collection<MigrationProjectDto> getMigrationProjects()
    {
        List<MigrationProjectDto> results = new ArrayList<>();
        for (MigrationProjectModel model : migrationProjectService.getAllMigrationProjects()) {
            results.add(new MigrationProjectDto(model));
        }
        return results;
    }

    @Override
    public MigrationProjectDto createMigrationProject(MigrationProjectDto migrationProject)
    {
        LOG.info("Creating a migration project: " + migrationProject.getId());
        return new MigrationProjectDto(migrationProjectService.getOrCreate(migrationProject.getId()));
    }

    @Override
    public void deleteProject(MigrationProjectDto migration)
    {
        MigrationProjectModel migrationProject = migrationProjectService.getById(migration.getId());
        migrationProjectService.delete(migrationProject);
    }
}
