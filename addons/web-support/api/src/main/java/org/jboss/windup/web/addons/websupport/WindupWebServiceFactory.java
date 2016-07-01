package org.jboss.windup.web.addons.websupport;

import org.jboss.windup.graph.GraphContext;
import org.jboss.windup.web.addons.websupport.service.MigrationProjectService;

/**
 * @author <a href="mailto:jesse.sightler@gmail.com">Jesse Sightler</a>
 */
public interface WindupWebServiceFactory
{
    MigrationProjectService getMigrationProjectService();

    GraphContext getGlobalGraphContext();

    void destroy();
}
