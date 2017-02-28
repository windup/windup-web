package org.jboss.windup.web.addons.websupport.rest.graph.aggregatedStatistics;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import javax.enterprise.inject.Vetoed;

/**
 * Contains the detailed statistics for issues within a particular category.
 *
 * @author <a href="mailto:jesse.sightler@gmail.com">Jesse Sightler</a>
 */
@Vetoed
@JsonIgnoreProperties({"handler", "delegate"})
public class EffortCategoryDTO extends StatisticsList
{
    String categoryID;

    /**
     * Contains the category id.
     */
    public String getCategoryID()
    {
        return categoryID;
    }

    /**
     * Contains the category id.
     */
    public void setCategoryID(String categoryID)
    {
        this.categoryID = categoryID;
    }

}
