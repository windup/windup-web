package org.jboss.windup.web.addons.websupport.services;

import java.util.HashMap;
import java.util.Map;

import org.jboss.windup.reporting.category.IssueCategoryRegistry;

/**
 * @author <a href="mailto:dklingenberg@gmail.com">David Klingenberg</a>
 */
public class IssueCategoryProviderServiceImpl implements IssueCategoryProviderService
{
    protected IssueCategoryRegistry loadIssueCategoryRegistry()
    {
        IssueCategoryRegistry registry = new IssueCategoryRegistry();
        return registry;
    }

    @Override
    public Map<String, Integer> getCategoriesWithPriority()
    {
        IssueCategoryRegistry registry = this.loadIssueCategoryRegistry();

        Map<String, Integer> resultMap = new HashMap<>();
        registry.getIssueCategories().forEach(category -> resultMap.put(category.getName(), category.getPriority()));

        return resultMap;
    }
}
