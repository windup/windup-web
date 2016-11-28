package org.jboss.windup.web.services.service;

import org.jboss.windup.graph.GraphContextFactory;
import org.jboss.windup.web.addons.websupport.rest.GraphPathLookup;
import org.jboss.windup.web.services.model.WindupExecution;

import javax.persistence.EntityManager;
import java.nio.file.Path;
import java.nio.file.Paths;

/**
 * Provides an implementation of the {@link GraphPathLookup} API that is able to lookup the path for a graph based upon
 * the execution id.
 *
 * @author <a href="mailto:jesse.sightler@gmail.com">Jesse Sightler</a>
 */
public class DefaultGraphPathLookup implements GraphPathLookup
{

    private EntityManager entityManager;

    public DefaultGraphPathLookup(EntityManager entityManager)
    {
        this.entityManager = entityManager;
    }

    @Override
    public Path getByExecutionID(long executionID)
    {
        WindupExecution execution = entityManager.find(WindupExecution.class, executionID);
        if (execution == null)
            return null;
        else if (execution.getOutputPath() == null)
            return null;
        return Paths.get(execution.getOutputPath()).resolve(GraphContextFactory.DEFAULT_GRAPH_SUBDIRECTORY);
    }
}
