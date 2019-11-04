package org.jboss.windup.web.services.rest;

import org.jboss.arquillian.container.test.api.RunAsClient;
import org.jboss.arquillian.junit.Arquillian;
import org.jboss.arquillian.test.api.ArquillianResource;
import org.jboss.resteasy.client.jaxrs.ResteasyClient;
import org.jboss.resteasy.client.jaxrs.ResteasyWebTarget;
import org.jboss.windup.web.services.AbstractTest;
import org.jboss.windup.web.services.ServiceTestUtil;
import org.jboss.windup.web.services.data.ServiceConstants;
import org.jboss.windup.web.services.model.*;
import org.junit.Assert;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;

import java.net.URL;
import java.util.List;
import java.util.Optional;

/**
 * @author <a href="mailto:jesse.sightler@gmail.com">Jesse Sightler</a>
 */
@RunWith(Arquillian.class)
public class RuleEndpointTest extends AbstractTest
{
    public static final String FAKE_PATH = "./target/classes";
    @ArquillianResource
    private URL contextPath;

    private ConfigurationEndpoint configurationEndpoint;
    private RuleEndpoint ruleEndpoint;

    @Before
    public void setUp()
    {
        ResteasyClient client = ServiceTestUtil.getResteasyClient();
        ResteasyWebTarget target = client.target(contextPath + ServiceConstants.REST_BASE);

        this.configurationEndpoint = target.proxy(ConfigurationEndpoint.class);
        this.ruleEndpoint = target.proxy(RuleEndpoint.class);
    }

    private Optional<RulesPath> getSystemRulesPath(Configuration configuration) {
        if (configuration.getRulesPaths() == null || configuration.getRulesPaths().isEmpty())
            return Optional.empty();

        return configuration
                .getRulesPaths()
                .stream()
                .filter((rulesPath) -> rulesPath.getRulesPathType() == PathType.SYSTEM_PROVIDED)
                .findFirst();
    }

    @Test
    @RunAsClient
    public void testLoadAllRules() {
        List<RuleProviderEntity> ruleProviderEntities = ruleEndpoint.getAllProviders();

        Assert.assertTrue(ruleProviderEntities.size() > 10);

        int rulesFound = 0;
        for (RuleProviderEntity ruleProviderEntity : ruleProviderEntities)
        {
            rulesFound += ruleProviderEntity.getRules().size();
        }

        System.out.println("Rules found: " + rulesFound);
        Assert.assertTrue(rulesFound > 100);
    }

    @Test
    @RunAsClient
    public void testByRulePathWithRules() {
        Configuration configuration = configurationEndpoint.getGlobalConfiguration();
        RulesPath systemRulesPath = getSystemRulesPath(configuration).get();
        System.out.println("System rules path: " + systemRulesPath);

        configuration.getRulesPaths().add(new RulesPath(FAKE_PATH, PathType.USER_PROVIDED, ScopeType.GLOBAL));
        configurationEndpoint.saveConfiguration(configuration.getId(), configuration);

        List<RuleProviderEntity> ruleProviderEntities = ruleEndpoint.getByRulesPath(systemRulesPath.getId());

        Assert.assertTrue(ruleProviderEntities.size() > 10);

        int rulesFound = 0;
        for (RuleProviderEntity ruleProviderEntity : ruleProviderEntities)
        {
            rulesFound += ruleProviderEntity.getRules().size();
        }

        System.out.println("Rules found: " + rulesFound);
        Assert.assertTrue(rulesFound > 100);
    }

    @Test
    @RunAsClient
    public void testByRulePathWithNORules() {
        Configuration configuration = configurationEndpoint.getGlobalConfiguration();
        RulesPath fakeRulesPath = new RulesPath(FAKE_PATH, PathType.USER_PROVIDED, ScopeType.GLOBAL);
        configuration.getRulesPaths().add(fakeRulesPath);
        configuration = configurationEndpoint.saveConfiguration(configuration.getId(), configuration);

        for (RulesPath rulesPath : configuration.getRulesPaths())
        {
            if (FAKE_PATH.equals(rulesPath.getPath()))
            {
                fakeRulesPath = rulesPath;
                break;
            }
        }

        List<RuleProviderEntity> ruleProviderEntities = ruleEndpoint.getByRulesPath(fakeRulesPath.getId());

        Assert.assertEquals(0, ruleProviderEntities.size());
    }
}
