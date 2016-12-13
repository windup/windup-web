package org.jboss.windup.web.addons.websupport.model;

import java.util.Collection;

/**
 * @author <a href="mailto:dklingenberg@gmail.com">David Klingenberg</a>
 */
public interface ReportFilterDTO
{
    Collection<String> getSelectedApplicationPaths();
    Collection<String> getIncludeTags();
    Collection<String> getExcludeTags();
    Collection<String> getIncludeCategories();
    Collection<String> getExcludeCategories();
    boolean isEnabled();
}
