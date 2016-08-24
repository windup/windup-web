package org.jboss.windup.web.services.model;

import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;

import java.io.Serializable;
import java.util.Collection;
import java.util.Set;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.OneToOne;
import javax.persistence.Version;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

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

    @Column
    private boolean readOnly;

    @Column(length = 256)
    @Size(min = 1, max = 256)
    @NotNull
    private String title;

    @Column(length = 2048)
    @Size(min = 1, max = 2048)
    private String outputPath;

    @ManyToOne(fetch = FetchType.EAGER)
    private MigrationProject migrationProject;

    @OneToOne(mappedBy = "applicationGroup")
    private AnalysisContext analysisContext;

    @OneToMany(fetch = FetchType.EAGER)
    private Set<RegisteredApplication> applications;

    @OneToMany(fetch = FetchType.EAGER, mappedBy = "group")
    private Collection<WindupExecution> executions;

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
     * Indicates whether or not the client should consider the properties associated with this group to be "readonly".
     *
     * This would be used with system generated groups to indicate that the name should be a constant.
     */
    public boolean isReadOnly()
    {
        return readOnly;
    }

    /**
     * Indicates whether or not the client should consider the properties associated with this group to be "readonly".
     *
     * This would be used with system generated groups to indicate that the name should be a constant.
     */
    public void setReadOnly(boolean readOnly)
    {
        this.readOnly = readOnly;
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
     * Contains a collection of {@link WindupExecution}s.
     */
    public Collection<WindupExecution> getExecutions()
    {
        return executions;
    }

    /**
     * Contains a collection of {@link WindupExecution}s.
     */
    public void setExecutions(Collection<WindupExecution> executions)
    {
        this.executions = executions;
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
