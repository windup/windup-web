package org.jboss.windup.web.services.rest;

import java.io.File;
import java.net.URL;

import org.jboss.arquillian.container.test.api.RunAsClient;
import org.jboss.arquillian.junit.Arquillian;
import org.jboss.arquillian.test.api.ArquillianResource;
import org.jboss.resteasy.client.jaxrs.ResteasyClient;
import org.jboss.resteasy.client.jaxrs.ResteasyWebTarget;
import org.jboss.resteasy.plugins.providers.RegisterBuiltin;
import org.jboss.resteasy.spi.ResteasyProviderFactory;
import org.jboss.windup.web.services.AbstractTest;
import org.jboss.windup.web.services.ServiceTestUtil;
import org.jboss.windup.web.services.data.ServiceConstants;
import org.junit.Assert;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;


/**
 * @author <a href="mailto:jesse.sightler@gmail.com">Jesse Sightler</a>
 */
@RunWith(Arquillian.class)
public class FileEndpointTest extends AbstractTest
{

    @ArquillianResource
    private URL contextPath;

    private FileEndpoint fileEndpoint;

    @Before
    public void setUp() throws Exception
    {
        ResteasyClient client = ServiceTestUtil.getResteasyClient();
        ResteasyWebTarget target = client.target(contextPath + ServiceConstants.REST_BASE);

        this.fileEndpoint = target.proxy(FileEndpoint.class);
    }

    @Test
    @RunAsClient
    public void testFileExists() throws Exception
    {
        File file = File.createTempFile(FileEndpointTest.class.getSimpleName(), "testfile");
        try
        {
            Assert.assertTrue(fileEndpoint.pathExists(file.toString()));

            Assert.assertFalse(fileEndpoint.pathExists("filedoesntexist.notthere"));
        }
        finally
        {
            file.delete();
        }
    }
}
