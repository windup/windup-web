package org.jboss.windup.web.services.model;

import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;

import javax.persistence.*;
import java.io.Serializable;

/**
 * Contains data about Labels loaded by Windup.
 *
 * @author <a href="mailto:carlosthe19916@gmail.com">Carlos Feria</a>
 */
@Entity
@JsonIdentityInfo(generator = ObjectIdGenerators.PropertyGenerator.class, property = "id", scope = LabelEntity.class)
public class LabelEntity implements Serializable
{
    private static final long serialVersionUID = 1L;

    public static final String LABEL_ENTITY_ID = "label_entity_id";
    public static final String LABEL_SEQUENCE = "label_sequence";

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = LABEL_ENTITY_ID, updatable = false, nullable = false)
    private Long id;

    @Version
    @Column(name = "version")
    private int version;

    @Column(name = LABEL_SEQUENCE)
    private int labelSequence;

    @Column(name = "label_id")
    private String labelID;

    @Column(name = "label_contents")
    @Lob
    private String labelContents;

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
    public String getLabelID()
    {
        return labelID;
    }

    /**
     * Contains the unique identifier of this rule within the provider. This is only guaranteed to be unique within
     * the context of a single Rule provider.
     */
    public void setLabelID(String labelID)
    {
        this.labelID = labelID;
    }

    /**
     * This contains the text of the rule itself. In the case of XML rules, this will be the literal text. In the
     * case of Java rules, this will be a readable approximation of the rule itself.
     */
    public String getLabelContents()
    {
        return labelContents;
    }

    /**
     * This contains the text of the rule itself. In the case of XML rules, this will be the literal text. In the
     * case of Java rules, this will be a readable approximation of the rule itself.
     */
    public void setLabelContents(String labelContents)
    {
        this.labelContents = labelContents;
    }
}
