package org.jboss.windup.web.services.model;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Index;
import javax.persistence.Lob;
import javax.persistence.Table;
import javax.persistence.Version;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

import org.hibernate.annotations.ColumnDefault;
import org.jboss.windup.web.services.validators.FileExistsConstraint;

/**
 * Contains the path to a Rules directory.
 *
 * @author <a href="mailto:jesse.sightler@gmail.com">Jesse Sightler</a>
 */
@Entity
@Table(indexes = @Index(columnList = "path"))
public class RulesPath implements Serializable
{
    public static final String RULES_PATH_ID = "rules_path_id";
    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = RULES_PATH_ID, updatable = false, nullable = false)
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
    @NotNull
    @ColumnDefault("true")
    private boolean scanRecursively = true;

    @Column(length = 2048)
    @Size(min = 1, max = 2048)
    private String shortPath;

    @Lob
    private String loadError;

    @Column
    private RulesPathType rulesPathType;

    @Column
    private RegistrationType registrationType;

    public RulesPath()
    {
    }

    public RulesPath(String path, RulesPathType rulesPathType)
    {
        this.path = path;
        this.rulesPathType = rulesPathType;
    }

    public RulesPath(String path, RulesPathType rulesPathType, RegistrationType registrationType)
    {
        this(path, rulesPathType);
        this.registrationType = registrationType;
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
     * If true and given path is a directory, the subdirectories will also be scanned for rulesets.
     */
    public boolean isScanRecursively() {
        return scanRecursively;
    }

    /**
     * If true and given path is a directory, the subdirectories will also be scanned for rulesets.
     */
    public void setScanRecursively(boolean scanRecursively) {
        this.scanRecursively = scanRecursively;
    }

    /**
     * Contains a short file path, suitable for display. This is primarily useful for user
     * uploaded rules, where we may not want to display the entire path.
     */
    public String getShortPath()
    {
        return shortPath;
    }

    /**
     * Contains a short file path, suitable for display. This is primarily useful for user
     * uploaded rules, where we may not want to display the entire path.
     */
    public void setShortPath(String shortPath)
    {
        this.shortPath = shortPath;
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

    /**
     * Contains a load error if there were any issues loading rules from this path.
     */
    public String getLoadError()
    {
        return loadError;
    }

    /**
     * Contains a load error if there were any issues loading rules from this path.
     */
    public void setLoadError(String loadError)
    {
        this.loadError = loadError;
    }

    public RegistrationType getRegistrationType()
    {
        return registrationType;
    }

    public void setRegistrationType(RegistrationType registrationType)
    {
        this.registrationType = registrationType;
    }

    @Override
    public boolean equals(Object o)
    {
        if (this == o)
            return true;
        if (!(o instanceof RulesPath))
            return false;

        RulesPath rulesPath = (RulesPath) o;

        if (path != null ? !path.equals(rulesPath.path) : rulesPath.path != null)
            return false;
        return rulesPathType == rulesPath.rulesPathType;
    }

    @Override
    public int hashCode()
    {
        int result = path != null ? path.hashCode() : 0;
        result = 31 * result + (rulesPathType != null ? rulesPathType.hashCode() : 0);
        return result;
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

    public enum RulesPathType
    {
        SYSTEM_PROVIDED, USER_PROVIDED
    }
}
