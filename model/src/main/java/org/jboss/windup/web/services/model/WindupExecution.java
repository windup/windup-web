package org.jboss.windup.web.services.model;

import java.io.Serializable;
import java.nio.file.Paths;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Set;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.OneToOne;
import javax.persistence.SequenceGenerator;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;
import javax.persistence.Version;

import org.hibernate.annotations.Fetch;
import org.hibernate.annotations.FetchMode;

import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;

/**
 * Contains the current execution status for a Windup run.
 *
 * @author <a href="mailto:jesse.sightler@gmail.com">Jesse Sightler</a>
 */
@Entity
@JsonIgnoreProperties(ignoreUnknown = true)
@JsonIdentityInfo(generator = ObjectIdGenerators.PropertyGenerator.class, property = "id", scope = WindupExecution.class)
public class WindupExecution implements Serializable
{
    private static final long serialVersionUID = 1L;

    public static final String WINDUP_EXECUTION_ID = "windup_execution_id";

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO, generator = "execution_sequence")
    @SequenceGenerator(name = "execution_sequence", sequenceName = "windup_execution", initialValue = 1, allocationSize = 1)
    @Column(name = WINDUP_EXECUTION_ID, updatable = false, nullable = false)
    private Long id;

    @Version
    @Column(name = "version")
    private int version;

    @ManyToOne(optional = false)
    @JsonIgnore
    private MigrationProject project;

    @Column(name = "time_queued")
    @Temporal(TemporalType.TIMESTAMP)
    private Calendar timeQueued;

    @Column(name = "time_started")
    @Temporal(TemporalType.TIMESTAMP)
    private Calendar timeStarted;

    @Column(name = "time_completed")
    @Temporal(TemporalType.TIMESTAMP)
    private Calendar timeCompleted;

    @Column(name = "output_path")
    private String outputPath;

    @Column(name = "total_work")
    private int totalWork;

    @Column(name = "work_completed")
    private int workCompleted;

    @Column(name = "current_task", length = 1024)
    private String currentTask;

    @Column(name = "last_modified")
    @Temporal(TemporalType.TIMESTAMP)
    private Calendar lastModified;

    @Column(name = "status")
    private ExecutionState state;

    @OneToMany(fetch = FetchType.EAGER)
    @Fetch(FetchMode.SELECT)
    private Set<FilterApplication> filterApplications;

    @OneToOne
    private AnalysisContext analysisContext;

    @OneToOne(mappedBy = "windupExecution", cascade = {CascadeType.PERSIST, CascadeType.REMOVE})
    private ReportFilter reportFilter;

    public WindupExecution()
    {
        this.reportFilter = new ReportFilter(this);
    }

    public WindupExecution(AnalysisContext context)
    {
        this();
        this.analysisContext = context;
        this.project = context.getMigrationProject();
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
     * Contains the project owning this execution
     */
    public MigrationProject getProject()
    {
        return project;
    }


    /**
     * Sets the project owning this
     */
    public void setProject(MigrationProject project)
    {
        this.project = project;
    }

    /**
     * Contains the path to the output directory for windup (containing the reports and graph data).
     */
    public String getOutputPath()
    {
        return outputPath;
    }

    /**
     * Contains the path to the output directory for windup (containing the reports and graph data).
     */
    public void setOutputPath(String outputPath)
    {
        this.outputPath = outputPath;
    }

    /**
     * Gets the directory name of the output as computed from the full path.
     */
    public String getOutputDirectoryName()
    {
        if (getOutputPath() == null)
            return null;

        return Paths.get(getOutputPath()).getFileName().toString();
    }

    /**
     * This should never be called directory (it is only here to aid in Jackson serialization).
     */
    public void setOutputDirectoryName(String dirName)
    {
        // noop
    }

    /**
     * Gets the relative path to the application list in a format suitable for a URL.
     */
    public String getApplicationListRelativePath()
    {
        String directoryName = getOutputDirectoryName();
        if (directoryName == null)
            return null;

        return directoryName + "/index.html";
    }

    /**
     * This should never be called directory (it is only here to aid in Jackson serialization).
     */
    public void setApplicationListRelativePath(String path)
    {
        // nooop
    }

    /**
     * Gets the relative path to the rule providers report in a format suitable for a URL.
     */
    public String getRuleProvidersExecutionOverviewRelativePath()
    {
        String directoryName = getOutputDirectoryName();
        if (directoryName == null)
            return null;

        return directoryName + "/reports/windup_ruleproviders.html";
    }

    /**
     * This should never be called directory (it is only here to aid in Jackson serialization).
     */
    public void setRuleProvidersExecutionOverviewRelativePath(String path)
    {
        // nooop
    }

    /**
     * Contains the time at which this analysis was put into the analysis queue.
     */
    public Calendar getTimeQueued()
    {
        return timeQueued;
    }

    /**
     * Contains the time at which this analysis was put into the analysis queue.
     */
    public void setTimeQueued(Calendar timeQueued)
    {
        this.timeQueued = timeQueued;
    }

    /**
     * Contains the time that this execution run was started.
     */
    public Calendar getTimeStarted()
    {
        return timeStarted;
    }

    /**
     * Contains the time that this execution run was started.
     */
    public void setTimeStarted(Calendar timeStarted)
    {
        this.timeStarted = timeStarted;
    }

    /**
     * Contains the time that this execution run was completed.
     */
    public Calendar getTimeCompleted()
    {
        return timeCompleted;
    }

    /**
     * Contains the time that this execution run was completed.
     */
    public void setTimeCompleted(Calendar timeCompleted)
    {
        this.timeCompleted = timeCompleted;
    }

    /**
     * Contains the total number of units of work that must be executed.
     */
    public int getTotalWork()
    {
        return totalWork;
    }

    /**
     * Contains the total number of units of work that must be executed.
     */
    public void setTotalWork(int totalWork)
    {
        this.totalWork = totalWork;
    }

    /**
     * Contains the number of units of work that have been executed.
     */
    public int getWorkCompleted()
    {
        return workCompleted;
    }

    /**
     * Contains the number of units of work that have been executed.
     */
    public void setWorkCompleted(int workCompleted)
    {
        this.workCompleted = workCompleted;
    }

    /**
     * Contains the name of the current task being executed.
     */
    public String getCurrentTask()
    {
        return currentTask;
    }

    /**
     * Contains the name of the current task being executed.
     */
    public void setCurrentTask(String currentTask)
    {
        this.currentTask = currentTask;
    }

    /**
     * Contains the last date that this entry was modified.
     */
    public Calendar getLastModified()
    {
        return lastModified;
    }

    /**
     * Contains the last date that this entry was modified.
     */
    public void setLastModified(Calendar lastUpdate)
    {
        this.lastModified = lastUpdate;
    }

    /**
     * Contains the status of execution (currently being executed or completed, etc).
     */
    public ExecutionState getState()
    {
        return state;
    }

    /**
     * Contains the status of execution (currently being executed or completed, etc).
     */
    public void setState(ExecutionState status)
    {
        this.state = status;
    }

    /**
     * Sets configuration for this execution
     */
    public void setAnalysisContext(AnalysisContext analysisContext)
    {
        this.analysisContext = analysisContext;
    }

    /**
     * Contains the configuration to use for this execution.
     */
    public AnalysisContext getAnalysisContext()
    {
        return this.analysisContext;
    }


    /**
     * Adds application for filter
     */
    public void addFilterApplication(FilterApplication filterApplication)
    {
        this.filterApplications.add(filterApplication);
    }

    /**
     * Contain all applications available for filter
     */
    public Set<FilterApplication> getFilterApplications()
    {
        return filterApplications;
    }

    /**
     * Sets applications for filter
     */
    public void setFilterApplications(Set<FilterApplication> filterApplications)
    {
        this.filterApplications = filterApplications;
    }

    @JsonProperty
    public long getProjectId()
    {
        if (this.project == null)
            return 0;

        return this.project.getId();
    }

    /**
     * Gets ReportFilter
     */
    public ReportFilter getReportFilter()
    {
        return reportFilter;
    }

    @Override
    public String toString()
    {
        return "WindupExecution{" +
                "outputPath='" + outputPath + '\'' +
                ", totalWork=" + totalWork +
                ", workCompleted=" + workCompleted +
                ", currentTask='" + currentTask + '\'' +
                ", lastModified=" + formatCalendar(lastModified) +
                ", state=" + state +
                ", version=" + version +
                ", timeCompleted=" + formatCalendar(timeCompleted) +
                ", timeStarted=" + formatCalendar(timeStarted) +
                '}';
    }

    private static final DateFormat FORMATTER = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
    private String formatCalendar(Calendar cal)
    {
        if (cal == null)
            return "null";
        FORMATTER.setTimeZone(cal.getTimeZone());
        return FORMATTER.format(cal.getTime());
    }

    @Override
    public boolean equals(Object o)
    {
        if (this == o)
            return true;

        if (o == null || getClass() != o.getClass())
            return false;

        WindupExecution that = (WindupExecution) o;

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
