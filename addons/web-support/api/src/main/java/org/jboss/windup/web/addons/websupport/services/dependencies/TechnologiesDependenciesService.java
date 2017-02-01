package org.jboss.windup.web.addons.websupport.services.dependencies;

import org.jboss.windup.graph.GraphContext;

/**
 * @author <a href="mailto:dklingenberg@gmail.com">David Klingenberg</a>
 */
public interface TechnologiesDependenciesService
{
    void setGraphContext(GraphContext context);

    DependenciesDTO getJMQDependencies();

    DependenciesDTO getDataSourceDependencies();

    DependenciesDTO getWSDependencies();

    DependenciesDTO getDependencies();
}
