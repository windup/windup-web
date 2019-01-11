package org.jboss.windup.web.services.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import java.io.Serializable;
import java.util.Collection;
import java.util.HashSet;
import java.util.Set;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

/**
 * Entity representing Java package in analysed application.
 *
 * @author <a href="mailto:dklingenberg@gmail.com">David Klingenberg</a>
 */
@Entity
@JsonIgnoreProperties(ignoreUnknown = true)
@Table(
        indexes = @Index(columnList = Package.PARENT_PACKAGE_ID, unique = false)
)
public class Package implements Serializable
{
    public static final String PACKAGE_ID = "package_id";
    public static final String PARENT_PACKAGE_ID = "parent_package_id";

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = PACKAGE_ID, updatable = false, nullable = false)
    private Long id;

    @Column(length = 256)
    @Size(min = 0, max = 256)
    @NotNull
    private String name;

    @Column(length = 256)
    @Size(min = 0, max = 256)
    @NotNull
    private String fullName;

    @Column()
    private int countClasses;

    @ManyToOne()
    @JsonIgnore
    @JoinColumn(name = PARENT_PACKAGE_ID)
    private Package parent;

    @OneToMany(fetch = FetchType.EAGER, mappedBy = "parent")
    private Set<Package> childs;

    public Package()
    {
        this.childs = new HashSet<>();
    }

    /**
     * Constructor.
     *
     * @param name Name of package
     */
    public Package(String name)
    {
        this.name = name;
        this.childs = new HashSet<>();
    }

    /**
     * Constructor.
     *
     * @param partialName Name of package
     * @param fullName Fully qualified name of package
     */
    public Package(String partialName, String fullName)
    {
        this.name = partialName;
        this.fullName = fullName;
        this.childs = new HashSet<>();
    }

    public Long getId()
    {
        return id;
    }

    /**
     * Gets name of the package (ex. "lang" part of java.lang)
     *
     * @return Name of the package
     */
    public String getName()
    {
        return name;
    }

    /**
     * Sets name of the package
     *
     * @param name Name of the package
     */
    public void setName(String name)
    {
        this.name = name;
    }

    /**
     * Gets fully qualified name the of package
     *
     * @return Fully qualified name of the package
     */
    public String getFullName()
    {
        return fullName;
    }


    /**
     * Sets fully qualified name the of package
     *
     * @param fullName Fully qualified name of the package
     */
    public void setFullName(String fullName)
    {
        this.fullName = fullName;
    }

    /**
     * Gets count of classes discovered in package
     *
     * @return Count of classes in package
     */
    public int getCountClasses()
    {
        return countClasses;
    }

    /**
     * Sets count of classes discovered in package
     *
     * @param countClasses Count of classes in package
     */
    public void setCountClasses(int countClasses)
    {
        this.countClasses = countClasses;
    }

    /**
     * Gets parent package
     *
     * @return Parent package. Null for root package.
     */
    public Package getParent()
    {
        return parent;
    }

    /**
     * Sets parent package
     *
     * @param parent Parent package
     */
    public void setParent(Package parent)
    {
        this.parent = parent;
    }

    public Collection<Package> getChilds()
    {
        return childs;
    }

    /**
     * Adds child package
     *
     * @param child Child package
     */
    public void addChild(Package child)
    {
        this.childs.add(child);
    }

    /**
     * Removes child package
     *
     * @param child Child package
     */
    public void removeChild(Package child)
    {
        this.childs.remove(child);
    }


    public int getLevel()
    {
        if (this.parent == null) {
            return 0;
        } else {
            return this.parent.getLevel() + 1;
        }
    }
}
