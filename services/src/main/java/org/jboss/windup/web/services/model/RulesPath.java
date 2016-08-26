package org.jboss.windup.web.services.model;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Version;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

import org.jboss.windup.web.services.validators.FileExistsConstraint;

/**
 * Contains the path to a Rules directory.
 *
 * @author <a href="mailto:jesse.sightler@gmail.com">Jesse Sightler</a>
 */
@Entity
public class RulesPath implements Serializable
{
    public static final String REGISTERED_APPLICATION_ID = "registered_application_id";

    public enum RulesPathType
    {
        SYSTEM_PROVIDED, USER_PROVIDED
    }

    private static final long serialVersionUID = 1L;
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = REGISTERED_APPLICATION_ID, updatable = false, nullable = false)
    private Long id;
    @Version
    @Column(name = "version")
    private int version;

    @Column(length = 2048)
    @Size(min = 1, max = 2048)
    @FileExistsConstraint
    @NotNull
    private String path;

    @Column
    private RulesPathType rulesPathType;

    public RulesPath()
    {
    }

    public RulesPath(String path, RulesPathType rulesPathType)
    {
        this.path = path;
        this.rulesPathType = rulesPathType;
    }

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
     * Contains the path to the rules directory.
     */
    public String getPath()
    {
        return path;
    }

    /**
     * Contains the path to the rules directory.
     */
    public void setPath(String inputPath)
    {
        this.path = inputPath;
    }

    /**
     * Contains the type of rules path (for example, system provided vs user provided).
     */
    public RulesPathType getRulesPathType()
    {
        return rulesPathType;
    }

    /**
     * Contains the type of rules path (for example, system provided vs user provided).
     */
    public void setRulesPathType(RulesPathType rulesPathType)
    {
        this.rulesPathType = rulesPathType;
    }

    @Override
    public String toString()
    {
        return "RulesPath{" +
                "id=" + id +
                ", version=" + version +
                ", path='" + path + '\'' +
                ", rulesPathType=" + rulesPathType +
                '}';
    }
}
