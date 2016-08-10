package org.jboss.windup.web.services.model;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.ManyToOne;
import javax.persistence.NamedQueries;
import javax.persistence.NamedQuery;

/**
 * Contains a source and target configuration pair. This can be preinitialized by Windup to simplify the selection
 * process for the user.
 *
 * @author <a href="mailto:jesse.sightler@gmail.com">Jesse Sightler</a>
 */
@Entity
@NamedQueries(
        @NamedQuery(
                name =  MigrationPath.FIND_ALL,
                query = "select mp from MigrationPath mp"
        )
)
public class MigrationPath implements Serializable
{
    public static final String FIND_ALL = "MigrationPath.findAll";

    private static final long serialVersionUID = 1L;

    @Id
    @Column(name = "id", updatable = false, nullable = false)
    private Long id;

    @Column(length = 255)
    private String name;

    @ManyToOne
    private Technology source;

    @ManyToOne
    private Technology target;

    public Long getId()
    {
        return id;
    }

    public void setId(Long id)
    {
        this.id = id;
    }

    /**
     * Contains a human-readable description of this migration path.
     */
    public String getName()
    {
        return name;
    }

    /**
     * Contains a human-readable description of this migration path.
     */
    public void setName(String name)
    {
        this.name = name;
    }

    /**
     * Contains the source {@link Technology} for rule filtering purposes.
     */
    public Technology getSource()
    {
        return source;
    }

    /**
     * Contains the source {@link Technology} for rule filtering purposes.
     */
    public void setSource(Technology source)
    {
        this.source = source;
    }

    /**
     * Contains the target {@link Technology} for rule filtering purposes.
     */
    public Technology getTarget()
    {
        return target;
    }

    /**
     * Contains the target {@link Technology} for rule filtering purposes.
     */
    public void setTarget(Technology target)
    {
        this.target = target;
    }

    @Override
    public boolean equals(Object o)
    {
        if (this == o)
            return true;
        if (!(o instanceof MigrationPath))
            return false;

        MigrationPath that = (MigrationPath) o;

        return id != null ? id.equals(that.id) : that.id == null;

    }

    @Override
    public int hashCode()
    {
        return id != null ? id.hashCode() : 0;
    }
}
