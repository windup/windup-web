package org.jboss.windup.web.services.model;

import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;

import java.io.Serializable;
import java.util.Set;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.OneToMany;
import javax.persistence.Version;
import javax.persistence.CascadeType;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

/**
 * A migration project is a group of applications which are related to each other and migrated as a bigger enterprise system.
 *
 * @author <a href="http://ondra.zizka.cz/">Ondrej Zizka, zizka@seznam.cz</a>
 */
@Entity
@JsonIdentityInfo(generator = ObjectIdGenerators.PropertyGenerator.class, property = "id", scope = MigrationProject.class)
public class MigrationProject implements Serializable
{
    private static final long serialVersionUID = 1L;

    public static final String MIGRATION_PROJECT_ID = "migration_project_id";

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = MIGRATION_PROJECT_ID, updatable = false, nullable = false)
    private Long id;

    @Version
    @Column(name = "version")
    private int version;

    @Column(length = 256)
    @Size(min = 1, max = 256)
    @NotNull
    private String title;

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "migrationProject", cascade = CascadeType.REMOVE)
    private Set<ApplicationGroup> groups;

    public Long getId()
    {
        return this.id;
    }

    public void setId(final Long id)
    {
        this.id = id;
    }

    public int getVersion()
    {
        return this.version;
    }

    public void setVersion(final int version)
    {
        this.version = version;
    }

    /**
     * Contains a title for the project.
     */
    public String getTitle()
    {
        return title;
    }

    /**
     * Contains a title for the project.
     */
    public void setTitle(String title)
    {
        this.title = title;
    }

    /**
     * Contains the {@link ApplicationGroup}s associated with this project.
     */
    @JsonIgnore
    public Set<ApplicationGroup> getGroups()
    {
        return groups;
    }

    /**
     * Contains the {@link ApplicationGroup}s associated with this project.
     */
    @JsonIgnore
    public void setGroups(Set<ApplicationGroup> groups)
    {
        this.groups = groups;
    }

    @Override
    public boolean equals(Object o)
    {
        if (this == o)
            return true;
        if (!(o instanceof MigrationProject))
            return false;

        MigrationProject that = (MigrationProject) o;

        if (version != that.version)
            return false;
        return id != null ? id.equals(that.id) : that.id == null;

    }

    @Override
    public int hashCode()
    {
        int result = id != null ? id.hashCode() : 0;
        result = 31 * result + version;
        return result;
    }
}
