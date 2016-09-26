package org.jboss.windup.web.services.rest;

import java.io.*;
import java.net.URL;
import java.nio.charset.StandardCharsets;
import java.util.*;

import org.apache.commons.codec.digest.DigestUtils;
import org.apache.commons.io.IOUtils;
import org.jboss.arquillian.container.test.api.RunAsClient;
import org.jboss.arquillian.junit.Arquillian;
import org.jboss.arquillian.test.api.ArquillianResource;
import org.jboss.arquillian.warp.WarpTest;
import org.jboss.resteasy.client.jaxrs.ResteasyClient;
import org.jboss.resteasy.client.jaxrs.ResteasyWebTarget;
import org.jboss.resteasy.plugins.providers.RegisterBuiltin;
import org.jboss.resteasy.plugins.providers.multipart.InputPart;
import org.jboss.resteasy.plugins.providers.multipart.MultipartFormDataInput;
import org.jboss.resteasy.plugins.providers.multipart.MultipartFormDataOutput;
import org.jboss.resteasy.spi.ResteasyProviderFactory;
import org.jboss.windup.web.services.data.DataProvider;
import org.jboss.windup.web.services.data.ServiceConstants;
import org.jboss.windup.web.services.model.ApplicationGroup;
import org.jboss.windup.web.services.model.MigrationProject;
import org.jboss.windup.web.services.model.RegisteredApplication;
import org.jboss.windup.web.services.AbstractTest;
import org.junit.Assert;
import org.junit.Before;
import org.junit.BeforeClass;
import org.junit.Test;
import org.junit.runner.RunWith;

import javax.ws.rs.client.Entity;
import javax.ws.rs.core.*;

import static org.mockito.Mockito.*;

/**
 * @author <a href="mailto:jesse.sightler@gmail.com">Jesse Sightler</a>
 */
@WarpTest
@RunWith(Arquillian.class)
public class RegisteredApplicationEndpointTest extends AbstractTest
{

    @ArquillianResource
    private URL contextPath;
    private ResteasyClient client;
    private ResteasyWebTarget target;
    private RegisteredApplicationEndpoint registeredApplicationEndpoint;
    private DataProvider dataProvider;

    @BeforeClass
    public static void setUpClass() throws Exception
    {
        // initializes the rest easy client framework
        RegisterBuiltin.register(ResteasyProviderFactory.getInstance());
    }

    @Before
    public void setUp()
    {
        this.client = getResteasyClient();
        this.target = client.target(contextPath + ServiceConstants.REST_BASE);
        this.dataProvider = new DataProvider(target);

        this.registeredApplicationEndpoint = target.proxy(RegisteredApplicationEndpoint.class);
    }

    @Test
    @RunAsClient
    public void testRegisterApp() throws Exception
    {
        Collection<RegisteredApplication> existingApps = registeredApplicationEndpoint.getRegisteredApplications();
        Assert.assertEquals(0, existingApps.size());

        MigrationProject dummyProject = this.dataProvider.getMigrationProject();
        ApplicationGroup group = this.dataProvider.getApplicationGroup(dummyProject);

        MultipartFormDataOutput uploadData = new MultipartFormDataOutput();
        try (InputStream sampleIS = getClass().getResourceAsStream(DataProvider.TINY_SAMPLE_PATH))
        {
            uploadData.addFormData("file", sampleIS, MediaType.APPLICATION_OCTET_STREAM_TYPE, "sample-tiny.war");

            GenericEntity<MultipartFormDataOutput> entity = new GenericEntity<MultipartFormDataOutput>(uploadData){};
            String registeredAppTargetUri = this.target.getUri() + ServiceConstants.REGISTERED_APP_ENDPOINT + "/appGroup/" + group.getId();
            ResteasyWebTarget registeredAppTarget = this.client.target(registeredAppTargetUri);

            try
            {
                Response response = registeredAppTarget.request().post(Entity.entity(entity, MediaType.MULTIPART_FORM_DATA_TYPE));
                RegisteredApplication application = (RegisteredApplication) response.readEntity(RegisteredApplication.class);// response.getEntity();
                response.close();

                Collection<RegisteredApplication> apps = registeredApplicationEndpoint.getRegisteredApplications();
                Assert.assertEquals(1, apps.size());

                this.assertFileContents(getClass().getResourceAsStream(
                    DataProvider.TINY_SAMPLE_PATH),
                    new FileInputStream(application.getInputPath())
                );

            }
            catch (Throwable t)
            {
                t.printStackTrace();
                throw new RuntimeException("Failed to post application due to: " + t.getMessage() + " exception: " + t.getClass().getName());
            }
        }
    }

    private void assertFileContents(InputStream expected, InputStream actual) throws IOException
    {
        String expectedMd5 = DigestUtils.md5Hex(expected);
        String actualMd5 = DigestUtils.md5Hex(actual);

        Assert.assertEquals("File contents differ!", expectedMd5, actualMd5);
    }
}
