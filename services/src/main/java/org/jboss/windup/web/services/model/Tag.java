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
public class Tag {
    public static final String TAG_ID = "tag_id";

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = TAG_ID, updatable = false, nullable = false)
    private Long id;

    @Column(length = 256)
    @Size(min = 0, max = 256)
    @NotNull
    private String name;

    protected Tag()
    {

    }

    public Tag(String name)
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
}
