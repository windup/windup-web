package org.jboss.windup.web.addons.websupport.rest.graph.applicationDetails;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import org.jboss.windup.reporting.model.TechnologyTagLevel;
import org.jboss.windup.reporting.model.TechnologyTagModel;

import javax.enterprise.inject.Vetoed;

/**
 * This provides the limited set of data about tags that is required by the client for the application details report.
 *
 * @author <a href="mailto:jesse.sightler@gmail.com">Jesse Sightler</a>
 */
@Vetoed
@JsonIgnoreProperties({"handler", "delegate"})
public class TagReducedDTO
{
    private int name;
    private int level;

    /**
     * Creates an empty object. This is primarily here to allow Java proxy object creation.
     */
    public TagReducedDTO()
    {
    }

    /**
     * Creates an instance with the given name and level. Each is a reference to
     * an entry in the string cache. The levels are defined in {@link TechnologyTagLevel}.
     */
    TagReducedDTO(int name, int level)
    {
        this.name = name;
        this.level = level;
    }

    /**
     * Contains the name as a reference to an entry in the string cache.
     */
    public int getName()
    {
        return name;
    }

    /**
     * Contains the level as a reference to an entry in the string cache.
     */
    public int getLevel()
    {
        return level;
    }
}
