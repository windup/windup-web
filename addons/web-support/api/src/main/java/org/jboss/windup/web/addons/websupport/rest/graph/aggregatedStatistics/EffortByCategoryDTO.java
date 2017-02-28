package org.jboss.windup.web.addons.websupport.rest.graph.aggregatedStatistics;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import javax.enterprise.inject.Vetoed;
import java.util.ArrayList;
import java.util.List;

/**
 * Contains category information, for use by the issue statistics summary report.
 *
 * @author <a href="mailto:jesse.sightler@gmail.com">Jesse Sightler</a>
 */
@Vetoed
@JsonIgnoreProperties({"handler", "delegate"})
public class EffortByCategoryDTO
{
    List<EffortCategoryDTO> categories = new ArrayList<>();

    /**
     * Contains the list of categories to report.
     */
    public List<EffortCategoryDTO> getCategories()
    {
        return categories;
    }

    /**
     * Contains the list of categories to report.
     */
    public void addCategory(EffortCategoryDTO categoryDTO)
    {
        this.categories.add(categoryDTO);
    }
}
