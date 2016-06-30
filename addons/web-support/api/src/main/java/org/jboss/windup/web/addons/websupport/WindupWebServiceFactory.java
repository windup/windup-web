package org.jboss.windup.web.addons.websupport;

import org.jboss.windup.graph.GraphContext;
import org.jboss.windup.graph.service.GraphService;
import org.jboss.windup.graph.service.Service;
import org.jboss.windup.web.addons.websupport.model.WindupWebSupportVertexFrame;
import org.jboss.windup.web.addons.websupport.service.RegisteredApplicationService;

/**
 * Provides a system for getting services from inside of Furnace and exposing those services to higher levels
 * (for example, to the web application).
 *
 * @author <a href="mailto:jesse.sightler@gmail.com">Jesse Sightler</a>
 */
public interface WindupWebServiceFactory
{
    /**
     * Returns a {@link RegisteredApplicationService} instance.
     */
    RegisteredApplicationService getRegisteredApplicationService();

    /**
     * Gets the global {@link GraphContext} that is used for storing web related data that is not associated with
     * a single application analysis.
     *
     * For example, this will store the list of user projects, applications groups, and registered applications.
     */
    GraphContext getGlobalGraphContext();

    /**
     * Creates a new {@link GraphService} for the given frame type using the global {@link GraphContext}.
     */
    //<T extends WindupWebSupportVertexFrame> Service<T> createGlobalService(Class<T> frameType);

    /**
     * Closes down the {@link GraphContext} cleanly as well as any other resources held by the server.
     */
    void destroy();
}
