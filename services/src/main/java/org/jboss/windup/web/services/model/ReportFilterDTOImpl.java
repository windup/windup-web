package org.jboss.windup.web.services.model;

import java.util.Collection;
import java.util.HashSet;
import java.util.Set;
import java.util.stream.Collectors;

import org.jboss.windup.web.addons.websupport.model.ReportFilterDTO;

/**
 * @author <a href="mailto:dklingenberg@gmail.com">David Klingenberg</a>
 */
public class ReportFilterDTOImpl implements ReportFilterDTO
{
    private Set<String> selectedApplications;
    private Set<String> includeTags;
    private Set<String> excludeTags;
    private Set<String> includeCategories;
    private Set<String> excludeCategories;
    private boolean isEnabled;

    protected ReportFilterDTOImpl()
    {

    }

    public ReportFilterDTOImpl(ReportFilter filter)
    {
        if (filter != null)
        {
            this.isEnabled = filter.isEnabled();

            this.includeTags = ReportFilterDTOImpl.transformTags(filter.getIncludeTags());
            this.excludeTags = ReportFilterDTOImpl.transformTags(filter.getExcludeTags());

            this.includeCategories = ReportFilterDTOImpl.transformCategories(filter.getIncludeCategories());
            this.excludeCategories = ReportFilterDTOImpl.transformCategories(filter.getExcludeCategories());

            this.selectedApplications = filter.getSelectedApplications()
                    .stream()
                    .map(FilterApplication::getInputPath)
                    .collect(Collectors.toSet());
        }
        else
        {
            this.isEnabled = false;

            this.includeTags = new HashSet<>();
            this.excludeTags = new HashSet<>();

            this.includeCategories = new HashSet<>();
            this.excludeCategories = new HashSet<>();

            this.selectedApplications = new HashSet<>();
        }
    }

    private static Set<String> transformTags(Set<Tag> tags)
    {
        return tags.stream().map(Tag::getName).collect(Collectors.toSet());
    }

    private static Set<String> transformCategories(Set<Category> categories)
    {
        return categories.stream().map(Category::getName).collect(Collectors.toSet());
    }

    @Override
    public Collection<String> getSelectedApplicationPaths()
    {
        return this.selectedApplications;
    }

    @Override
    public Set<String> getIncludeTags()
    {
        return includeTags;
    }

    @Override
    public Set<String> getExcludeTags()
    {
        return excludeTags;
    }

    @Override
    public Set<String> getIncludeCategories()
    {
        return includeCategories;
    }

    @Override
    public Set<String> getExcludeCategories()
    {
        return excludeCategories;
    }

    @Override
    public boolean isEnabled()
    {
        return isEnabled;
    }
}
