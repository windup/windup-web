package org.jboss.windup.web.addons.websupport.model;

import org.jboss.windup.graph.Adjacency;
import org.jboss.windup.graph.Property;
import org.jboss.windup.graph.model.ProjectModel;
import org.jboss.windup.graph.model.TypeValue;
import org.jboss.windup.graph.model.WindupVertexFrame;
import org.jboss.windup.graph.traversal.ProjectModelTraversal;
import org.jboss.windup.reporting.model.OverviewReportLineMessageModel;

import java.util.List;

/**
 * Persists a {@link ProjectModelTraversal} to the graph.
 *
 * @author <a href="mailto:jesse.sightler@gmail.com">Jesse Sightler</a>
 */
@TypeValue(PersistedProjectModelTraversalModel.TYPE)
public interface PersistedProjectModelTraversalModel extends WindupVertexFrame
{

    /**
     * Indicates the type of traversal (all, only non-duplicates, etc)
     */
    enum PersistedTraversalType
    {
        ALL,
        ONLY_ONCE,
        SHARED_ONLY;
    }
    String TYPE = "PersistedProjectModelTraversal";

    String TRAVERSAL_TYPE = TYPE + ".traversalType";
    String ROOT = TYPE + ".root";

    String PATH = TYPE + ".path";
    String CHILD = TYPE + ".child";
    String CURRENT_PROJECT = TYPE + ".currentProject";
    String CANONICAL_PROJECT = TYPE + ".canonicalProject";
    String FILES = TYPE + ".files";
    String APPLICATION_MESSAGES = TYPE + ".applicationMessages";

    /**
     * Contains the type of traversal (eg, types that include all duplicates, only include duplicated projects once,
     * and that only contain shared projects).
     */
    @Property(TRAVERSAL_TYPE)
    PersistedTraversalType getTraversalType();

    /**
     * Contains the type of traversal (eg, types that include all duplicates, only include duplicated projects once,
     * and that only contain shared projects).
     */
    @Property(TRAVERSAL_TYPE)
    void setTraversalType(PersistedTraversalType persistedTraversalType);

    /**
     * Indicates whether this is the root of the traversal.
     */
    @Property(ROOT)
    boolean isRoot();

    /**
     * Indicates whether this is the root of the traversal.
     */
    @Property(ROOT)
    void setRoot(boolean root);

    /**
     * Contains the path to this project, suitable for display in reports (relative path).
     */
    @Property(PATH)
    String getPath();

    /**
     * Contains the path to this project, suitable for display in reports (relative path).
     */
    @Property(PATH)
    void setPath(String path);

    /**
     * Contains the canonical project (the first project that was found if this is a duplicate).
     *
     * See also {@link ProjectModelTraversal#getCanonicalProject()}.
     */
    @Adjacency(label = CANONICAL_PROJECT)
    ProjectModel getCanonicalProject();

    /**
     * Contains the canonical project (the first project that was found if this is a duplicate).
     *
     * See also {@link ProjectModelTraversal#getCanonicalProject()}.
     */
    @Adjacency(label = CANONICAL_PROJECT)
    void setCanonicalProject(ProjectModel projectModel);

    /**
     * Contains the current project. See also {@link ProjectModelTraversal#getCurrent()}.
     */
    @Adjacency(label = CURRENT_PROJECT)
    ProjectModel getCurrentProject();

    /**
     * Contains the current project. See also {@link ProjectModelTraversal#getCurrent()}.
     */
    @Adjacency(label = CURRENT_PROJECT)
    void setCurrentProject(ProjectModel projectModel);

    /**
     * Contains children of this traversal.
     */
    @Adjacency(label = CHILD)
    List<PersistedProjectModelTraversalModel> getChildren();

    /**
     * Contains children of this traversal.
     */
    @Adjacency(label = CHILD)
    void addChild(PersistedProjectModelTraversalModel child);

    /**
     * Contains all files within the current project.
     */
    @Adjacency(label = FILES)
    List<PersistedTraversalChildFileModel> getFiles();

    /**
     * Contains all files within the current project.
     */
    @Adjacency(label = FILES)
    void addFile(PersistedTraversalChildFileModel file);

    /**
     * Contains any application level messages provided by the rules.
     */
    @Adjacency(label = APPLICATION_MESSAGES)
    List<OverviewReportLineMessageModel> getApplicationMessages();

    /**
     * Contains any application level messages provided by the rules.
     */
    @Adjacency(label = APPLICATION_MESSAGES)
    void addApplicationMessages(OverviewReportLineMessageModel overviewReportLineMessageModel);
}
