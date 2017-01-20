package org.jboss.windup.web.addons.websupport.services;

import org.jboss.windup.graph.model.resource.FileModel;
import org.jboss.windup.web.addons.websupport.rest.GraphPathLookup;

/**
 * @author <a href="mailto:dklingenberg@gmail.com">David Klingenberg</a>
 */
public interface ProjectLoaderService
{
    Iterable<FileModel> getTopLevelProjects(Long executionId);

    void setGraphPathLookup(GraphPathLookup graphPathLookup);
}
