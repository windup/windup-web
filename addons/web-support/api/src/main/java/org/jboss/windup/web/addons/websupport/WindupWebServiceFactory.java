package org.jboss.windup.web.addons.websupport;

import org.jboss.windup.graph.GraphContext;

/**
 * @author <a href="mailto:jesse.sightler@gmail.com">Jesse Sightler</a>
 */
public interface WindupWebServiceFactory
{
    GraphContext getGlobalGraphContext();

    void destroy();
}
