package org.jboss.windup.web.services.shims;

import java.nio.file.Path;
import java.util.Set;

import javax.inject.Inject;

import org.jboss.forge.furnace.Furnace;
import org.jboss.windup.config.metadata.RuleProviderRegistry;
import org.jboss.windup.config.metadata.RuleProviderRegistryCache;
import org.jboss.windup.graph.GraphContext;

/**
 * The implementation of this in furnace is in config-impl, which we do not import into the war. Therefore, in
 * order for CDI to be able to find this service, we implement a stub "implementation" here, which just proxies to the
 * underlying implementation in Furnace.
 *
 * @author <a href="mailto:jesse.sightler@gmail.com">Jesse Sightler</a>
 */
public class WebRuleProviderRegistryCache implements RuleProviderRegistryCache
{
    @Inject
    private Furnace furnace;

    private RuleProviderRegistryCache getProviderFromFurnace()
    {
        return furnace.getAddonRegistry().getServices(RuleProviderRegistryCache.class).get();
    }

    @Override
    public void addUserRulesPath(Path path)
    {
        getProviderFromFurnace().addUserRulesPath(path);
    }

    @Override
    public Set<String> getAvailableTags()
    {
        return getProviderFromFurnace().getAvailableTags();
    }

    @Override
    public Set<String> getAvailableSourceTechnologies()
    {
        return getProviderFromFurnace().getAvailableSourceTechnologies();
    }

    @Override
    public Set<String> getAvailableTargetTechnologies()
    {
        return getProviderFromFurnace().getAvailableTargetTechnologies();
    }

    @Override
    public RuleProviderRegistry getRuleProviderRegistry()
    {
        return getProviderFromFurnace().getRuleProviderRegistry();
    }

    @Override
    public RuleProviderRegistry getRuleProviderRegistry(GraphContext graphContext)
    {
        return getProviderFromFurnace().getRuleProviderRegistry(graphContext);
    }
}
