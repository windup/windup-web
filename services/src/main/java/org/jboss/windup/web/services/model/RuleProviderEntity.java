package org.jboss.windup.web.services.model;

import java.io.Serializable;
import java.util.Calendar;
import java.util.List;
import java.util.Set;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.JoinTable;
import javax.persistence.ManyToMany;
import javax.persistence.NamedQueries;
import javax.persistence.NamedQuery;
import javax.persistence.OneToMany;
import javax.persistence.OrderColumn;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;
import javax.persistence.Version;

import org.jboss.windup.config.RuleProvider;

import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;

/**
 * Contains data about {@link RuleProvider} found by the Windup engine.
 *
 * @author <a href="mailto:jesse.sightler@gmail.com">Jesse Sightler</a>
 */
@Entity
@JsonIdentityInfo(generator = ObjectIdGenerators.PropertyGenerator.class, property = "id", scope = RuleProviderEntity.class)
@NamedQueries({
            @NamedQuery(name = RuleProviderEntity.FIND_ALL, query = "select rpe from RuleProviderEntity rpe"),
            @NamedQuery(name = RuleProviderEntity.DELETE_ALL, query = "delete from RuleProviderEntity")
})
public class RuleProviderEntity implements Serializable
{
    public static final String FIND_ALL = "RuleProviderEntity.findAll";
    public static final String DELETE_ALL = "RuleProviderEntity.deleteAll";

    public static final String RULE_PROVIDER_ENTITY_ID = "rule_provider_entity_id";

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = RULE_PROVIDER_ENTITY_ID, updatable = false, nullable = false)
    private Long id;

    @Version
    @Column(name = "version")
    private int version;

    @Column(name = "provider_id")
    private String providerID;

    @Column(name = "origin", length = 2048)
    private String origin;

    @Column(name = "description", length = 8192)
    private String description;

    @Column(name = "phase")
    private String phase;

    @Column(name = "date_loaded")
    @Temporal(TemporalType.TIMESTAMP)
    private Calendar dateLoaded;

    @Column(name = "date_modified")
    @Temporal(TemporalType.TIMESTAMP)
    private Calendar dateModified;

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(
            name = "ruleproviderentity_technology_source",
            joinColumns = @JoinColumn(name = RULE_PROVIDER_ENTITY_ID, referencedColumnName = RULE_PROVIDER_ENTITY_ID),
            inverseJoinColumns = @JoinColumn(name = Technology.TECHNOLOGY_ID, referencedColumnName = Technology.TECHNOLOGY_ID)
    )
    private Set<Technology> sources;

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(
            name = "ruleproviderentity_technology_target",
            joinColumns = @JoinColumn(name = RULE_PROVIDER_ENTITY_ID, referencedColumnName = RULE_PROVIDER_ENTITY_ID),
            inverseJoinColumns = @JoinColumn(name = Technology.TECHNOLOGY_ID, referencedColumnName = Technology.TECHNOLOGY_ID)
    )
    private Set<Technology> targets;

    @OneToMany(cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    @OrderColumn(name = RuleEntity.RULE_SEQUENCE)
    private List<RuleEntity> rules;

    /**
     * Contains the primary key.
     */
    public Long getId()
    {
        return id;
    }

    /**
     * Contains the primary key.
     */
    public void setId(Long id)
    {
        this.id = id;
    }

    /**
     * Contains a version field used for conflict resolution.
     */
    public int getVersion()
    {
        return version;
    }

    /**
     * Contains a version field used for conflict resolution.
     */
    public void setVersion(int version)
    {
        this.version = version;
    }

    /**
     * Contains the ID from the Rule Provider. This should be unique across all rule providers.
     */
    public String getProviderID()
    {
        return providerID;
    }

    /**
     * Contains the ID from the Rule Provider. This should be unique across all rule providers.
     */
    public void setProviderID(String providerID)
    {
        this.providerID = providerID;
    }

    /**
     * Contains the origin of the Rule Provider. For an XML File, this will be a full path to the file.
     */
    public String getOrigin()
    {
        return origin;
    }

    /**
     * Contains the origin of the Rule Provider. For an XML File, this will be a full path to the file.
     */
    public void setOrigin(String origin)
    {
        this.origin = origin;
    }

    /**
     * Contains a human readable description of this rule provider.
     */
    public String getDescription()
    {
        return description;
    }

    /**
     * Contains a human readable description of this rule provider.
     */
    public void setDescription(String description)
    {
        this.description = description;
    }

    /**
     * Contains the phase during which this rule will execute.
     */
    public String getPhase()
    {
        return phase;
    }

    /**
     * Contains the phase during which this rule will execute.
     */
    public void setPhase(String phase)
    {
        this.phase = phase;
    }

    /**
     * Contains the time that this rule's metadata was loaded into the windup-web database.
     */
    public Calendar getDateLoaded()
    {
        return dateLoaded;
    }

    /**
     * Contains the time that this rule's metadata was loaded into the windup-web database.
     */
    public void setDateLoaded(Calendar dateLoaded)
    {
        this.dateLoaded = dateLoaded;
    }

    /**
     * Contains the time that this rule's metadata was last modified on disk. This may be null if no modification date
     * could be determined.
     */
    public Calendar getDateModified()
    {
        return dateModified;
    }

    /**
     * Contains the time that this rule's metadata was last modified on disk. This may be null if no modification date
     * could be determined.
     */
    public void setDateModified(Calendar dateModified)
    {
        this.dateModified = dateModified;
    }

    /**
     * Contains the source technologies for this provider.
     */
    public Set<Technology> getSources()
    {
        return sources;
    }

    /**
     * Contains the source technologies for this provider.
     */
    public void setSources(Set<Technology> sources)
    {
        this.sources = sources;
    }

    /**
     * Contains the target technologies for this provider.
     */
    public Set<Technology> getTargets()
    {
        return targets;
    }

    /**
     * Contains the source technologies for this provider.
     */
    public void setTargets(Set<Technology> targets)
    {
        this.targets = targets;
    }

    /**
     * Contains the list of rules that were loaded by this provider.
     */
    public List<RuleEntity> getRules()
    {
        return rules;
    }

    /**
     * Contains the list of rules that were loaded by this provider.
     */
    public void setRules(List<RuleEntity> rules)
    {
        this.rules = rules;
    }
}
