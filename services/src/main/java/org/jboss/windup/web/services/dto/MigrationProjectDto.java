package org.jboss.windup.web.services.dto;

import java.util.Objects;
import org.jboss.windup.web.addons.websupport.model.MigrationProjectModel;


/**
 * Provides an easy way to transfer MigrationProject information between the client and server
 *
 * @author <a href="http://ondra.zizka.cz/">Ondrej Zizka, zizka@seznam.cz</a>
 */
public class MigrationProjectDto
{
    private String id;
    private String title;

    public MigrationProjectDto()
    {
    }

    public MigrationProjectDto(String id)
    {
        this.id = id;
    }

    public MigrationProjectDto(String id, String title)
    {
        this.id = id;
        this.title = title;
    }

    public MigrationProjectDto(MigrationProjectModel model)
    {
        this(model.getId(), model.getTitle());
    }

    public String getId()
    {
        return this.id;
    }

    public void setId(String id)
    {
        this.id = id;
    }


    public String getTitle()
    {
        return title;
    }


    public void setTitle(String title)
    {
        this.title = title;
    }


    @Override
    public int hashCode()
    {
        int hash = 7;
        hash = 79 * hash + Objects.hashCode(this.id);
        hash = 79 * hash + Objects.hashCode(this.title);
        return hash;
    }


    @Override
    public boolean equals(Object obj)
    {
        if (this == obj)
            return true;
        if (obj == null)
            return false;
        if (getClass() != obj.getClass())
            return false;
        final MigrationProjectDto other = (MigrationProjectDto) obj;
        if (!Objects.equals(this.id, other.id))
            return false;
        if (!Objects.equals(this.title, other.title))
            return false;
        return true;
    }

}
