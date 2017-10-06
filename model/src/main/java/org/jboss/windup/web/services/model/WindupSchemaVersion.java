package org.jboss.windup.web.services.model;

import java.io.Serializable;
import java.util.Calendar;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;

/**
 * This maintains a row containing the current schema version of the database.
 *
 * @author <a href="mailto:jesse.sightler@gmail.com">Jesse Sightler</a>
 */
@Entity
public class WindupSchemaVersion implements Serializable
{
    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "schema_version_id", updatable = false, nullable = false)
    private Long id;

    @Column(nullable = false)
    private int schemaVersion;

    @Column(nullable = false)
    @Temporal(TemporalType.TIMESTAMP)
    private Calendar dateModified;

    public int getSchemaVersion()
    {
        return schemaVersion;
    }

    public void setSchemaVersion(int schemaVersion)
    {
        this.schemaVersion = schemaVersion;
    }

    public Calendar getDateModified()
    {
        return dateModified;
    }

    public void setDateModified(Calendar dateModified)
    {
        this.dateModified = dateModified;
    }

    @Override
    public String toString()
    {
        return "WindupSchemaVersion{" +
                    "id=" + id +
                    ", schemaVersion=" + schemaVersion +
                    ", dateModified=" + dateModified +
                    '}';
    }

    @Override
    public boolean equals(Object o)
    {
        if (this == o)
            return true;
        if (!(o instanceof WindupSchemaVersion))
            return false;

        WindupSchemaVersion that = (WindupSchemaVersion) o;

        return schemaVersion == that.schemaVersion;
    }

    @Override
    public int hashCode()
    {
        return schemaVersion;
    }
}
