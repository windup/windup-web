package org.jboss.windup.web.addons.websupport.service;

import org.jboss.windup.web.addons.websupport.model.RegisteredApplicationModel;

/**
 * Contains methods for managing {@link RegisteredApplicationModel}s.
 *
 * @author <a href="mailto:jesse.sightler@gmail.com">Jesse Sightler</a>
 */
public interface RegisteredApplicationService
{
    /**
     * Gets a {@link RegisteredApplicationModel} for the given path. If one does not already exist, this
     * will create it.
     */
    RegisteredApplicationModel getOrCreate(String filepath);

    /**
     * Delete the specified application from the graph.
     */
    void delete(RegisteredApplicationModel application);

    /**
     * Gets all registered applications.
     */
    Iterable<RegisteredApplicationModel> getAllRegisteredApplications();

    /**
     * Gets the application model by path. If none exists, this will return null.
     */
    RegisteredApplicationModel getByInputPath(String inputPath);

    /**
     * Removes all registered applications from the graph.
     */
    void deleteAll();
}
