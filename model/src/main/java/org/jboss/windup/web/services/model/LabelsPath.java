package org.jboss.windup.web.services.model;

import org.hibernate.annotations.ColumnDefault;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import java.io.Serializable;

/**
 * Contains the path to a Labels directory.
 *
 * @author <a href="carlosthe19916@gmail.com">Carlos Feria</a>
 */
@Entity
@Table(indexes = @Index(columnList = "path"))
public class LabelsPath implements Serializable
{
    public static final String LABELS_PATH_ID = "labels_path_id";
    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = LABELS_PATH_ID, updatable = false, nullable = false)
    private Long id;

    @Version
    @Column(name = "version")
    private int version;

    @Column(length = 2048)
    @Size(min = 1, max = 2048)
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
    private LabelsPathType labelsPathType;

    @Column
    private RegistrationType registrationType;

    public LabelsPath()
    {
    }

    public LabelsPath(String path, LabelsPathType labelsPathType)
    {
        this.path = path;
        this.labelsPathType = labelsPathType;
    }

    public LabelsPath(String path, LabelsPathType labelsPathType, RegistrationType registrationType)
    {
        this(path, labelsPathType);
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
    public LabelsPathType getLabelsPathType()
    {
        return labelsPathType;
    }

    /**
     * Contains the type of rules path (for example, system provided vs user provided).
     */
    public void setLabelsPathType(LabelsPathType labelsPathType)
    {
        this.labelsPathType = labelsPathType;
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
        if (!(o instanceof LabelsPath))
            return false;

        LabelsPath rulesPath = (LabelsPath) o;

        if (path != null ? !path.equals(rulesPath.path) : rulesPath.path != null)
            return false;
        return labelsPathType == rulesPath.labelsPathType;
    }

    @Override
    public int hashCode()
    {
        int result = path != null ? path.hashCode() : 0;
        result = 31 * result + (labelsPathType != null ? labelsPathType.hashCode() : 0);
        return result;
    }

    @Override
    public String toString()
    {
        return "RulesPath{" +
                    "id=" + id +
                    ", version=" + version +
                    ", path='" + path + '\'' +
                    ", labelsPathType=" + labelsPathType +
                    '}';
    }

    public enum LabelsPathType
    {
        SYSTEM_PROVIDED, USER_PROVIDED
    }
}
