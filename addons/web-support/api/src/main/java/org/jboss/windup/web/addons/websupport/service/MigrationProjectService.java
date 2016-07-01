package org.jboss.windup.web.addons.websupport.service;

import org.jboss.windup.web.addons.websupport.model.MigrationProjectModel;

/**
 * @author <a href="http://ondra.zizka.cz/">Ondrej Zizka, zizka@seznam.cz</a>
 */
public interface MigrationProjectService
{
    MigrationProjectModel getById(String id);
    MigrationProjectModel getOrCreate(String id);
    Iterable<MigrationProjectModel> getAllMigrationProjects();
    void delete(MigrationProjectModel migration);
    void deleteAll();
}
