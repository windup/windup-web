package org.jboss.windup.web.services.rest;

import java.util.Collection;
import org.jboss.windup.web.services.dto.MigrationProjectDto;


/**
 *
 *  @author <a href="http://ondra.zizka.cz/">Ondrej Zizka, zizka@seznam.cz</a>
 */
public interface MigrationProjectEndpoint
{
    MigrationProjectDto createMigrationProject(MigrationProjectDto migrationProject);

    void deleteProject(MigrationProjectDto migration);

    Collection<MigrationProjectDto> getMigrationProjects();
}
