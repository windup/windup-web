package org.jboss.windup.web.services.rest;

import org.jboss.arquillian.container.test.api.RunAsClient;
import org.jboss.arquillian.junit.Arquillian;
import org.jboss.arquillian.test.api.ArquillianResource;
import org.jboss.resteasy.client.jaxrs.ResteasyClient;
import org.jboss.resteasy.client.jaxrs.ResteasyWebTarget;
import org.jboss.windup.web.services.AbstractTest;
import org.jboss.windup.web.services.ServiceTestUtil;
import org.jboss.windup.web.services.data.ServiceConstants;
import org.jboss.windup.web.services.model.MigrationPath;
import org.junit.Assert;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;

import java.net.URL;
import java.util.Collection;

/**
 * @author <a href="mailto:jesse.sightler@gmail.com">Jesse Sightler</a>
 */
@RunWith(Arquillian.class)
public class MigrationPathEndpointTest extends AbstractTest
{
    @ArquillianResource
    private URL contextPath;

    private MigrationPathEndpoint migrationPathEndpoint;

    @Before
    public void setUp()
    {
        ResteasyClient client = ServiceTestUtil.getResteasyClient();
        ResteasyWebTarget target = client.target(contextPath + ServiceConstants.REST_BASE);

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
        boolean foundWebSphereToEAP6 = false;
        for (MigrationPath migrationPath : paths)
        {
            if (migrationPath.getName().equals("Migration to JBoss EAP 6")) {
                Assert.assertEquals(100L, (long)migrationPath.getId());
                Assert.assertNull(migrationPath.getSource());
                Assert.assertEquals("eap", migrationPath.getTarget().getName());
                Assert.assertEquals("[6]", migrationPath.getTarget().getVersionRange());

                foundAnythingToEAP6 = true;
            } else if (migrationPath.getName().equals("Migration from IBM WebSphere to Red Hat JBoss EAP 6"))
            {
                Assert.assertEquals(300L, (long)migrationPath.getId());
                Assert.assertEquals("websphere", migrationPath.getSource().getName());
                Assert.assertNull(migrationPath.getSource().getVersionRange());

                Assert.assertEquals("eap", migrationPath.getTarget().getName());
                Assert.assertEquals("[6]", migrationPath.getTarget().getVersionRange());

                foundWebSphereToEAP6 = true;
            }
        }
        Assert.assertTrue(foundAnythingToEAP6);
        Assert.assertTrue(foundWebSphereToEAP6);
    }
}
