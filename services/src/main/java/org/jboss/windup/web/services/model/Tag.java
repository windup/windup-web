package org.jboss.windup.web.services.model;

import java.util.HashSet;
import java.util.Set;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

import org.hibernate.annotations.Fetch;
import org.hibernate.annotations.FetchMode;

import com.fasterxml.jackson.annotation.JsonIgnore;

/**
 * @author <a href="mailto:dklingenberg@gmail.com">David Klingenberg</a>
 */
@Entity
public class Tag
{
    public static final String TAG_ID = "tag_id";
    public static final String TAG_NAME = "name";

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = TAG_ID, updatable = false, nullable = false)
    private Long id;

    @Column(name = TAG_NAME, length = 256)
    @Size(min = 0, max = 256)
    @NotNull
    private String name;

    @Column
    private boolean isRoot;

    @Column
    private boolean isPseudo;

    @Column
    private String color;

    @Column
    private String title;

    @OneToMany(fetch = FetchType.EAGER, mappedBy = "parent")
    @Fetch(FetchMode.SELECT)
    private Set<Tag> containedTags;

    @ManyToOne
    @JsonIgnore
    private Tag parent;

    protected Tag()
    {
        this.containedTags = new HashSet<>();
    }

    public Tag(String name)
    {
        this();
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

    public Tag setName(String name)
    {
        this.name = name;

        return this;
    }

    public boolean isRoot()
    {
        return isRoot;
    }

    public Tag setRoot(boolean root)
    {
        isRoot = root;

        return this;
    }

    public boolean isPseudo()
    {
        return isPseudo;
    }

    public Tag setPseudo(boolean pseudo)
    {
        isPseudo = pseudo;

        return this;
    }

    public String getColor()
    {
        return color;
    }

    public Tag setColor(String color)
    {
        this.color = color;

        return this;
    }

    public String getTitle()
    {
        return title;
    }

    public Tag setTitle(String title)
    {
        this.title = title;

        return this;
    }

    public Set<Tag> getContainedTags()
    {
        return containedTags;
    }

    public Tag setContainedTags(Set<Tag> containedTags)
    {
        this.containedTags = containedTags;

        return this;
    }

    public Tag addContainedTag(Tag tag)
    {
        this.containedTags.add(tag);

        return this;
    }

    public Tag getParent()
    {
        return parent;
    }

    public Tag setParent(Tag parent)
    {
        this.parent = parent;

        return this;
    }
}
