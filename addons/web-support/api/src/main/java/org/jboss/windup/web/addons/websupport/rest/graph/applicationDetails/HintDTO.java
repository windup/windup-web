package org.jboss.windup.web.addons.websupport.rest.graph.applicationDetails;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import javax.enterprise.inject.Vetoed;
import java.util.ArrayList;
import java.util.List;

/**
 * @author <a href="mailto:jesse.sightler@gmail.com">Jesse Sightler</a>
 */
@Vetoed
@JsonIgnoreProperties({"handler", "delegate"})
public class HintDTO
{
    private int title;
    private int javaFQCN;
    private List<TagDTO> tags = new ArrayList<>();
    private int effort;

    public int getTitle()
    {
        return title;
    }

    public void setTitle(int title)
    {
        this.title = title;
    }

    public int getJavaFQCN()
    {
        return javaFQCN;
    }

    public void setJavaFQCN(int javaFQCN)
    {
        this.javaFQCN = javaFQCN;
    }

    public List<TagDTO> getTags()
    {
        return tags;
    }

    public void setTags(List<TagDTO> tags)
    {
        this.tags = tags;
    }

    public int getEffort()
    {
        return effort;
    }

    public void setEffort(int effort)
    {
        this.effort = effort;
    }
}
