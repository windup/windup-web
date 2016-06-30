package org.jboss.windup.web.services.rest;

import java.io.File;
import java.net.URL;
import java.util.Collections;

import com.google.common.collect.Iterables;
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
import org.jboss.windup.web.services.dto.ApplicationGroupDto;
import org.jboss.windup.web.services.dto.RegisteredApplicationDto;
import org.junit.Assert;
import org.junit.Before;
import org.junit.BeforeClass;
import org.junit.Test;
import org.junit.runner.RunWith;

/**
 * @author <a href="mailto:jesse.sightler@gmail.com">Jesse Sightler</a>
 */
@WarpTest
@RunWith(Arquillian.class)
public class ApplicationGroupEndpointTest extends AbstractTest
{
    @ArquillianResource
    private URL contextPath;

    private ApplicationGroupEndpoint applicationGroupEndpoint;
    private RegisteredApplicationEndpoint registeredApplicationEndpoint;

    @BeforeClass
    public static void setUpClass() throws Exception
    {
        // initializes the rest easy client framework
        RegisterBuiltin.register(ResteasyProviderFactory.getInstance());
    }

    @Before
    public void setUp()
    {
        ResteasyClient client = new ResteasyClientBuilder().register(FrameUnmarshaller.class).register(FrameMarshaller.class).build();
        ResteasyWebTarget target = client.target(contextPath + "rest");

        this.applicationGroupEndpoint = target.proxy(ApplicationGroupEndpoint.class);
        this.registeredApplicationEndpoint = target.proxy(RegisteredApplicationEndpoint.class);
    }

    @Test
    @RunAsClient
    public void testCreateGroup() throws Exception
    {
        String groupName = "MyTestGroup";
        ApplicationGroupDto registered = this.applicationGroupEndpoint.register(groupName);

        Assert.assertEquals(groupName, registered.getGroup().getName());
    }

    @Test
    @RunAsClient
    public void testRetrieveGroup() throws Exception
    {
        String groupName = "MyTestGroup2";
        ApplicationGroupDto registered = this.applicationGroupEndpoint.register(groupName);

        Assert.assertEquals(groupName, registered.getGroup().getName());

        ApplicationGroupDto reloaded = this.applicationGroupEndpoint.get((Integer) registered.getGroup().asVertex().getId());
        Assert.assertEquals(groupName, reloaded.getGroup().getName());
    }

    @Test
    @RunAsClient
    public void testAddApplications() throws Exception
    {
        String groupName = "MyTestGroup3";
        ApplicationGroupDto registered = this.applicationGroupEndpoint.register(groupName);

        File tempFile1 = File.createTempFile(RegisteredApplicationEndpointTest.class.getSimpleName() + ".1", ".ear");

        try
        {
            RegisteredApplicationDto application = new RegisteredApplicationDto(tempFile1.getAbsolutePath());
            application = this.registeredApplicationEndpoint.registerApplication(application);

            registered.setRegisteredApplications(Collections.singleton(application));

            this.applicationGroupEndpoint.update(registered);

            ApplicationGroupDto updated = this.applicationGroupEndpoint.get((Integer)registered.getGroup().asVertex().getId());

        }
        finally
        {
            tempFile1.delete();
        }
    }
}
