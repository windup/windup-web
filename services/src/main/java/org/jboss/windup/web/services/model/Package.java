package org.jboss.windup.web.services.model;

import java.io.Serializable;
import java.util.Collection;
import java.util.Set;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

/**
 * @author <a href="mailto:dklingenberg@gmail.com">David Klingenberg</a>
 */
@Entity
public class Package implements Serializable
{
    public static final String PACKAGE_ID = "package_id";

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = PACKAGE_ID, updatable = false, nullable = false)
    private Long id;

    @Column(length = 256)
    @Size(min = 1, max = 256)
    @NotNull
    private String name;

    @Column(length = 256)
    @Size(min = 1, max = 256)
    @NotNull
    private String fullName;

    @Column()
    private int countClasses;

    @ManyToOne()
    private Package parent;

    @OneToMany(fetch = FetchType.EAGER, mappedBy = "parent")
    private Set<Package> childs;

    public Package()
    {

    }

    /**
     * Constructor.
     * 
     * @param name Name of package
     */
    public Package(String name)
    {
        this.name = name;
    }

    public Long getId()
    {
        return id;
    }

    public String getName()
    {
        return name;
    }

    public void setName(String name)
    {
        this.name = name;
    }

    public String getFullName()
    {
        return fullName;
    }

    public void setFullName(String fullName)
    {
        this.fullName = fullName;
    }

    public int getCountClasses()
    {
        return countClasses;
    }

    public void setCountClasses(int countClasses)
    {
        this.countClasses = countClasses;
    }

    public Package getParent()
    {
        return parent;
    }

    public void setParent(Package parent)
    {
        this.parent = parent;
    }

    public Collection<Package> getChilds()
    {
        return childs;
    }

    public void addChild(Package child)
    {

    }

    public void removeChild(Package child)
    {

    }
}
