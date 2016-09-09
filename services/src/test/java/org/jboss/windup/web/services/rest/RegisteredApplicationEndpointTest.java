package org.jboss.windup.web.services.rest;

import java.beans.BeanInfo;
import java.beans.Introspector;
import java.beans.PropertyDescriptor;
import java.io.File;
import java.net.URL;
import java.util.Collection;

import org.jboss.arquillian.container.test.api.RunAsClient;
import org.jboss.arquillian.junit.Arquillian;
import org.jboss.arquillian.test.api.ArquillianResource;
import org.jboss.arquillian.warp.WarpTest;
import org.jboss.resteasy.client.jaxrs.ResteasyClient;
import org.jboss.resteasy.client.jaxrs.ResteasyClientBuilder;
import org.jboss.resteasy.client.jaxrs.ResteasyWebTarget;
import org.jboss.resteasy.plugins.providers.RegisterBuiltin;
import org.jboss.resteasy.spi.ResteasyProviderFactory;
import org.jboss.windup.web.services.model.RegisteredApplication;
import org.jboss.windup.web.services.AbstractTest;
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
public class RegisteredApplicationEndpointTest extends AbstractTest
{

    @ArquillianResource
    private URL contextPath;

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
        ResteasyClient client = getResteasyClient();
        ResteasyWebTarget target = client.target(contextPath + "rest");

        this.registeredApplicationEndpoint = target.proxy(RegisteredApplicationEndpoint.class);
    }

    @Test
    @RunAsClient
    public void testRegisterApp() throws Exception
    {
        BeanInfo beanInfo = Introspector.getBeanInfo(RegisteredApplication.class);
        for (PropertyDescriptor propertyDescriptor : beanInfo.getPropertyDescriptors())
        {
            System.out.println("Property name: " + propertyDescriptor.getName());
        }

        Collection<RegisteredApplication> existingApps = registeredApplicationEndpoint.getRegisteredApplications();
        Assert.assertEquals(0, existingApps.size());

        File tempFile1 = File.createTempFile(RegisteredApplicationEndpointTest.class.getSimpleName() + ".1", ".ear");
        File tempFile2 = File.createTempFile(RegisteredApplicationEndpointTest.class.getSimpleName() + ".2", ".ear");

        RegisteredApplication dto1 = new RegisteredApplication(tempFile1.getAbsolutePath());
        RegisteredApplication dto2 = new RegisteredApplication(tempFile2.getAbsolutePath());
        this.registeredApplicationEndpoint.registerApplication(dto1);
        this.registeredApplicationEndpoint.registerApplication(dto2);

        Collection<RegisteredApplication> apps = registeredApplicationEndpoint.getRegisteredApplications();
        Assert.assertEquals(2, apps.size());
        boolean foundPath1 = false;
        boolean foundPath2 = false;

        for (RegisteredApplication app : apps)
        {
            if (app.getInputPath().equals(tempFile1.getAbsolutePath()))
                foundPath1 = true;
            else if (app.getInputPath().equals(tempFile2.getAbsolutePath()))
                foundPath2 = true;
        }

        Assert.assertTrue(foundPath1);
        Assert.assertTrue(foundPath2);
    }
}
