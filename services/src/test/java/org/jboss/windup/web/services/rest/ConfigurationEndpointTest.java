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
import org.jboss.windup.web.services.model.RulesPath;
import org.junit.Assert;
import org.junit.Before;
import org.junit.BeforeClass;
import org.junit.Test;
import org.junit.runner.RunWith;

import java.net.URL;
import java.util.Collections;

/**
 * @author <a href="mailto:jesse.sightler@gmail.com">Jesse Sightler</a>
 */
@RunWith(Arquillian.class)
@WarpTest
public class ConfigurationEndpointTest extends AbstractTest
{
    public static final String FAKE_PATH = "./target/classes/";
    @ArquillianResource
    private URL contextPath;

    private ConfigurationEndpoint configurationEndpoint;

    @BeforeClass
    public static void setUpClass() throws Exception
    {
        // initializes the rest easy client framework
        RegisterBuiltin.register(ResteasyProviderFactory.getInstance());
    }

    @Before
    public void setUp()
    {
        ResteasyClient client = getResteasyClient();
        ResteasyWebTarget target = client.target(contextPath + "rest");

        this.configurationEndpoint = target.proxy(ConfigurationEndpoint.class);
    }

    @Test
    @RunAsClient
    public void testEndpoint()
    {
        Configuration configuration = configurationEndpoint.getConfiguration();

        RulesPath rulesPath = new RulesPath();
        rulesPath.setPath(FAKE_PATH);
        configuration.setRulesPaths(Collections.singleton(rulesPath));

        configuration = configurationEndpoint.saveConfiguration(configuration);

        Assert.assertNotNull(configuration.getRulesPaths());
        Assert.assertEquals(1, configuration.getRulesPaths().size());
        Assert.assertEquals(FAKE_PATH, configuration.getRulesPaths().iterator().next().getPath());
    }
}
