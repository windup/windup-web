package org.jboss.windup.web.services.rest;

import org.jboss.arquillian.container.test.api.RunAsClient;
import org.jboss.arquillian.junit.Arquillian;
import org.jboss.arquillian.test.api.ArquillianResource;
import org.jboss.resteasy.client.jaxrs.ResteasyClient;
import org.jboss.resteasy.client.jaxrs.ResteasyWebTarget;
import org.jboss.windup.web.services.AbstractTest;
import org.jboss.windup.web.services.ServiceTestUtil;
import org.jboss.windup.web.services.data.ServiceConstants;
import org.jboss.windup.web.services.model.Configuration;
import org.jboss.windup.web.services.model.PathType;
import org.jboss.windup.web.services.model.RulesPath;
import org.junit.Assert;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;

import java.net.URL;
import java.util.Collections;
import java.util.Set;

/**
 * @author <a href="mailto:jesse.sightler@gmail.com">Jesse Sightler</a>
 */
@RunWith(Arquillian.class)
public class ConfigurationEndpointTest extends AbstractTest
{
    public static final String FAKE_PATH = "./target/classes/";
    public static final String CUSTOM_RULESPATH = "target/test-classes/custom-rulesets-data/custom-ruleset.windup.xml";
    public static final String CUSTOM_RULESPATH_WITH_CUSTOM_TECHNOLOGIES1 = "target/test-classes/custom-rulesets-data/custom-target1-ruleset.windup.xml";
    public static final String CUSTOM_RULESPATH_WITH_CUSTOM_TECHNOLOGIES2 = "target/test-classes/custom-rulesets-data/custom-target2-ruleset.windup.xml";

    @ArquillianResource
    private URL contextPath;

    private ConfigurationEndpoint configurationEndpoint;

    @Before
    public void setUp()
    {
        ResteasyClient client = ServiceTestUtil.getResteasyClient();
        ResteasyWebTarget target = client.target(contextPath + ServiceConstants.REST_BASE);

        this.configurationEndpoint = target.proxy(ConfigurationEndpoint.class);
    }

    @Test
    @RunAsClient
    public void testEndpoint()
    {
        Configuration configuration = configurationEndpoint.getGlobalConfiguration();

        RulesPath rulesPath = new RulesPath();
        rulesPath.setPath(FAKE_PATH);
        configuration.setRulesPaths(Collections.singleton(rulesPath));

        configuration = configurationEndpoint.saveConfiguration(configuration.getId(), configuration);

        Assert.assertNotNull(configuration.getRulesPaths());
        Assert.assertEquals(1, configuration.getRulesPaths().size());
        Assert.assertEquals(FAKE_PATH, configuration.getRulesPaths().iterator().next().getPath());
    }

    @Test
    @RunAsClient
    public void testCustomRulesetEndpoint()
    {
        Configuration configuration = configurationEndpoint.getGlobalConfiguration();
        Assert.assertNotNull(configuration);

        RulesPath rulesPath = new RulesPath();
        rulesPath.setPath(CUSTOM_RULESPATH);
        rulesPath.setRulesPathType(PathType.USER_PROVIDED);
        configuration.setRulesPaths(Collections.singleton(rulesPath));

        configuration = configurationEndpoint.saveConfiguration(configuration.getId(), configuration);
        Set<RulesPath> rulesetPaths = configurationEndpoint.getCustomRulesetPaths(configuration.getId());

        Assert.assertNotNull(configuration.getRulesPaths());
        Assert.assertNotNull(rulesetPaths);
        Assert.assertEquals(1, configuration.getRulesPaths().size());
        Assert.assertEquals(1, rulesetPaths.size());
        Assert.assertEquals(CUSTOM_RULESPATH, configuration.getRulesPaths().iterator().next().getPath());
    }
}
