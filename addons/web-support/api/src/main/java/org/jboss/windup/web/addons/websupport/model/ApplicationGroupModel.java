package org.jboss.windup.web.addons.websupport.model;

import com.tinkerpop.blueprints.Direction;
import com.tinkerpop.frames.Adjacency;
import com.tinkerpop.frames.Property;
import com.tinkerpop.frames.modules.typedgraph.TypeValue;
import org.jboss.windup.graph.model.WindupVertexFrame;

/**
 * This groups together multiple {@link RegisteredApplicationModel}s within a customer's analysis project. Note that
 * a single {@link RegisteredApplicationModel} may appear in one or more groups.
 *
 * @author <a href="mailto:jesse.sightler@gmail.com">Jesse Sightler</a>
 */
@TypeValue(ApplicationGroupModel.TYPE)
public interface ApplicationGroupModel extends WindupWebSupportVertexFrame
{
    String TYPE = WindupWebSupportVertexFrame.TYPE_PREFIX + "ApplicationGroup.";
    String APPLICATIONS = TYPE + "applications";
    String NAME = TYPE + "name";

    /**
     * Contains the name of the group.
     */
    @Property(NAME)
    String getName();

    /**
     * Contains the name of the group.
     */
    @Property(NAME)
    void setName(String name);

    /**
     * Contains a list of {@link RegisteredApplicationModel} referenced by this group.
     *
     * NOTE: It is possible for a single {@link RegisteredApplicationModel} to exist in multiple groups.
     */
    @Adjacency(label = APPLICATIONS, direction = Direction.OUT)
    Iterable<RegisteredApplicationModel> getApplications();

    /**
     * Contains a list of {@link RegisteredApplicationModel} referenced by this group.
     *
     * NOTE: It is possible for a single {@link RegisteredApplicationModel} to exist in multiple groups.
     */
    void setApplications(Iterable<RegisteredApplicationModel> applications);

    /**
     * Adds a {@link RegisteredApplicationModel} to this group.
     */
    void addApplication(RegisteredApplicationModel application);

    /**
     * Removes a {@link RegisteredApplicationModel} from this group.
     */
    void removeApplications(Iterable<RegisteredApplicationModel> applications);
}
