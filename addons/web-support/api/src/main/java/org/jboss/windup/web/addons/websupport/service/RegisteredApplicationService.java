package org.jboss.windup.web.addons.websupport.service;

import com.tinkerpop.frames.structures.FramedVertexIterable;
import org.jboss.windup.graph.GraphContext;
import org.jboss.windup.graph.model.resource.FileModel;
import org.jboss.windup.graph.service.FileService;
import org.jboss.windup.graph.service.GraphService;
import org.jboss.windup.web.addons.websupport.model.RegisteredApplicationModel;

/**
 * @author <a href="mailto:jesse.sightler@gmail.com">Jesse Sightler</a>
 */
public interface RegisteredApplicationService
{
    RegisteredApplicationModel create(String filepath);
    Iterable<RegisteredApplicationModel> getAllRegisteredApplications();
}
