package org.jboss.windup.web.addons.websupport.model;

import com.tinkerpop.frames.modules.typedgraph.TypeValue;
import org.jboss.windup.graph.model.resource.FileModel;

/**
 * @author <a href="mailto:jesse.sightler@gmail.com">Jesse Sightler</a>
 */
@TypeValue(RegisteredApplicationModel.TYPE)
public interface RegisteredApplicationModel extends WindupWebSupportVertexFrame, FileModel
{
    String TYPE = TYPE_PREFIX + "RegisteredApplicationModel";
}
