package org.jboss.windup.web.addons.websupport.rest.graph.applicationDetails;

import java.util.ArrayList;
import java.util.List;

import javax.enterprise.inject.Vetoed;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

/**
 * Contains a reduced set of classification data, used for transmitting these details for the application details
 * report.
 *
 * @author <a href="mailto:jesse.sightler@gmail.com">Jesse Sightler</a>
 */
@Vetoed
@JsonIgnoreProperties({ "handler", "delegate" })
public class ClassificationReducedDTO
{
    private int title;
    private List<TagReducedDTO> tags = new ArrayList<>();
    private int effort;

    /**
     * Contains the classification title.
     */
    public int getTitle()
    {
        return title;
    }

    /**
     * Contains the classification title.
     */
    public void setTitle(int title)
    {
        this.title = title;
    }

    /**
     * Contains tags associated with this classification.
     */
    public List<TagReducedDTO> getTags()
    {
        return tags;
    }

    /**
     * Contains tags associated with this classification.
     */
    public void setTags(List<TagReducedDTO> tags)
    {
        this.tags = tags;
    }

    /**
     * Contains the effort level for this classification.
     */
    public int getEffort()
    {
        return effort;
    }

    /**
     * Contains the effort level for this classification.
     */
    public void setEffort(int effort)
    {
        this.effort = effort;
    }
}
