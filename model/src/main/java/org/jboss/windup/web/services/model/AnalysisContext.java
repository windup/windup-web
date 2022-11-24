package org.jboss.windup.web.services.model;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.Collection;
import java.util.HashSet;
import java.util.Set;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinTable;
import javax.persistence.ManyToMany;
import javax.persistence.ManyToOne;
import javax.persistence.NamedQuery;
import javax.persistence.OneToMany;
import javax.persistence.Version;
import javax.persistence.OneToOne;
import javax.persistence.NamedQueries;

import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;
import org.hibernate.annotations.ColumnDefault;
import org.hibernate.annotations.Fetch;
import org.hibernate.annotations.FetchMode;
import org.hibernate.annotations.Type;

/**
 * Contains information about how Windup analysis should be configured.
 * For example, this might include the package list to scan or the target platform.
 *
 * @author <a href="mailto:jesse.sightler@gmail.com">Jesse Sightler</a>
 */
@Entity
@JsonIgnoreProperties(ignoreUnknown = true)
@JsonIdentityInfo(generator = ObjectIdGenerators.PropertyGenerator.class, property = "id", scope = AnalysisContext.class)
@NamedQueries({
        @NamedQuery(name = AnalysisContext.FIND_ALL, query = "select ac from AnalysisContext ac"),
        @NamedQuery(name = AnalysisContext.FIND_ALL_WHERE_EXECUTION_IS_NULL, query = "select a from AnalysisContext a left join a.windupExecution e where e is null"),
        @NamedQuery(name = AnalysisContext.FIND_BY_RULE_PATH_ID_AND_EXECUTION_IS_NULL, query = "select a from AnalysisContext a inner join a.rulesPaths r left join a.windupExecution e where r.id = :rulePathId and e is null"),
        @NamedQuery(name = AnalysisContext.FIND_BY_LABEL_PATH_ID_AND_EXECUTION_IS_NULL, query = "select a from AnalysisContext a inner join a.labelsPaths r left join a.windupExecution e where r.id = :labelPathId and e is null")
})
public class AnalysisContext implements Serializable
{
    private static final long serialVersionUID = 1L;

    public static final String FIND_ALL = "AnalysisContext.findAll";
    public static final String FIND_ALL_WHERE_EXECUTION_IS_NULL = "AnalysisContext.findAllWhereExecutionIsNull";
    public static final String FIND_BY_RULE_PATH_ID_AND_EXECUTION_IS_NULL = "AnalysisContext.findByRulePathAndExecutionIsNull";
    public static final String FIND_BY_LABEL_PATH_ID_AND_EXECUTION_IS_NULL = "AnalysisContext.findByLabelPathAndExecutionIsNull";

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "id", updatable = false, nullable = false)
    private Long id;

    @Version
    @Column(name = "version")
    private int version;

    @Column(nullable = false)
    @ColumnDefault("true")
    @Type(type= "yes_no")
    private boolean generateStaticReports = true;

    /*
     * @TODO temporary added for obey single target selection in migration path
     */
    @Column(name = "cloudtargets")
    @Type(type= "yes_no")
    private boolean cloudTargetsIncluded;

    @Column(name = "linuxtargets")
    @Type(type= "yes_no")
    private boolean linuxTargetsIncluded;

    @Column(name = "openjdktargets")
    @Type(type= "yes_no")
    private boolean openJdkTargetsIncluded;

    @JsonIgnore
    @OneToOne(mappedBy = "analysisContext", fetch = FetchType.LAZY, optional = false)
    private WindupExecution windupExecution;

    @ManyToOne(fetch = FetchType.EAGER)
    private MigrationPath migrationPath;

    @OneToMany(fetch = FetchType.EAGER, cascade = CascadeType.ALL)
    @Fetch(FetchMode.SELECT)
    private Collection<AdvancedOption> advancedOptions;

    @ManyToMany(fetch = FetchType.EAGER)
    private Set<RulesPath> rulesPaths;

    @ManyToMany(fetch = FetchType.EAGER)
    private Set<LabelsPath> labelsPaths;

    @ManyToMany(fetch = FetchType.EAGER, cascade = CascadeType.ALL)
    @JoinTable(name = "analysis_context_include_packages")
    private Set<Package> includePackages;

    @ManyToMany(fetch = FetchType.EAGER, cascade = CascadeType.ALL)
    @JoinTable(name = "analysis_context_exclude_packages")
    private Set<Package> excludePackages;

    @ManyToMany(fetch = FetchType.EAGER)
    @Fetch(FetchMode.SELECT)
    private Set<RegisteredApplication> applications;

    @ManyToOne(fetch = FetchType.EAGER, optional = false)
    private MigrationProject migrationProject;

    public AnalysisContext()
    {
        this.includePackages = new HashSet<>();
        this.excludePackages = new HashSet<>();
        this.applications = new HashSet<>();
        this.advancedOptions = new ArrayList<>();
        this.rulesPaths = new HashSet<>();
        this.labelsPaths = new HashSet<>();
    }

    public AnalysisContext(MigrationProject project)
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

    public boolean isCloudTargetsIncluded()
    {
        return cloudTargetsIncluded;
    }

    public void setCloudTargetsIncluded(boolean cloudTargetsIncluded)
    {
        this.cloudTargetsIncluded = cloudTargetsIncluded;
    }

    public boolean isLinuxTargetsIncluded()
    {
        return linuxTargetsIncluded;
    }

    public void setLinuxTargetsIncluded(boolean linuxTargetsIncluded)
    {
        this.linuxTargetsIncluded = linuxTargetsIncluded;
    }

    public boolean isOpenJdkTargetsIncluded()
    {
        return openJdkTargetsIncluded;
    }

    public void setOpenJdkTargetsIncluded(boolean openJdkTargetsIncluded)
    {
        this.openJdkTargetsIncluded = openJdkTargetsIncluded;
    }


    public WindupExecution getWindupExecution() {
        return windupExecution;
    }

    public void setWindupExecution(WindupExecution windupExecution) {
        this.windupExecution = windupExecution;
    }

    /**
     * Should Windup generate HTML reports?
     */
    public boolean getGenerateStaticReports()
    {
        return generateStaticReports;
    }

    /**
     * Should Windup generate HTML reports?
     */
    public void setGenerateStaticReports(boolean generateStaticReports)
    {
        this.generateStaticReports = generateStaticReports;
    }


    /**
     * Contains the package prefixes to analyze.
     */
    public Set<Package> getIncludePackages()
    {
        return includePackages;
    }

    /**
     * Contains the package prefixes to analyze.
     */
    public void setIncludePackages(Set<Package> packages)
    {
        this.includePackages = packages;
    }

    /**
     * Contains the package prefixes to skip.
     */
    public Set<Package> getExcludePackages()
    {
        return excludePackages;
    }

    /**
     * Contains the package prefixes to skip.
     */
    public void setExcludePackages(Set<Package> excludePackages)
    {
        this.excludePackages = excludePackages;
    }

    /**
     * Contains the path for this migration (source/target).
     */
    public MigrationPath getMigrationPath()
    {
        return migrationPath;
    }

    /**
     * Contains the path for this migration (source/target).
     */
    public void setMigrationPath(MigrationPath migrationPath)
    {
        this.migrationPath = migrationPath;
    }

    /**
     * Contains the {@link MigrationProject} associated with this group.
     */
    @JsonIgnore
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
     * Contains the rules paths to be analyzed.
     */
    public Set<RulesPath> getRulesPaths()
    {
        return rulesPaths;
    }

    /**
     * Contains the rules paths to be analyzed.
     */
    public void setRulesPaths(Set<RulesPath> rulesPaths)
    {
        this.rulesPaths = rulesPaths;
    }

    public Set<LabelsPath> getLabelsPaths() {
        return labelsPaths;
    }

    public void setLabelsPaths(Set<LabelsPath> labelsPaths) {
        this.labelsPaths = labelsPaths;
    }

    /**
     * Contains advanced configuration options (eg, csv export).
     */
    public Collection<AdvancedOption> getAdvancedOptions()
    {
        return advancedOptions;
    }

    /**
     * Contains advanced configuration options (eg, csv export).
     */
    public void setAdvancedOptions(Collection<AdvancedOption> advancedOptions)
    {
        this.advancedOptions = advancedOptions;
    }

    /**
     * Add an advanced configuration options (eg, csv export).
     */
    public void addAdvancedOption(AdvancedOption advancedOption)
    {
        this.advancedOptions.add(advancedOption);
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
    }

    public AnalysisContext clone()
    {
        AnalysisContext clone = new AnalysisContext(this.migrationProject);

        clone.applications.addAll(this.getApplications());
        clone.generateStaticReports = this.generateStaticReports;
        clone.migrationPath = this.migrationPath;
        clone.advancedOptions.addAll(this.advancedOptions);
        clone.rulesPaths.addAll(this.rulesPaths);
        clone.labelsPaths.addAll(this.labelsPaths);
        clone.includePackages.addAll(this.includePackages);
        clone.excludePackages.addAll(this.excludePackages);
        // temporary added for adding cloud related targets in parallel to selected main target
        clone.cloudTargetsIncluded = this.cloudTargetsIncluded;
        clone.linuxTargetsIncluded = this.linuxTargetsIncluded;
        clone.openJdkTargetsIncluded = this.openJdkTargetsIncluded;

        return clone;
    }

    @Override
    public boolean equals(Object o)
    {
        if (this == o)
            return true;
        if (!(o instanceof AnalysisContext))
            return false;

        AnalysisContext that = (AnalysisContext) o;

        return id != null ? id.equals(that.id) : that.id == null;

    }

    @Override
    public int hashCode()
    {
        return id != null ? id.hashCode() : 0;
    }
}
