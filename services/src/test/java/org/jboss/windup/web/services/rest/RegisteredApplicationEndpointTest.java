package org.jboss.windup.web.services.rest;

import java.io.ByteArrayInputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.InputStream;
import java.net.URL;
import java.nio.charset.StandardCharsets;
import java.util.Collection;

import javax.ws.rs.client.Entity;
import javax.ws.rs.core.GenericEntity;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import org.apache.http.HttpStatus;
import org.jboss.arquillian.container.test.api.RunAsClient;
import org.jboss.arquillian.junit.Arquillian;
import org.jboss.arquillian.test.api.ArquillianResource;
import org.jboss.resteasy.client.jaxrs.ResteasyClient;
import org.jboss.resteasy.client.jaxrs.ResteasyWebTarget;
import org.jboss.resteasy.plugins.providers.RegisterBuiltin;
import org.jboss.resteasy.plugins.providers.multipart.MultipartFormDataOutput;
import org.jboss.resteasy.spi.ResteasyProviderFactory;
import org.jboss.windup.web.services.AbstractTest;
import org.jboss.windup.web.services.data.DataProvider;
import org.jboss.windup.web.services.data.ServiceConstants;
import org.jboss.windup.web.services.model.ApplicationGroup;
import org.jboss.windup.web.services.model.MigrationProject;
import org.jboss.windup.web.services.model.RegisteredApplication;
import org.junit.Assert;
import org.junit.Before;
import org.junit.BeforeClass;
import org.junit.Test;
import org.junit.runner.RunWith;

/**
 * @author <a href="mailto:jesse.sightler@gmail.com">Jesse Sightler</a>
 */
@RunWith(Arquillian.class)
public class RegisteredApplicationEndpointTest extends AbstractTest
{

    @ArquillianResource
    private URL contextPath;
    private ResteasyClient client;
    private ResteasyWebTarget target;
    private RegisteredApplicationEndpoint registeredApplicationEndpoint;
    private DataProvider dataProvider;

    private ApplicationGroup group;

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

        MigrationProject dummyProject = this.dataProvider.getMigrationProject();
        this.group = this.dataProvider.getApplicationGroup(dummyProject);
    }

    @Test
    @RunAsClient
    public void testRegisterAppByPath() throws Exception
    {
        Collection<RegisteredApplication> existingApps = registeredApplicationEndpoint.getRegisteredApplications();
        Assert.assertEquals(0, existingApps.size());

        File tempFile1 = File.createTempFile(RegisteredApplicationEndpointTest.class.getSimpleName() + ".1", ".ear");
        File tempFile2 = File.createTempFile(RegisteredApplicationEndpointTest.class.getSimpleName() + ".2", ".ear");

        MigrationProject project = this.dataProvider.getMigrationProject();
        ApplicationGroup group = this.dataProvider.getApplicationGroup(project);

        RegisteredApplication dto1 = new RegisteredApplication(tempFile1.getAbsolutePath());
        RegisteredApplication dto2 = new RegisteredApplication(tempFile2.getAbsolutePath());
        this.registeredApplicationEndpoint.registerApplicationByPath(group.getId(), dto1);
        this.registeredApplicationEndpoint.registerApplicationByPath(group.getId(), dto2);

        try
        {
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
        finally
        {
            for (RegisteredApplication application : registeredApplicationEndpoint.getRegisteredApplications())
            {
                registeredApplicationEndpoint.unregister(application.getId());
            }
        }
    }

    @Test
    @RunAsClient
    public void testRegisterAppUpload() throws Exception
    {
        Collection<RegisteredApplication> existingApps = registeredApplicationEndpoint.getRegisteredApplications();
        Assert.assertEquals(0, existingApps.size());

        try (InputStream sampleIS = getClass().getResourceAsStream(DataProvider.TINY_SAMPLE_PATH))
        {
            String fileName = "sample-tiny.war";
            String registeredAppTargetUri = this.target.getUri() + ServiceConstants.REGISTERED_APP_ENDPOINT + "/appGroup/" + group.getId();
            ResteasyWebTarget registeredAppTarget = this.client.target(registeredAppTargetUri);

            try
            {
                Entity entity = this.dataProvider.getMultipartFormDataEntity(sampleIS, fileName);
                Response response = registeredAppTarget.request().post(entity);
                RegisteredApplication application = response.readEntity(RegisteredApplication.class);
                response.close();

                Collection<RegisteredApplication> apps = registeredApplicationEndpoint.getRegisteredApplications();
                Assert.assertEquals(1, apps.size());

                Assert.assertEquals(fileName, application.getTitle());
                this.assertFileExists(application.getInputPath());

                this.assertFileContentsAreEqual(getClass().getResourceAsStream(
                            DataProvider.TINY_SAMPLE_PATH),
                            new FileInputStream(application.getInputPath()));
            }
            catch (Throwable t)
            {
                t.printStackTrace();
                throw new RuntimeException("Failed to post application due to: " + t.getMessage() + " exception: " + t.getClass().getName());
            }
            finally
            {
                for (RegisteredApplication application : registeredApplicationEndpoint.getRegisteredApplications())
                {
                    registeredApplicationEndpoint.unregister(application.getId());
                }
            }
        }
    }

    @Test
    @RunAsClient
    public void testEditApp() throws Exception
    {
        RegisteredApplication dummyApp = this.dataProvider.getApplication(this.group);

        try (InputStream sampleIs = new ByteArrayInputStream("Hello World!".getBytes(StandardCharsets.UTF_8)))
        {
            String newFileName = "new-file.jar";
            Entity entity = this.dataProvider.getMultipartFormDataEntity(sampleIs, newFileName);

            String registeredAppTargetUri = this.target.getUri() + ServiceConstants.REGISTERED_APP_ENDPOINT + "/" + dummyApp.getId();
            ResteasyWebTarget registeredAppTarget = this.client.target(registeredAppTargetUri);

            Response response = registeredAppTarget.request().put(entity);
            RegisteredApplication updatedApp = response.readEntity(RegisteredApplication.class);
            response.close();

            Assert.assertEquals(HttpStatus.SC_OK, response.getStatus());

            File oldFile = new File(dummyApp.getInputPath());
            File newFile = new File(updatedApp.getInputPath());

            Assert.assertFalse("Old app file should get deleted", oldFile.exists());
            Assert.assertTrue("New app file should be created", newFile.exists());

            sampleIs.reset();
            this.assertFileContentsAreEqual(sampleIs, new FileInputStream(updatedApp.getInputPath()));

            Assert.assertEquals(newFileName, updatedApp.getTitle());
        }
        finally
        {
            for (RegisteredApplication application : registeredApplicationEndpoint.getRegisteredApplications())
            {
                registeredApplicationEndpoint.unregister(application.getId());
            }
        }
    }

    @Test
    @RunAsClient
    public void testDeleteApp() throws Exception
    {
        RegisteredApplication dummyApp = this.dataProvider.getApplication(this.group);

        String registeredAppTargetUri = this.target.getUri() + ServiceConstants.REGISTERED_APP_ENDPOINT + "/" + dummyApp.getId();
        ResteasyWebTarget registeredAppTarget = this.client.target(registeredAppTargetUri);

        Response response = registeredAppTarget.request().delete();
        response.close();

        Assert.assertEquals(HttpStatus.SC_NO_CONTENT, response.getStatus());
        this.assertFileDoesNotExist(dummyApp.getInputPath());
    }

    public void testRegisterAppWithoutFile() throws Exception
    {
        MultipartFormDataOutput uploadData = new MultipartFormDataOutput();
        GenericEntity<MultipartFormDataOutput> genericEntity = new GenericEntity<MultipartFormDataOutput>(uploadData)
        {
        };
        Entity entity = Entity.entity(genericEntity, MediaType.MULTIPART_FORM_DATA_TYPE);

        String registeredAppTargetUri = this.target.getUri() + ServiceConstants.REGISTERED_APP_ENDPOINT + "/appGroup/" + group.getId();
        ResteasyWebTarget registeredAppTarget = this.client.target(registeredAppTargetUri);

        Response response = registeredAppTarget.request().post(entity);
        response.close();

        Assert.assertEquals(HttpStatus.SC_BAD_REQUEST, response.getStatus());
    }

    public void testEditAppWithoutFile() throws Exception
    {
        RegisteredApplication app = this.dataProvider.getApplication(this.group);

        MultipartFormDataOutput uploadData = new MultipartFormDataOutput();
        GenericEntity<MultipartFormDataOutput> genericEntity = new GenericEntity<MultipartFormDataOutput>(uploadData)
        {
        };
        Entity entity = Entity.entity(genericEntity, MediaType.MULTIPART_FORM_DATA_TYPE);

        String registeredAppTargetUri = this.target.getUri() + ServiceConstants.REGISTERED_APP_ENDPOINT + "/" + app.getId();
        ResteasyWebTarget registeredAppTarget = this.client.target(registeredAppTargetUri);

        Response response = registeredAppTarget.request().put(entity);
        response.close();

        Assert.assertEquals(HttpStatus.SC_BAD_REQUEST, response.getStatus());
    }

    public void testEditNonExistingApp() throws Exception
    {
        Integer nonExistingAppId = 0;

        try (InputStream sampleIs = new ByteArrayInputStream("Hello World!".getBytes(StandardCharsets.UTF_8)))
        {
            String newFileName = "new-file.jar";
            Entity entity = this.dataProvider.getMultipartFormDataEntity(sampleIs, newFileName);

            String registeredAppTargetUri = this.target.getUri() + ServiceConstants.REGISTERED_APP_ENDPOINT + "/" + nonExistingAppId;
            ResteasyWebTarget registeredAppTarget = this.client.target(registeredAppTargetUri);

            Response response = registeredAppTarget.request().put(entity);
            response.close();

            Assert.assertEquals(HttpStatus.SC_NOT_FOUND, response.getStatus());
        }
    }

    public void testDeleteNonExistingApp() throws Exception
    {
        Integer nonExistingAppId = 0;
        String registeredAppTargetUri = this.target.getUri() + ServiceConstants.REGISTERED_APP_ENDPOINT + "/" + nonExistingAppId;
        ResteasyWebTarget registeredAppTarget = this.client.target(registeredAppTargetUri);

        Response response = registeredAppTarget.request().delete();
        response.close();

        Assert.assertEquals(HttpStatus.SC_NOT_FOUND, response.getStatus());
    }
}
