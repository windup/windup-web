package org.jboss.windup.web.services.model;

import java.io.Serializable;
import java.util.List;
import java.util.Set;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.OneToMany;
import javax.persistence.Version;
import javax.validation.Valid;

/**
 * Contains the configuration for the Windup server.
 *
 * @author <a href="mailto:jesse.sightler@gmail.com">Jesse Sightler</a>
 */
@Entity
public class Configuration implements Serializable
{
    private static final long serialVersionUID = 1L;

    public static final String CONFIGURATION_ID = "configuration_id";

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = CONFIGURATION_ID, updatable = false, nullable = false)
    private Long id;

    @Version
    @Column(name = "version")
    private int version;

    @Valid
    @OneToMany(fetch = FetchType.EAGER, cascade = CascadeType.ALL)
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
}
