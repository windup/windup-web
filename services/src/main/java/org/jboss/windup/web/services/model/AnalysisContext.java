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
import javax.persistence.OneToOne;
import javax.persistence.Version;
import javax.validation.Valid;

import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;
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

    @ManyToOne(fetch = FetchType.EAGER)
    private MigrationPath migrationPath;

    @OneToMany(fetch = FetchType.EAGER, cascade = CascadeType.ALL)
    @Fetch(FetchMode.SELECT)
    private Collection<AdvancedOption> advancedOptions;

    //@JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    @OneToOne(optional = false)
    private ApplicationGroup applicationGroup;

    @Valid
    @ManyToMany(fetch = FetchType.EAGER)
    private Set<RulesPath> rulesPaths;

    @ManyToMany(fetch = FetchType.EAGER, cascade = CascadeType.ALL)
    @JoinTable(name = "analysis_context_include_packages")
    private Set<Package> includePackages;

    @ManyToMany(fetch = FetchType.EAGER, cascade = CascadeType.ALL)
    @JoinTable(name = "analysis_context_exclude_packages")
    private Set<Package> excludePackages;

    protected AnalysisContext()
    {
        this.includePackages = new HashSet<>();
        this.excludePackages = new HashSet<>();
    }

    public AnalysisContext(ApplicationGroup applicationGroup)
    {
        this();
        this.applicationGroup = applicationGroup;
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
     * Contains the group being analyzed.
     */
    @JsonIgnore
    public ApplicationGroup getApplicationGroup()
    {
        return applicationGroup;
    }

    @JsonProperty
    public Long getApplicationGroupId()
    {
        if (this.applicationGroup == null)
        {
            // This should not happen, since ApplicationGroup is parent of AnalysisContext
            return null;
        }

        return this.applicationGroup.getId();
    }

    /**
     * Contains the group being analyzed.
     */
    public void setApplicationGroup(ApplicationGroup applicationGroup)
    {
        this.applicationGroup = applicationGroup;
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
