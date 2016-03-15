package org.jboss.windup.web.addons.websupport.service;

import org.jboss.windup.web.addons.websupport.model.RegisteredApplicationModel;

/**
 * @author <a href="mailto:jesse.sightler@gmail.com">Jesse Sightler</a>
 */
public interface RegisteredApplicationService
{
    RegisteredApplicationModel getOrCreate(String filepath);
    Iterable<RegisteredApplicationModel> getAllRegisteredApplications();
    RegisteredApplicationModel getByInputPath(String inputPath);
    void deleteAll();
}
