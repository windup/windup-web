package org.jboss.windup.web.services.model;

import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;
import org.hibernate.annotations.ColumnDefault;
import org.hibernate.annotations.Fetch;
import org.hibernate.annotations.FetchMode;
import org.hibernate.annotations.Type;

import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import java.io.Serializable;
import java.util.Calendar;
import java.util.GregorianCalendar;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.OneToMany;
import javax.persistence.OneToOne;
import javax.persistence.PrePersist;
import javax.persistence.PreUpdate;
import javax.persistence.Table;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;
import javax.persistence.Version;
import javax.validation.constraints.Pattern;

/**
 * A migration project is a group of applications which are related to each other and migrated as a bigger enterprise system.
 *
 * @author <a href="http://ondra.zizka.cz/">Ondrej Zizka, zizka@seznam.cz</a>
 */
@Entity
@Table()
@JsonIdentityInfo(generator = ObjectIdGenerators.PropertyGenerator.class, property = "id", scope = MigrationProject.class)
@JsonIgnoreProperties(ignoreUnknown = true)
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

    /**
     * The project is being created in the wizard and should not be treated as a ready project.
     */
    @Column(nullable = true)
    @ColumnDefault("FALSE")
    @Type(type= "org.hibernate.type.NumericBooleanType")
    private boolean provisional = true;

    @Column(length = 120, unique = false, nullable = false)
    @Size(min = 3, max = 120, message = "The name must be at least 3 letters long.")
    @Pattern(message = "The name must contain only alphanumeric characters and spaces",
            regexp = "\\s*[- \\w]+\\s*") // Allow whitespace around, limit to A-Za-z0-9-, allow spaces inside, at least 3 characters after whitespace trimmed.
    @NotNull
    private String title;

    @Size(max = 4096)
    @NotNull
    @Column(length = 4096, nullable = false)
    private String description = "";

    @Column(columnDefinition = "TIMESTAMP DEFAULT CURRENT_TIMESTAMP", insertable = false, updatable = false)
    @Temporal(TemporalType.TIMESTAMP)
    private Calendar created;

    @Column(columnDefinition = "TIMESTAMP DEFAULT CURRENT_TIMESTAMP")
    @Temporal(TemporalType.TIMESTAMP)
    private Calendar lastModified;

    @OneToMany(fetch = FetchType.EAGER, mappedBy = "migrationProject", cascade = CascadeType.REMOVE)
    @Fetch(FetchMode.SELECT)
    private Set<RegisteredApplication> applications;

    @OneToMany(fetch = FetchType.EAGER, mappedBy = "project", cascade = CascadeType.REMOVE)
    @Fetch(FetchMode.SELECT)
    private Set<WindupExecution> executions;

    @OneToOne
    private AnalysisContext defaultAnalysisContext;

    @OneToOne(fetch = FetchType.LAZY)
    private Configuration configuration;

    public MigrationProject()
    {
        this.applications = new HashSet<>();
        this.executions = new HashSet<>();
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

    public boolean isProvisional()
    {
        return provisional;
    }

    public void setProvisional(boolean beingCreated)
    {
        this.provisional = beingCreated;
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

    public String getDescription()
    {
        return description;
    }

    public void setDescription(String description)
    {
        this.description = description;
    }

    /**
     * Contains creation date
     */
    public Calendar getCreated()
    {
        return created;
    }

    /**
     * Contains date of last modification
     */
    public Calendar getLastModified()
    {
        return lastModified;
    }

    /**
     * Sets date of last modification
     */
    public void setLastModified(Calendar lastModified)
    {
        this.lastModified = lastModified;
    }

    /**
     * Contains the {@link RegisteredApplication}s associated with this project
     */
    @JsonProperty
    public Set<RegisteredApplication> getApplications()
    {
        return applications;
    }

    @JsonIgnore
    public void setApplications(Set<RegisteredApplication> applications)
    {
        this.applications = applications;
    }

    /**
     * Adds the {@link RegisteredApplication} to this project
     */
    public void addApplication(RegisteredApplication application)
    {
        this.applications.add(application);
    }

    /**
     * Removes the {@link RegisteredApplication} from this project
     */
    public void removeApplication(RegisteredApplication application)
    {
        this.applications.remove(application);
    }

    /**
     * Contains a collection of {@link WindupExecution}s.
     */
    public Set<WindupExecution> getExecutions()
    {
        return executions;
    }

    /**
     * Contains a collection of {@link WindupExecution}s.
     */
    public void setExecutions(Set<WindupExecution> executions)
    {
        this.executions = executions;
    }

    /**
     * Adds execution
     */
    public void addExecution(WindupExecution execution)
    {
        this.executions.add(execution);
    }

    /**
     * Removes execution
     */
    public void removeExecution(WindupExecution execution)
    {
        this.executions.remove(execution);
    }

    /**
     * Gets default analysis context
     */
    @JsonIgnore
    public AnalysisContext getDefaultAnalysisContext()
    {
        return defaultAnalysisContext;
    }

    /**
     * Gets id of default analysis context
     */
    @JsonProperty
    public Long getDefaultAnalysisContextId()
    {
        Long id = null;

        if (this.defaultAnalysisContext != null) {
            id = this.defaultAnalysisContext.getId();
        }

        return id;
    }

    /**
     * Sets new default analysis context
     */
    @JsonIgnore
    public void setDefaultAnalysisContext(AnalysisContext defaultAnalysisContext)
    {
        this.defaultAnalysisContext = defaultAnalysisContext;
    }

    @JsonIgnore
    public Configuration getConfiguration() {
        return configuration;
    }

    @JsonIgnore
    public void setConfiguration(Configuration configuration) {
        this.configuration = configuration;
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
