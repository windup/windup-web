package org.jboss.windup.web.services.model;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

/**
 * @author <a href="mailto:dklingenberg@gmail.com">David Klingenberg</a>
 */
@Entity
public class Category
{
    public static final String CATEGORY_ID = "tag_id";

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = CATEGORY_ID, updatable = false, nullable = false)
    private Long id;

    @Column(length = 256)
    @Size(min = 0, max = 256)
    @NotNull
    private String name;

    @Column
    private Integer priority;

    protected Category()
    {

    }

    public Category(String name)
    {
        this.name = name;
    }

    public Category(String name, Integer priority)
    {
        this.name = name;
        this.priority = priority;
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

    public Integer getPriority()
    {
        return priority;
    }

    public void setPriority(Integer priority)
    {
        this.priority = priority;
    }

    @Override
    public boolean equals(Object o)
    {
        if (this == o)
            return true;

        if (o == null || getClass() != o.getClass())
            return false;

        Category category = (Category) o;

        return id != null ? id.equals(category.id) : category.id == null;
    }

    @Override
    public int hashCode()
    {
        return id != null ? id.hashCode() : 0;
    }
}
