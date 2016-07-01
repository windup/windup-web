package org.jboss.windup.web.addons.websupport.model;


import com.tinkerpop.blueprints.Direction;
import com.tinkerpop.frames.Adjacency;
import com.tinkerpop.frames.Property;
import org.jboss.windup.graph.model.WindupVertexFrame;

/**
 * A migration project is a group of applications which are related to each other
 * and migrated as a bigger enterprise system.
 *
 * @author <a href="http://ondra.zizka.cz/">Ondrej Zizka, zizka@seznam.cz</a>
 */
public interface MigrationProjectModel extends WindupVertexFrame
{
    static final String TYPE_PROP = "MigrationProject";
    static final String PROP_ID = TYPE_PROP + "-id";
    static final String PROP_TITLE = TYPE_PROP + "-title";

    /**
     * The unique ID of this migration project.
     */
    @Property(PROP_ID)
    String getId();

    /**
     * The unique ID of this migration project.
     */
    @Property(TYPE_PROP + "-id")
    MigrationProjectModel setId(String id);


    /**
     * The title of this migration project.
     */
    @Property(PROP_TITLE)
    String getTitle();

    /**
     * The title of this migration project.
     */
    @Property(TYPE_PROP + "-title")
    MigrationProjectModel setTitle(String title);

    /**
     * The applications which belong under this project.
     * An application should only belong under a single project.
     */
    @Adjacency(label = TYPE_PROP + "-apps", direction = Direction.OUT)
    Iterable<RegisteredApplicationModel> getApplications();

    /**
     * The applications which belong under this project.
     * An application should only belong under a single project.
     */
    @Adjacency(label = TYPE_PROP + "-apps", direction = Direction.OUT)
    MigrationProjectModel setApplications(Iterable<RegisteredApplicationModel> applications);
}
