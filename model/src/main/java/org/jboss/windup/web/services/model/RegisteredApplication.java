package org.jboss.windup.web.services.model;

import java.io.Serializable;
import java.nio.file.Paths;
import java.util.Calendar;
import java.util.GregorianCalendar;

import javax.persistence.Access;
import javax.persistence.AccessType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.ManyToOne;
import javax.persistence.OneToOne;
import javax.persistence.PrePersist;
import javax.persistence.PreUpdate;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;
import javax.persistence.Version;
import javax.validation.constraints.Size;

import org.hibernate.annotations.ColumnDefault;
import org.hibernate.annotations.Type;
import org.jboss.windup.web.services.validators.FileExistsConstraint;

import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;

/**
 * Contains an application that has been registered into Windup.
 */
@Entity
@JsonIdentityInfo(generator = ObjectIdGenerators.PropertyGenerator.class, property = "id", scope = RegisteredApplication.class)
public class RegisteredApplication implements Serializable
{
    private static final long serialVersionUID = 1L;

    public static final String REGISTERED_APPLICATION_ID = "registered_application_id";

    @Id
    @Access(AccessType.PROPERTY) // Allow accessing ID without Lazy-loading the entity.
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = REGISTERED_APPLICATION_ID, updatable = false, nullable = false)
    private Long id;

    @Version
    @Column(name = "version")
    private int version;

    @Column
    private RegistrationType registrationType;

    @Column(length = 256)
    @Size(min = 1, max = 256, message = "The application title must be set and not longer than 250 characters.")
    private String title;
    
    @Column(name = "file_size", nullable = false)
    @ColumnDefault("0")
    private long fileSize;

    @Column(length = 2048)
    @FileExistsConstraint(message = "The path does not exist on the server: ${validatedValue}")
    @Size(min = 1, max = 2048, message = "The application title path must be set and not longer than 2048 characters.")
    private String inputPath;

    /**
     * If it is a directory, it contains an exploded application.
     */
    @Column(nullable = false)
    @ColumnDefault("FALSE")
    @Type(type= "yes_no")
    private boolean exploded;

    @Column(length = 2048)
    private String reportIndexPath;

    @ManyToOne
    private MigrationProject migrationProject;

    @OneToOne(fetch = FetchType.LAZY)
    private PackageMetadata packageMetadata;

    @Column(columnDefinition = "TIMESTAMP DEFAULT CURRENT_TIMESTAMP", insertable = false, updatable = false)
    @Temporal(TemporalType.TIMESTAMP)
    private Calendar created;

    @Column(columnDefinition = "TIMESTAMP DEFAULT CURRENT_TIMESTAMP")
    @Temporal(TemporalType.TIMESTAMP)
    private Calendar lastModified;

    @Column
    @Type(type= "yes_no")
    private boolean isDeleted = false;

    public RegisteredApplication()
    {

    }

    public RegisteredApplication(String inputPath)
    {
        this();
        this.inputPath = inputPath;
        this.title = Paths.get(inputPath).getFileName().toString();
    }

    public RegisteredApplication(MigrationProject project)
    {
        this();
        this.migrationProject = project;
    }

    @PrePersist
    protected void onCreate()
    {
        this.created = this.lastModified = new GregorianCalendar();
    }

    @PreUpdate
    protected void onUpdated()
    {
        this.lastModified = new GregorianCalendar();
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

    /**
     * If true, the path should be treated as an exploded Java EE application.
     * NOTE: Windup Core can actually only treat all dirs as exploded or not - there is only a global option for that.
     *       That makes this a per-execution option. See WindupExecutionTask for what's the workaround.
     */
    public boolean isExploded()
    {
        return exploded;
    }

    /**
     * If true, the path should be treated as an exploded Java EE application.
     * NOTE: Windup Core can actually only treat all dirs as exploded or not - there is only a global option for that.
     *       That makes this a per-execution option. See WindupExecutionTask for what's the workaround.
     */
    public void setExploded(boolean exploded)
    {
        this.exploded = exploded;
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
        else
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
     * @return the fileSize the real size of registered application file
     */
    public long getFileSize()
    {
        return fileSize;
    }

    /**
     * @param fileSize the real size of registered application file
     */
    public void setFileSize(long fileSize)
    {
        this.fileSize = fileSize;
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

    /**
     * Gets migration project
     */
    @JsonIgnore
    public MigrationProject getMigrationProject()
    {
        return migrationProject;
    }

    /**
     * Sets migration project
     */
    public void setMigrationProject(MigrationProject migrationProject)
    {
        this.migrationProject = migrationProject;
    }

    /**
     * Gets created date
     */
    public Calendar getCreated()
    {
        return created;
    }

    /**
     * Gets last modified date
     */
    public Calendar getLastModified()
    {
        return lastModified;
    }

    /**
     * Checks if application is deleted
     */
    public boolean isDeleted()
    {
        return isDeleted;
    }

    /**
     * Sets application deleted status
     */
    public void setDeleted(boolean deleted) {
        if (deleted)
            this.setInputPath(FileExistsConstraint.DELETED_FILEPATH);
        isDeleted = deleted;
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
