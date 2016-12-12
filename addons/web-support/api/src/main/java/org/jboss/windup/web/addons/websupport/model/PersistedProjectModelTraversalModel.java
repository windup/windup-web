package org.jboss.windup.web.addons.websupport.model;

import com.tinkerpop.frames.Adjacency;
import com.tinkerpop.frames.Property;
import com.tinkerpop.frames.modules.typedgraph.TypeValue;
import org.jboss.windup.graph.model.ProjectModel;
import org.jboss.windup.graph.model.WindupVertexFrame;

/**
 * @author <a href="mailto:jesse.sightler@gmail.com">Jesse Sightler</a>
 */
@TypeValue(PersistedProjectModelTraversalModel.TYPE)
public interface PersistedProjectModelTraversalModel extends WindupVertexFrame
{
    enum PersistedTraversalType
    {
        ALL,
        ONLY_ONCE,
        SHARED_ONLY
    }

    String TYPE = "PersistedProjectModelTraversal";
    String TRAVERSAL_TYPE = TYPE + ".traversalType";

    String ROOT = TYPE + ".root";
    String PATH = TYPE + ".path";
    String CHILD = TYPE + ".child";
    String CURRENT_PROJECT = TYPE + ".currentProject";
    String CANONICAL_PROJECT = TYPE + ".canonicalProject";
    String FILES = TYPE + ".files";

    @Property(TRAVERSAL_TYPE)
    PersistedTraversalType getTraversalType();

    @Property(TRAVERSAL_TYPE)
    void setTraversalType(PersistedTraversalType persistedTraversalType);

    @Property(ROOT)
    boolean isRoot();

    @Property(ROOT)
    void setRoot(boolean root);

    @Property(PATH)
    String getPath();

    @Property(PATH)
    void setPath(String path);

    @Adjacency(label = CANONICAL_PROJECT)
    ProjectModel getCanonicalProject();

    @Adjacency(label = CANONICAL_PROJECT)
    void setCanonicalProject(ProjectModel projectModel);

    @Adjacency(label = CURRENT_PROJECT)
    ProjectModel getCurrentProject();

    @Adjacency(label = CURRENT_PROJECT)
    void setCurrentProject(ProjectModel projectModel);

    @Adjacency(label = CHILD)
    Iterable<PersistedProjectModelTraversalModel> getChildren();

    @Adjacency(label = CHILD)
    void addChild(PersistedProjectModelTraversalModel child);

    @Adjacency(label = FILES)
    Iterable<PersistedTraversalChildFileModel> getFiles();

    @Adjacency(label = FILES)
    void addFile(PersistedTraversalChildFileModel file);
}
