package org.jboss.windup.web.services;

import org.jboss.arquillian.junit.Arquillian;
import org.jboss.windup.web.services.model.AnalysisContext;
import org.junit.Assert;
import org.junit.Test;
import org.junit.runner.RunWith;

import javax.inject.Inject;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.Set;

@RunWith(Arquillian.class)
public class RuleProviderRegistryCache_UserProvidedProjectTest extends AbstractTest {

    public static final String CUSTOM_WINDUP_RULESPATH1 = "target/test-classes/custom-rulesets-data/custom-target1-ruleset.windup.xml";
    public static final String CUSTOM_WINDUP_RULESPATH2 = "target/test-classes/custom-rulesets-data/custom-target2-ruleset.windup.xml";

    @Inject
    RuleProviderRegistryCache_UserProvidedProject ruleProviderRegistryCache;

    @Test
    public void testDataLoader() {
        // Configure Context1
        AnalysisContext analysisContext1 = new AnalysisContext();
        analysisContext1.setId(1L);

        Path customRulePath1 = Paths.get(CUSTOM_WINDUP_RULESPATH1);
        ruleProviderRegistryCache.setUserRulesPath(analysisContext1, List.of(customRulePath1));

        // Configure Context2
        AnalysisContext analysisContext2 = new AnalysisContext();
        analysisContext2.setId(2L);

        Path customRulePath2 = Paths.get(CUSTOM_WINDUP_RULESPATH2);
        ruleProviderRegistryCache.setUserRulesPath(analysisContext2, List.of(customRulePath2));

        // Verify Context1 has only targets/sources that belongs to it "myCustomSource1" and "myCustomTarget1"
        Set<String> sources1 = ruleProviderRegistryCache.getAvailableSourceTechnologies(analysisContext1);
        Set<String> targets1 = ruleProviderRegistryCache.getAvailableTargetTechnologies(analysisContext1);

        Assert.assertEquals(1, sources1.size());
        Assert.assertTrue(sources1.contains("myCustomSource1"));

        Assert.assertEquals(2, targets1.size());
        Assert.assertTrue(targets1.contains("myCustomTarget1"));

        // Verify Context2 has only targets/sources that belongs to it "myCustomSource2" and "myCustomTarget2"
        Set<String> sources2 = ruleProviderRegistryCache.getAvailableSourceTechnologies(analysisContext2);
        Set<String> targets2 = ruleProviderRegistryCache.getAvailableTargetTechnologies(analysisContext2);

        Assert.assertEquals(1, sources2.size());
        Assert.assertTrue(sources2.contains("myCustomSource2"));

        Assert.assertEquals(2, targets2.size());
        Assert.assertTrue(targets2.contains("myCustomTarget2"));
    }
}
