package org.jboss.windup.web.addons.websupport.model;

import com.tinkerpop.frames.Adjacency;
import com.tinkerpop.frames.Property;
import com.tinkerpop.frames.modules.typedgraph.TypeValue;
import org.jboss.windup.graph.model.WindupVertexFrame;
import org.jboss.windup.graph.model.resource.FileModel;

/**
 * @author <a href="mailto:jesse.sightler@gmail.com">Jesse Sightler</a>
 */
@TypeValue(PersistedTraversalChildFileModel.TYPE)
public interface PersistedTraversalChildFileModel extends WindupVertexFrame
{
    String TYPE = "PersistedProjectModelTraversalChildFile";
    String FILE_PATH = TYPE + ".filePath";
    String FILE_MODEL = TYPE + ".fileModel";

    @Property(FILE_PATH)
    String getFilePath();

    @Property(FILE_PATH)
    void setFilePath(String filePath);

    @Adjacency(label = FILE_MODEL)
    FileModel getFileModel();

    @Adjacency(label = FILE_MODEL)
    void setFileModel(FileModel fileModel);
}
