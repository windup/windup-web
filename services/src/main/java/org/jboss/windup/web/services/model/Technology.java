package org.jboss.windup.web.services.model;

import org.apache.commons.lang3.StringUtils;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Version;

/**
 * This represents a technology and an associated version range (for example, "eap" and "[6]").
 *
 * @author <a href="mailto:jesse.sightler@gmail.com">Jesse Sightler</a>
 */
@Entity
public class Technology implements Serializable
{
    private static final long serialVersionUID = 1L;

    public static final String TECHNOLOGY_ID = "technology_id";

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = TECHNOLOGY_ID, updatable = false, nullable = false)
    private Long id;

    @Version
    @Column(name = "version")
    private int version;

    private String name;
    private String versionRange;

    public Long getId()
    {
        return id;
    }

    public void setId(Long id)
    {
        this.id = id;
    }

    public int getVersion()
    {
        return version;
    }

    public void setVersion(int version)
    {
        this.version = version;
    }

    /**
     * Contains the name of the technology (for example, 'eap').
     */
    public String getName()
    {
        return name;
    }

    /**
     * Contains the name of the technology (for example, 'eap').
     */
    public void setName(String name)
    {
        this.name = name;
    }

    /**
     * Contains the version range of the technology (for example, '[6]').
     */
    public String getVersionRange()
    {
        return versionRange;
    }

    /**
     * Contains the version range of the technology (for example, '[6]').
     */
    public void setVersionRange(String versionRange)
    {
        this.versionRange = versionRange;
    }

    @Override
    public boolean equals(Object o)
    {
        if (this == o)
            return true;
        if (!(o instanceof Technology))
            return false;

        Technology that = (Technology) o;

        return id != null ? id.equals(that.id) : that.id == null;

    }

    @Override
    public int hashCode()
    {
        return id != null ? id.hashCode() : 0;
    }

    @Override
    public String toString()
    {
        String versionRangeSuffix = StringUtils.isNotBlank(this.versionRange) ? ":" + this.versionRange : "";

        return this.name + versionRangeSuffix;
    }
}
