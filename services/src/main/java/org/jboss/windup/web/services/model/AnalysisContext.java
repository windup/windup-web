package org.jboss.windup.web.services.model;

import java.io.Serializable;
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
import javax.persistence.OneToMany;
import javax.persistence.Version;
import javax.validation.Valid;

import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;
import javax.ws.rs.DefaultValue;
import org.hibernate.annotations.ColumnDefault;
import org.hibernate.annotations.Fetch;
import org.hibernate.annotations.FetchMode;

/**
 * Contains information about how Windup analysis should be configured.
 * For example, this might include the package list to scan or the target platform.
 *
 * @author <a href="mailto:jesse.sightler@gmail.com">Jesse Sightler</a>
 */
@Entity
@JsonIgnoreProperties(ignoreUnknown = true)
@JsonIdentityInfo(generator = ObjectIdGenerators.PropertyGenerator.class, property = "id", scope = AnalysisContext.class)
public class AnalysisContext implements Serializable
{
    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "id", updatable = false, nullable = false)
    private Long id;

    @Version
    @Column(name = "version")
    private int version;

    @Column(nullable = false)
    @ColumnDefault("true")
    private boolean generateStaticReports = true;

    @ManyToOne(fetch = FetchType.EAGER)
    private MigrationPath migrationPath;

    @OneToMany(fetch = FetchType.EAGER, cascade = CascadeType.ALL)
    @Fetch(FetchMode.SELECT)
    private Collection<AdvancedOption> advancedOptions;

    @Valid
    @ManyToMany(fetch = FetchType.EAGER)
    private Set<RulesPath> rulesPaths;

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

    protected AnalysisContext()
    {
        this.includePackages = new HashSet<>();
        this.excludePackages = new HashSet<>();
        this.applications = new HashSet<>();
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
