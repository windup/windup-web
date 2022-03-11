package org.jboss.windup.web.services;

import org.jboss.arquillian.junit.Arquillian;
import org.jboss.windup.web.services.model.AnalysisContext;
import org.junit.Test;
import org.junit.runner.RunWith;

import javax.inject.Inject;
import java.util.Set;

@RunWith(Arquillian.class)
public class CarlosTest extends AbstractTest {

    @Inject
    private RuleProviderRegistryCache_UserProvidedProject ruleProviderRegistryCache_analysisContext;

    @Test
    public void testDataLoader() {
//        AnalysisContext analysisContext = new AnalysisContext();
//        analysisContext.setId(1L);
//
//        RuleProviderRegistryCachePerProject ruleProviderRegistryCache = ruleProviderRegistryCache_analysisContext.getRuleProviderRegistryCache(analysisContext);
//        Set<String> availableTargetTechnologies = ruleProviderRegistryCache.getAvailableTargetTechnologies();
//
//        System.out.println("");
    }
}
