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
import org.jboss.windup.web.services.model.ApplicationGroup;
import org.jboss.windup.web.services.model.RegisteredApplication;
import org.jboss.windup.web.services.AbstractTest;
import org.jboss.windup.web.services.dto.ProgressStatusDto;
import org.junit.Assert;
import org.junit.Before;
import org.junit.BeforeClass;
import org.junit.Test;
import org.junit.runner.RunWith;

import java.net.URL;
import java.nio.file.Paths;
import java.util.Collections;

/**
 * @author <a href="mailto:jesse.sightler@gmail.com">Jesse Sightler</a>
 */
@WarpTest
@RunWith(Arquillian.class)
public class WindupEndpointTest extends AbstractTest
{
    @ArquillianResource
    private URL contextPath;

    private ApplicationGroupEndpoint applicationGroupEndpoint;
    private RegisteredApplicationEndpoint registeredApplicationEndpoint;

    private WindupEndpoint windupEndpoint;

    @BeforeClass
    public static void setUpClass() throws Exception
    {
        // initializes the rest easy client framework
        RegisterBuiltin.register(ResteasyProviderFactory.getInstance());
    }

    @Before
    public void setUp()
    {
        ResteasyClient client = new ResteasyClientBuilder().register(FrameUnmarshaller.class).build();
        ResteasyWebTarget target = client.target(contextPath + "rest");

        this.applicationGroupEndpoint = target.proxy(ApplicationGroupEndpoint.class);
        this.registeredApplicationEndpoint = target.proxy(RegisteredApplicationEndpoint.class);
        this.windupEndpoint = target.proxy(WindupEndpoint.class);
    }

    @Test
    @RunAsClient
    public void testExecutionGroup() throws Exception
    {
        String inputPath = Paths.get("src/main/java").toAbsolutePath().normalize().toString();

        RegisteredApplication input = new RegisteredApplication();
        input.setInputPath(inputPath);

        input = this.registeredApplicationEndpoint.registerApplication(input);
        System.out.println("Registered application: " + input);

        ApplicationGroup group = new ApplicationGroup();
        group.setTitle("Group");
        group.setApplications(Collections.singleton(input));
        group = applicationGroupEndpoint.create(group);

        this.windupEndpoint.executeGroup(group.getId());

        ProgressStatusDto status = this.windupEndpoint.getStatus(group.getId());
        int loops = 0;
        long beginTime = System.currentTimeMillis();
        do {
            loops++;
            Thread.sleep(25);

            status = this.windupEndpoint.getStatus(group.getId());
            System.out.println("Status: " + status);

            if ((System.currentTimeMillis() - beginTime) > (1000L * 240L)) {
                // taking too long... fail
                Assert.fail("Processing never completed. Current status: " + status);
            }
        } while (!status.isCompleted());

        Assert.assertFalse(status.isFailed());
        Assert.assertTrue(status.isCompleted());
        Assert.assertTrue(loops > 1);
        Assert.assertTrue(status.getTotalWork() > 10);
        Assert.assertTrue(status.getWorkCompleted() > 9);
    }
}
