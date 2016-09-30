package org.jboss.windup.web.services.model;

import org.hibernate.annotations.Fetch;
import org.hibernate.annotations.FetchMode;

import java.io.Serializable;
import java.util.Collection;
import java.util.Collections;
import java.util.Set;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.ElementCollection;
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
import javax.validation.Valid;

/**
 * Contains information about how Windup analysis should be configured. For example, this might include the package list to scan or the target
 * platform.
 *
 * @author <a href="mailto:jesse.sightler@gmail.com">Jesse Sightler</a>
 */
@Entity
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

    @ElementCollection(fetch = FetchType.EAGER)
    private Set<String> packages;

    @ElementCollection(fetch = FetchType.EAGER)
    private Set<String> excludePackages;

    @ManyToOne(fetch = FetchType.EAGER)
    private MigrationPath migrationPath;

    @OneToMany(fetch = FetchType.EAGER, cascade = CascadeType.ALL)
    @Fetch(FetchMode.SELECT)
    private Collection<AdvancedOption> advancedOptions;

    @OneToOne
    private ApplicationGroup applicationGroup;

    @Valid
    @ManyToMany(fetch = FetchType.EAGER, cascade = CascadeType.ALL)
    private Set<RulesPath> rulesPaths;

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
    public Set<String> getPackages()
    {
        return packages;
    }

    /**
     * Contains the package prefixes to analyze.
     */
    public void setPackages(Set<String> packages)
    {
        this.packages = packages;
    }

    /**
     * Contains the package prefixes to skip.
     */
    public Set<String> getExcludePackages()
    {
        return excludePackages;
    }

    /**
     * Contains the package prefixes to skip.
     */
    public void setExcludePackages(Set<String> excludePackages)
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
    public ApplicationGroup getApplicationGroup()
    {
        return applicationGroup;
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
