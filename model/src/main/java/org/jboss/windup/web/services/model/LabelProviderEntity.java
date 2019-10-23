package org.jboss.windup.web.services.model;

import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;

import javax.persistence.*;
import java.io.Serializable;
import java.util.*;

/**
 * Contains data about LabelProvider found by the Windup engine.
 *
 * @author <a href="mailto:carlosthe19916@gmail.com">Carlos Feria</a>
 */
@Entity
@JsonIdentityInfo(generator = ObjectIdGenerators.PropertyGenerator.class, property = "id", scope = LabelProviderEntity.class)
@NamedQueries({
    @NamedQuery(name = LabelProviderEntity.FIND_ALL, query = "select lpe from LabelProviderEntity lpe"),
    @NamedQuery(name = LabelProviderEntity.DELETE_ALL, query = "delete from LabelProviderEntity"),
    @NamedQuery(
            name = LabelProviderEntity.DELETE_BY_LABELS_PATH,
            query = "delete from LabelProviderEntity lpe where lpe.labelsPath = :" + LabelProviderEntity.LABELS_PATH_PARAM),
    @NamedQuery(
            name = LabelProviderEntity.DELETE_WITH_NULL_LABELS_PATH,
            query = "delete from LabelProviderEntity lpe where lpe.labelsPath is null")
})
public class LabelProviderEntity implements Serializable
{
    public static final String FIND_ALL = "LabelProviderEntity.findAll";
    public static final String DELETE_ALL = "LabelProviderEntity.deleteAll";
    public static final String DELETE_BY_LABELS_PATH = "LabelProviderEntity.deleteByLabelsPath";
    public static final String DELETE_WITH_NULL_LABELS_PATH = "LabelProviderEntity.deleteNullPath";
    public static final String LABELS_PATH_PARAM = "labelsPath";

    public static final String LABEL_PROVIDER_ENTITY_ID = "labels_provider_entity_id";

    public enum LabelProviderType {
        XML
    }

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = LABEL_PROVIDER_ENTITY_ID, updatable = false, nullable = false)
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

    @Column(name = "date_loaded")
    @Temporal(TemporalType.TIMESTAMP)
    private Calendar dateLoaded;

    @Column(name = "date_modified")
    @Temporal(TemporalType.TIMESTAMP)
    private Calendar dateModified;

    @OneToMany(cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    @OrderColumn(name = LabelEntity.LABEL_SEQUENCE)
    private List<LabelEntity> labels;

    @ManyToOne(fetch = FetchType.EAGER)
    private LabelsPath labelsPath;

    @Lob
    private String loadError;

    @Column
    private LabelProviderType labelProviderType;

    public LabelProviderEntity()
    {
        this.labels = new ArrayList<>();
    }

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
     * Contains the ID from the Label Provider. This should be unique across all label providers.
     */
    public String getProviderID()
    {
        return providerID;
    }

    /**
     * Contains the ID from the Label Provider. This should be unique across all label providers.
     */
    public void setProviderID(String providerID)
    {
        this.providerID = providerID;
    }

    /**
     * Contains the origin of the Label Provider. For an XML File, this will be a full path to the file.
     */
    public String getOrigin()
    {
        return origin;
    }

    /**
     * Contains the origin of the Label Provider. For an XML File, this will be a full path to the file.
     */
    public void setOrigin(String origin)
    {
        this.origin = origin;
    }

    /**
     * Contains a human readable description of this label provider.
     */
    public String getDescription()
    {
        return description;
    }

    /**
     * Contains a human readable description of this label provider.
     */
    public void setDescription(String description)
    {
        this.description = description;
    }

    /**
     * Contains the time that this label's metadata was loaded into the windup-web database.
     */
    public Calendar getDateLoaded()
    {
        return dateLoaded;
    }

    /**
     * Contains the time that this label's metadata was loaded into the windup-web database.
     */
    public void setDateLoaded(Calendar dateLoaded)
    {
        this.dateLoaded = dateLoaded;
    }

    /**
     * Contains the time that this label's metadata was last modified on disk. This may be null if no modification date could be determined.
     */
    public Calendar getDateModified()
    {
        return dateModified;
    }

    /**
     * Contains the time that this label's metadata was last modified on disk. This may be null if no modification date could be determined.
     */
    public void setDateModified(Calendar dateModified)
    {
        this.dateModified = dateModified;
    }

    /**
     * Contains the list of labels that were loaded by this provider.
     */
    public List<LabelEntity> getLabels()
    {
        return labels;
    }

    /**
     * Contains the list of labels that were loaded by this provider.
     */
    public void setLabels(List<LabelEntity> labels)
    {
        this.labels = labels;
    }

    /**
     * Contains the path in which this provider was found.
     */
    public LabelsPath getLabelsPath()
    {
        return labelsPath;
    }

    /**
     * Contains the path in which this provider was found.
     */
    public void setLabelsPath(LabelsPath labelsPath)
    {
        this.labelsPath = labelsPath;
    }

    /**
     * Contains the type of provider (for example, Java vs Groovy).
     */
    public LabelProviderType getLabelProviderType()
    {
        return labelProviderType;
    }

    /**
     * Contains the type of provider (for example, Java vs Groovy).
     */
    public void setLabelProviderType(LabelProviderType labelProviderType)
    {
        this.labelProviderType = labelProviderType;
    }

    /**
     * Contains a load error if there were any issues loading labels from this path.
     */
    public String getLoadError()
    {
        return loadError;
    }

    /**
     * Contains a load error if there were any issues loading labels from this path.
     */
    public void setLoadError(String loadError)
    {
        this.loadError = loadError;
    }
}
