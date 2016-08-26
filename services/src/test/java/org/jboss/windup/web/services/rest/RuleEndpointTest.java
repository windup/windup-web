package org.jboss.windup.web.services.rest;

import org.jboss.arquillian.container.test.api.RunAsClient;
import org.jboss.arquillian.junit.Arquillian;
import org.jboss.arquillian.test.api.ArquillianResource;
import org.jboss.arquillian.warp.WarpTest;
import org.jboss.resteasy.client.jaxrs.ResteasyClient;
import org.jboss.resteasy.client.jaxrs.ResteasyClientBuilder;
import org.jboss.resteasy.client.jaxrs.ResteasyWebTarget;
import org.jboss.resteasy.plugins.providers.RegisterBuiltin;
import org.jboss.resteasy.spi.ResteasyProviderFactory;
import org.jboss.windup.web.services.AbstractTest;
import org.jboss.windup.web.services.model.Configuration;
import org.jboss.windup.web.services.model.RuleProviderEntity;
import org.jboss.windup.web.services.model.RulesPath;
import org.junit.Assert;
import org.junit.Before;
import org.junit.BeforeClass;
import org.junit.Test;
import org.junit.runner.RunWith;

import java.net.URL;
import java.util.List;

/**
 * @author <a href="mailto:jesse.sightler@gmail.com">Jesse Sightler</a>
 */
@WarpTest
@RunWith(Arquillian.class)
public class RuleEndpointTest extends AbstractTest
{
    public static final String FAKE_PATH = "./target/classes";
    @ArquillianResource
    private URL contextPath;

    private ConfigurationEndpoint configurationEndpoint;
    private RuleEndpoint ruleEndpoint;

    @BeforeClass
    public static void setUpClass() throws Exception
    {
        // initializes the rest easy client framework
        RegisterBuiltin.register(ResteasyProviderFactory.getInstance());
    }

    @Before
    public void setUp()
    {
        ResteasyClient client = new ResteasyClientBuilder().build();
        ResteasyWebTarget target = client.target(contextPath + "rest");

        this.configurationEndpoint = target.proxy(ConfigurationEndpoint.class);
        this.ruleEndpoint = target.proxy(RuleEndpoint.class);
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
        Configuration configuration = configurationEndpoint.getConfiguration();
        RulesPath systemRulesPath = configuration.getRulesPaths().get(0);

        configuration.getRulesPaths().add(new RulesPath(FAKE_PATH, RulesPath.RulesPathType.USER_PROVIDED));
        configurationEndpoint.saveConfiguration(configuration);

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
        Configuration configuration = configurationEndpoint.getConfiguration();
        RulesPath fakeRulesPath = new RulesPath(FAKE_PATH, RulesPath.RulesPathType.USER_PROVIDED);
        configuration.getRulesPaths().add(fakeRulesPath);
        configuration = configurationEndpoint.saveConfiguration(configuration);

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
