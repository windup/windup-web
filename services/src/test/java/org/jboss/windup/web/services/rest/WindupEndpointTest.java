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
import org.junit.Before;
import org.junit.BeforeClass;
import org.junit.Test;
import org.junit.runner.RunWith;

import java.net.URL;

/**
 * @author <a href="mailto:jesse.sightler@gmail.com">Jesse Sightler</a>
 */
@WarpTest
@RunWith(Arquillian.class)
public class WindupEndpointTest extends AbstractTest
{
    @ArquillianResource
    private URL contextPath;

    private RegisteredApplicationEndpoint registeredApplicationEndpoint;

    @BeforeClass
    public static void setUpClass()
    {
        // initializes the rest easy client framework
        RegisterBuiltin.register(ResteasyProviderFactory.getInstance());
    }

    @Before
    public void setUp()
    {
        ResteasyClient client = new ResteasyClientBuilder().build();
        ResteasyWebTarget target = client.target(contextPath + "rest");

        this.registeredApplicationEndpoint = target.proxy(RegisteredApplicationEndpoint.class);
    }

    @Test
    @RunAsClient
    public void testExecution()
    {
    }
}
