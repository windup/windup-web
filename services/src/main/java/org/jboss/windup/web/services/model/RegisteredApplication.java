package org.jboss.windup.web.services.model;

import java.io.Serializable;
import java.nio.file.Paths;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;
import org.jboss.windup.web.services.validators.FileExistsConstraint;

/**
 * Contains an application that has been registered into Windup.
 */
@Entity
@JsonIdentityInfo(generator = ObjectIdGenerators.PropertyGenerator.class, property = "id", scope = RegisteredApplication.class)
public class RegisteredApplication implements Serializable
{
    public enum RegistrationType {
        UPLOADED,
        PATH
    }

    private static final long serialVersionUID = 1L;

    public static final String REGISTERED_APPLICATION_ID = "registered_application_id";

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = REGISTERED_APPLICATION_ID, updatable = false, nullable = false)
    private Long id;

    @Version
    @Column(name = "version")
    private int version;

    @Column
    private RegistrationType registrationType;

    @Column(length = 256)
    @Size(min = 1, max = 256)
    @NotNull
    private String title;

    @Column(length = 2048)
    @Size(min = 1, max = 2048)
    @FileExistsConstraint
    @NotNull
    private String inputPath;

    @Column(length = 2048)
    private String reportIndexPath;

    @ManyToOne()
    private ApplicationGroup applicationGroup;

    @OneToOne(fetch = FetchType.LAZY)
    private PackageMetadata packageMetadata;

    public RegisteredApplication()
    {
    }

    public RegisteredApplication(String inputPath)
    {
        this.inputPath = inputPath;
        this.title = Paths.get(inputPath).getFileName().toString();
    }

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
     * Contains an indication as to the type of file (uploaded vs registered directly as a path on the server).
     */
    public RegistrationType getRegistrationType()
    {
        return registrationType;
    }

    /**
     * Contains an indication as to the type of file (uploaded vs registered directly as a path on the server).
     */
    public void setRegistrationType(RegistrationType registrationType)
    {
        this.registrationType = registrationType;
    }

    public String getInputPath()
    {
        return inputPath;
    }

    public String getInputFilename()
    {
        if (this.getInputPath() == null)
            return null;
        else
            return Paths.get(getInputPath()).getFileName().toString();
    }

    public void setInputFilename(String inputFilename)
    {
        // noop
    }

    public void setInputPath(String inputPath)
    {
        this.inputPath = inputPath;

        if (getInputPath() == null)
            setInputFilename("");

        setInputFilename(Paths.get(getInputPath()).getFileName().toString());
    }

    /**
     * Contains the path to the primary report for this particular application.
     */
    public String getReportIndexPath()
    {
        return reportIndexPath;
    }

    /**
     * Contains the path to the primary report for this particular application.
     */
    public void setReportIndexPath(String reportIndexPath)
    {
        this.reportIndexPath = reportIndexPath;
    }

    /**
     * References the {@link ApplicationGroup} that contains this application.
     */
    public ApplicationGroup getApplicationGroup()
    {
        return applicationGroup;
    }

    /**
     * References the {@link ApplicationGroup} that contains this application.
     */
    public void setApplicationGroup(ApplicationGroup applicationGroup)
    {
        this.applicationGroup = applicationGroup;
    }

    /**
     * Gets application title
     *
     * @return Title
     */
    public String getTitle()
    {
        return title;
    }

    /**
     * Sets application title
     *
     * @param title Title
     */
    public void setTitle(String title)
    {
        this.title = title;
    }

    /**
     * Gets package metadata
     *
     * @return Package metadata
     */
    @JsonIgnore
    public PackageMetadata getPackageMetadata()
    {
        return packageMetadata;
    }

    /**
     * Sets package metadata
     *
     * @param packageMetadata New package metadata
     */
    public void setPackageMetadata(PackageMetadata packageMetadata)
    {
        this.packageMetadata = packageMetadata;
    }

    @Override
    public String toString()
    {
        String result = getClass().getSimpleName() + " ";
        if (id != null)
            result += "id: " + id;
        return result;
    }

    @Override
    public boolean equals(Object obj)
    {
        if (this == obj)
        {
            return true;
        }
        if (!(obj instanceof RegisteredApplication))
        {
            return false;
        }
        RegisteredApplication other = (RegisteredApplication) obj;
        if (id != null)
        {
            return id.equals(other.id);
        }

        return false;
    }

    @Override
    public int hashCode()
    {
        final int prime = 31;
        int result = 1;
        result = prime * result + ((id == null) ? 0 : id.hashCode());
        return result;
    }
}
