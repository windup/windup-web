package org.jboss.windup.web.services;

import org.jboss.arquillian.junit.Arquillian;
import org.junit.Assert;
import org.junit.Test;
import org.junit.runner.RunWith;

import javax.inject.Inject;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Set;

@RunWith(Arquillian.class)
public class RuleProviderRegistryCache_UserProvidedGlobalTest extends AbstractTest {

    public static final String CUSTOM_WINDUP_RULESPATH = "target/test-classes/custom-rulesets-data/custom-target1-ruleset.windup.xml";

    @Inject
    RuleProviderRegistryCache_UserProvidedGlobal ruleProviderRegistryCache;

    @Test
    public void testDataLoader() {
        Path customRulePath = Paths.get(CUSTOM_WINDUP_RULESPATH);
        ruleProviderRegistryCache.addUserRulesPath(customRulePath);

        Set<String> sources = ruleProviderRegistryCache.getAvailableSourceTechnologies();
        Set<String> targets = ruleProviderRegistryCache.getAvailableTargetTechnologies();

        Assert.assertEquals(1, sources.size());
        Assert.assertEquals(1, targets.size());
        Assert.assertTrue(sources.contains("myCustomSource1"));
        Assert.assertTrue(targets.contains("myCustomTarget1"));
    }
}
