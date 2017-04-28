package org.jboss.windup.web.addons.websupport.services;

import org.jboss.windup.config.loader.RuleLoader;
import org.jboss.windup.config.loader.RuleLoaderContext;
import org.jboss.windup.config.metadata.RuleProviderRegistry;
import org.jboss.windup.web.addons.websupport.WebPathUtil;

import javax.inject.Inject;
import java.nio.file.Path;
import java.util.Collection;

/**
 * @author <a href="mailto:jesse.sightler@gmail.com">Jesse Sightler</a>
 */
public class RuleProviderServiceImpl implements RuleProviderService
{
    @Inject
    private WebPathUtil webPathUtil;

    @Inject
    private RuleLoader ruleLoader;

    public RuleProviderRegistry loadRuleProviderRegistry(Collection<Path> rulePaths, boolean fileRulesOnly)
    {
        RuleLoaderContext ruleLoaderContext = new RuleLoaderContext(rulePaths, null);
        if (fileRulesOnly)
            ruleLoaderContext.setFileBasedRulesOnly();
        return ruleLoader.loadConfiguration(ruleLoaderContext);
    }
}
