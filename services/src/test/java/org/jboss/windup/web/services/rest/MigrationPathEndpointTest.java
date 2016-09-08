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
import org.jboss.windup.web.services.model.MigrationPath;
import org.junit.Assert;
import org.junit.Before;
import org.junit.BeforeClass;
import org.junit.Test;
import org.junit.runner.RunWith;

import java.net.URL;
import java.util.Collection;

/**
 * @author <a href="mailto:jesse.sightler@gmail.com">Jesse Sightler</a>
 */
@WarpTest
@RunWith(Arquillian.class)
public class MigrationPathEndpointTest extends AbstractTest
{
    @ArquillianResource
    private URL contextPath;

    private MigrationPathEndpoint migrationPathEndpoint;

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

        this.migrationPathEndpoint = target.proxy(MigrationPathEndpoint.class);
    }

    @Test
    @RunAsClient
    public void testFindAll()
    {
        Collection<MigrationPath> paths = this.migrationPathEndpoint.getAvailablePaths();

        // Make sure we load the same list consistently
        Collection<MigrationPath> paths2 = this.migrationPathEndpoint.getAvailablePaths();

        // Confirm the sizes match
        Assert.assertEquals(paths.size(), paths2.size());

        // List should have at least two items
        Assert.assertTrue(paths.size() > 2);

        boolean foundAnythingToEAP6 = false;
        boolean foundWebSphereToEAP7 = false;
        for (MigrationPath migrationPath : paths)
        {
            if (migrationPath.getName().equals("Anything to EAP 6")) {
                Assert.assertEquals(100L, (long)migrationPath.getId());
                Assert.assertNull(migrationPath.getSource());
                Assert.assertEquals("eap", migrationPath.getTarget().getName());
                Assert.assertEquals("[6]", migrationPath.getTarget().getVersionRange());

                foundAnythingToEAP6 = true;
            } else if (migrationPath.getName().equals("WebSphere to EAP 7"))
            {
                Assert.assertEquals(301L, (long)migrationPath.getId());
                Assert.assertEquals("websphere", migrationPath.getSource().getName());
                Assert.assertNull(migrationPath.getSource().getVersionRange());

                Assert.assertEquals("eap", migrationPath.getTarget().getName());
                Assert.assertEquals("[7]", migrationPath.getTarget().getVersionRange());

                foundWebSphereToEAP7 = true;
            }
        }
        Assert.assertTrue(foundAnythingToEAP6);
        Assert.assertTrue(foundWebSphereToEAP7);
    }
}
