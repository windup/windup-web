package org.jboss.windup.web;

import com.tinkerpop.frames.structures.FramedVertexIterable;
import org.jboss.windup.graph.GraphContext;
import org.jboss.windup.graph.model.resource.FileModel;
import org.jboss.windup.graph.service.FileService;
import org.jboss.windup.graph.service.GraphService;
import org.jboss.windup.web.addons.websupport.model.RegisteredApplicationModel;
import org.jboss.windup.web.addons.websupport.service.RegisteredApplicationService;

/**
 * @author <a href="mailto:jesse.sightler@gmail.com">Jesse Sightler</a>
 */
public class RegisteredApplicationServiceImpl extends GraphService<RegisteredApplicationModel> implements RegisteredApplicationService
{
    public RegisteredApplicationServiceImpl(GraphContext context)
    {
        super(context, RegisteredApplicationModel.class);
    }

    public RegisteredApplicationModel create(String filepath)
    {
        FileService fileService = new FileService(getGraphContext());
        FileModel fileModel = fileService.createByFilePath(filepath);
        RegisteredApplicationModel result = addTypeToModel(fileModel);
        getGraphContext().getFramed().getBaseGraph().getBaseGraph().commit();
        return result;
    }

    public Iterable<RegisteredApplicationModel> getAllRegisteredApplications()
    {
        return new FramedVertexIterable<>(getGraphContext().getFramed(), findAllQuery().vertices(), RegisteredApplicationModel.class);
    }

}
