package org.jboss.windup.web.services.model;

import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.ManyToMany;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.OneToOne;
import javax.persistence.Version;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

import org.hibernate.annotations.Fetch;
import org.hibernate.annotations.FetchMode;

import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;

/**
 * An {@link ApplicationGroup} represents a set of applications within a particular {@link MigrationProject}. Each group may have its own analysis
 * configuration and may be executed independently.
 *
 * @author <a href="mailto:jesse.sightler@gmail.com">Jesse Sightler</a>
 */
@Entity
@JsonIdentityInfo(generator = ObjectIdGenerators.PropertyGenerator.class, property = "id", scope = ApplicationGroup.class)
public class ApplicationGroup implements Serializable
{
    private static final long serialVersionUID = 1L;

    public static final String APPLICATION_GROUP_ID = "application_group_id";

    public static final String DEFAULT_NAME = "Default Group";

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = APPLICATION_GROUP_ID, updatable = false, nullable = false)
    private Long id;

    @Version
    @Column(name = "version")
    private int version;

    @Column(length = 256)
    @Size(min = 1, max = 256)
    @NotNull
    private String title;

    @Column(length = 2048)
    @Size(min = 1, max = 2048)
    private String outputPath;

    @Column
    private boolean isDefault;

    @ManyToOne(fetch = FetchType.EAGER, optional = false)
    private MigrationProject migrationProject;

    @OneToOne(mappedBy = "applicationGroup", cascade = {CascadeType.PERSIST, CascadeType.REMOVE})
    @Fetch(FetchMode.SELECT)
    private AnalysisContext analysisContext;

    @ManyToMany(fetch = FetchType.EAGER)
    @Fetch(FetchMode.SELECT)
    private Set<RegisteredApplication> applications;

    @OneToMany(fetch = FetchType.EAGER, mappedBy = "group", cascade = CascadeType.REMOVE)
    @Fetch(FetchMode.SELECT)
    private Set<WindupExecution> executions;

    @ManyToOne(cascade = {CascadeType.PERSIST, CascadeType.REMOVE}, fetch = FetchType.LAZY)
    private PackageMetadata packageMetadata;

    @OneToOne(cascade = {CascadeType.PERSIST, CascadeType.REMOVE}, mappedBy = "applicationGroup")
    private ReportFilter reportFilter;

    public ApplicationGroup()
    {
        this.applications = new HashSet<>();
        this.executions = new HashSet<>();
        this.reportFilter = new ReportFilter(this);
    }

    public ApplicationGroup(MigrationProject project)
    {
        this();
        this.migrationProject = project;
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
     * Contains the title for the current group.
     */
    public String getTitle()
    {
        return title;
    }

    /**
     * Contains the title for the current group.
     */
    public void setTitle(String title)
    {
        this.title = title;
    }

    /**
     * Contains the directory in which Windup will generate graph data and reports.
     */
    public String getOutputPath()
    {
        return outputPath;
    }

    /**
     * Contains the directory in which Windup will generate graph data and reports.
     */
    public void setOutputPath(String outputPath)
    {
        this.outputPath = outputPath;
    }

    /**
     * Contains the {@link MigrationProject} associated with this group.
     */
    public MigrationProject getMigrationProject()
    {
        return migrationProject;
    }

    /**
     * Contains the {@link MigrationProject} associated with this group.
     */
    public void setMigrationProject(MigrationProject migrationProject)
    {
        this.migrationProject = migrationProject;
    }

    /**
     * Contains the analysis configuration for this group.
     */
    public AnalysisContext getAnalysisContext()
    {
        return analysisContext;
    }

    /**
     * Contains the analysis configuration for this group.
     */
    public void setAnalysisContext(AnalysisContext analysisContext)
    {
        this.analysisContext = analysisContext;
    }

    /**
     * Contains the applications associated with this group.
     */
    public Set<RegisteredApplication> getApplications()
    {
        return applications;
    }

    /**
     * Contains the applications associated with this group.
     */
    public void setApplications(Set<RegisteredApplication> applications)
    {
        this.applications = applications;
    }

    /**
     * Adds application to application group
     *
     * @param application Application
     */
    public void addApplication(RegisteredApplication application)
    {
        if (this.getApplications().contains(application))
        {
            throw new RuntimeException("Application already in this group");
        }

        this.getApplications().add(application);
        application.addApplicationGroup(this);
    }

    /**
     * Removes application from application group
     *
     * @param application Application
     */
    public void removeApplication(RegisteredApplication application)
    {
        if (!this.getApplications().contains(application))
        {
            throw new RuntimeException("Application not found");
        }

        this.getApplications().remove(application);
        application.removeApplicationGroup(this);
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
     * @param packageMetadata Package metadata
     */
    public void setPackageMetadata(PackageMetadata packageMetadata)
    {
        this.packageMetadata = packageMetadata;
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

    public ReportFilter getReportFilter()
    {
        return reportFilter;
    }

    public void setReportFilter(ReportFilter reportFilter)
    {
        this.reportFilter = reportFilter;
    }

    /**
     * Is this group default group?
     *
     * Default group contains all applications from project
     */
    public boolean isDefault()
    {
        return isDefault;
    }

    /**
     * Marks group as default group
     *
     */
    public void setDefault(boolean aDefault)
    {
        isDefault = aDefault;
    }

    @Override
    public boolean equals(Object o)
    {
        if (this == o)
            return true;
        if (!(o instanceof ApplicationGroup))
            return false;

        ApplicationGroup that = (ApplicationGroup) o;

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
