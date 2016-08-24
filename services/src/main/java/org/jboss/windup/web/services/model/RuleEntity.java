package org.jboss.windup.web.services.model;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Lob;
import javax.persistence.Version;

import org.ocpsoft.rewrite.config.Rule;

import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;

/**
 * Contains data about {@link Rule}s loaded by Windup.
 *
 * @author <a href="mailto:jesse.sightler@gmail.com">Jesse Sightler</a>
 */
@Entity
@JsonIdentityInfo(generator = ObjectIdGenerators.PropertyGenerator.class, property = "id", scope = RuleEntity.class)
public class RuleEntity implements Serializable
{
    private static final long serialVersionUID = 1L;

    public static final String RULE_ENTITY_ID = "rule_entity_id";
    public static final String RULE_SEQUENCE = "rule_sequence";

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = RULE_ENTITY_ID, updatable = false, nullable = false)
    private Long id;

    @Version
    @Column(name = "version")
    private int version;

    @Column(name = RULE_SEQUENCE)
    private int ruleSequence;

    @Column(name = "rule_id")
    private String ruleID;

    @Column(name = "rule_contents")
    @Lob
    private String ruleContents;

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
     * Contains a value used for conflict resolution during concurrent updates.
     */
    public int getVersion()
    {
        return version;
    }

    /**
     * Contains a value used for conflict resolution during concurrent updates.
     */
    public void setVersion(int version)
    {
        this.version = version;
    }

    /**
     * Contains the unique identifier of this rule within the provider. This is only guaranteed to be unique within
     * the context of a single Rule provider.
     */
    public String getRuleID()
    {
        return ruleID;
    }

    /**
     * Contains the unique identifier of this rule within the provider. This is only guaranteed to be unique within
     * the context of a single Rule provider.
     */
    public void setRuleID(String ruleID)
    {
        this.ruleID = ruleID;
    }

    /**
     * This contains the text of the rule itself. In the case of XML rules, this will be the literal text. In the
     * case of Java rules, this will be a readable approximation of the rule itself.
     */
    public String getRuleContents()
    {
        return ruleContents;
    }

    /**
     * This contains the text of the rule itself. In the case of XML rules, this will be the literal text. In the
     * case of Java rules, this will be a readable approximation of the rule itself.
     */
    public void setRuleContents(String ruleContents)
    {
        this.ruleContents = ruleContents;
    }
}
