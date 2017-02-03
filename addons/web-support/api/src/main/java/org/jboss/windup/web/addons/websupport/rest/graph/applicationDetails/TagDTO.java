package org.jboss.windup.web.addons.websupport.rest.graph.applicationDetails;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import javax.enterprise.inject.Vetoed;

/**
 * @author <a href="mailto:jesse.sightler@gmail.com">Jesse Sightler</a>
 */
@Vetoed
@JsonIgnoreProperties({"handler", "delegate"})
public class TagDTO
{
    private int name;
    private int level;

    public TagDTO()
    {
    }

    public TagDTO(int name, int level)
    {
        this.name = name;
        this.level = level;
    }

    public int getName()
    {
        return name;
    }

    public int getLevel()
    {
        return level;
    }
}
