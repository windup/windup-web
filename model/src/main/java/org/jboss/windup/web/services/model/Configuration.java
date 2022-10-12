package org.jboss.windup.web.services.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import org.hibernate.annotations.Type;

import java.io.Serializable;
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
import javax.persistence.Version;
import javax.persistence.NamedQueries;
import javax.persistence.NamedQuery;
import javax.validation.Valid;

/**
 * Contains the configuration for the Windup server.
 *
 * @author <a href="mailto:jesse.sightler@gmail.com">Jesse Sightler</a>
 */
@Entity
@NamedQueries({
        @NamedQuery(name = Configuration.FIND_BY_RULE_PATH_ID, query = "select c from Configuration c inner join c.rulesPaths r where r.id = :rulePathId"),
        @NamedQuery(name = Configuration.FIND_BY_LABEL_PATH_ID, query = "select c from Configuration c inner join c.labelsPaths r where r.id = :labelPathId"),
        @NamedQuery(name = Configuration.FIND_GLOBAL, query = "select configuration from Configuration configuration where configuration.global = true"),
        @NamedQuery(name = Configuration.FIND_ALL, query = "select c from Configuration c")
})
public class Configuration implements Serializable
{
    private static final long serialVersionUID = 1L;

    public static final String FIND_BY_RULE_PATH_ID = "Configuration.findByRulePath";
    public static final String FIND_BY_LABEL_PATH_ID = "Configuration.findByLabelPath";
    public static final String FIND_GLOBAL = "Configuration.findGlobal";
    public static final String FIND_ALL = "Configuration.findAll";

    public static final String CONFIGURATION_ID = "configuration_id";

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = CONFIGURATION_ID, updatable = false, nullable = false)
    private Long id;

    @Column
    @Type(type= "org.hibernate.type.NumericBooleanType")
    private boolean global;

    @Version
    @Column(name = "version")
    private int version;

    @Valid
    @OneToMany(fetch = FetchType.EAGER, cascade = CascadeType.ALL)
    private Set<RulesPath> rulesPaths;

    @Valid
    @OneToMany(fetch = FetchType.EAGER, cascade = CascadeType.ALL)
    private Set<LabelsPath> labelsPaths;

    @OneToOne(mappedBy = "configuration", fetch = FetchType.LAZY)
    private MigrationProject migrationProject;

    public Long getId()
    {
        return id;
    }

    public void setId(Long id)
    {
        this.id = id;
    }

    public boolean isGlobal() {
        return global;
    }

    public void setGlobal(boolean global) {
        this.global = global;
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
     * Contains paths to user provided rules.
     */
    public Set<RulesPath> getRulesPaths()
    {
        return rulesPaths;
    }

    /**
     * Contains paths to user provided rules.
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

    @JsonIgnore
    public MigrationProject getMigrationProject() {
        return migrationProject;
    }

    @JsonIgnore
    public void setMigrationProject(MigrationProject migrationProject) {
        this.migrationProject = migrationProject;
    }
}
