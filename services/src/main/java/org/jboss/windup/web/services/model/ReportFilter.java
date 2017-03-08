package org.jboss.windup.web.services.model;

import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinTable;
import javax.persistence.OneToMany;
import javax.persistence.OneToOne;

import org.hibernate.annotations.Fetch;
import org.hibernate.annotations.FetchMode;

import com.fasterxml.jackson.annotation.JsonIgnore;

/**
 * @author <a href="mailto:dklingenberg@gmail.com">David Klingenberg</a>
 */
@Entity
public class ReportFilter implements Serializable
{
    public static final String REPORT_FILTER_ID = "report_filter_id";

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = REPORT_FILTER_ID, updatable = false, nullable = false)
    private Long id;

    @OneToMany(fetch = FetchType.EAGER)
    @Fetch(FetchMode.SELECT)
    private Set<FilterApplication> selectedApplications;

    @OneToMany(fetch = FetchType.EAGER)
    @Fetch(FetchMode.SELECT)
    @JoinTable(name = "report_filter_include_tags")
    private Set<Tag> includeTags;

    @OneToMany(fetch = FetchType.EAGER)
    @Fetch(FetchMode.SELECT)
    @JoinTable(name = "report_filter_exclude_tags")
    private Set<Tag> excludeTags;

    @OneToMany(fetch = FetchType.EAGER)
    @Fetch(FetchMode.SELECT)
    @JoinTable(name = "report_filter_include_categories")
    private Set<Category> includeCategories;

    @OneToMany(fetch = FetchType.EAGER)
    @Fetch(FetchMode.SELECT)
    @JoinTable(name = "report_filter_exclude_categories")
    private Set<Category> excludeCategories;

    @OneToOne(optional = false)
    @JsonIgnore
    private WindupExecution windupExecution;

    @Column(nullable = false)
    private boolean isEnabled = false;

    protected ReportFilter()
    {
        this.selectedApplications = new HashSet<>();
        this.includeTags = new HashSet<>();
        this.excludeTags = new HashSet<>();
        this.includeCategories = new HashSet<>();
        this.excludeCategories = new HashSet<>();
    }

    public ReportFilter(WindupExecution execution)
    {
        this();
        this.windupExecution = execution;
    }

    public Long getId()
    {
        return id;
    }

    public Set<Tag> getIncludeTags()
    {
        return includeTags;
    }

    public void addIncludeTag(Tag tag)
    {
        this.includeTags.add(tag);
    }

    public void removeIncludeTag(Tag tag)
    {
        this.includeTags.remove(tag);
    }

    public void clearIncludeTags()
    {
        this.includeTags.clear();
    }

    public Set<Category> getIncludeCategories()
    {
        return includeCategories;
    }

    public void addIncludeCategory(Category category)
    {
        this.includeCategories.add(category);
    }

    public void removeIncludeCategory(Category category)
    {
        this.includeCategories.remove(category);
    }

    public void clearIncludeCategories()
    {
        this.includeCategories.clear();
    }

    public Set<Category> getExcludeCategories()
    {
        return excludeCategories;
    }

    public void addExcludeCategory(Category ExcludeCategory)
    {
        this.excludeCategories.add(ExcludeCategory);
    }

    public void removeExcludeCategory(Category ExcludeCategory)
    {
        this.excludeCategories.remove(ExcludeCategory);
    }

    public void clearExcludeCategories()
    {
        this.excludeCategories.clear();
    }

    public Set<Tag> getExcludeTags()
    {
        return excludeTags;
    }

    public void addExcludeTag(Tag excludeTag)
    {
        this.excludeTags.add(excludeTag);
    }

    public void removeExcludeTag(Tag excludeTag)
    {
        this.excludeTags.remove(excludeTag);
    }

    public void clearExcludeTags()
    {
        this.excludeTags.clear();
    }

    /**
     * Gets WindupExecution for which this filter is applied
     */
    public WindupExecution getWindupExecution()
    {
        return windupExecution;
    }

    /**
     * Sets WindupExecution for which this filter is applied
     */
    public void setWindupExecution(WindupExecution windupExecution)
    {
        this.windupExecution = windupExecution;
    }

    public Set<FilterApplication> getSelectedApplications()
    {
        return selectedApplications;
    }

    public void addSelectedApplication(FilterApplication Application)
    {
        this.selectedApplications.add(Application);
    }

    public void removeSelectedApplication(FilterApplication Application)
    {
        this.selectedApplications.remove(Application);
    }

    public void clearSelectedApplications()
    {
        this.selectedApplications.clear();
    }

    public boolean isEnabled()
    {
        return isEnabled;
    }

    public void setEnabled(boolean enabled)
    {
        isEnabled = enabled;
    }

    public void clear()
    {
        this.clearIncludeCategories();
        this.clearExcludeCategories();
        this.clearIncludeTags();
        this.clearExcludeTags();
        this.clearSelectedApplications();

        this.isEnabled = false;
    }
}
