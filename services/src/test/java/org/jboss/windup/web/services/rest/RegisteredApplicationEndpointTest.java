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
import org.jboss.resteasy.plugins.providers.multipart.MultipartFormDataOutput;
import org.jboss.windup.web.services.AbstractTest;
import org.jboss.windup.web.services.ServiceTestUtil;
import org.jboss.windup.web.services.data.DataProvider;
import org.jboss.windup.web.services.data.ServiceConstants;
import org.jboss.windup.web.services.model.MigrationProject;
import org.jboss.windup.web.services.model.RegisteredApplication;
import org.junit.Assert;
import org.junit.Before;
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

    private MigrationProject project;

    @Before
    public void setUp()
    {
        this.client = ServiceTestUtil.getResteasyClient();
        this.target = client.target(contextPath + ServiceConstants.REST_BASE);
        this.dataProvider = new DataProvider(target);

        this.registeredApplicationEndpoint = target.proxy(RegisteredApplicationEndpoint.class);

        this.project = this.dataProvider.getMigrationProject();
    }


    @Test
    @RunAsClient
    public void testGetAppFromProject() throws Exception
    {
        try
        {
            final MigrationProject project = this.dataProvider.getMigrationProject();
            RegisteredApplication dummyApp = this.dataProvider.getApplication(project);

            Collection<RegisteredApplication> existingApps = registeredApplicationEndpoint.getProjectApplications(project.getId());

            Assert.assertNotEquals(0, existingApps.size());
            Assert.assertEquals("App ID matches", dummyApp.getId(), existingApps.iterator().next().getId());
        }
        finally
        {
            for (RegisteredApplication application : registeredApplicationEndpoint.getAllApplications())
            {
                registeredApplicationEndpoint.deleteApplication(application.getId());
            }
        }
    }

    @Test
    @RunAsClient
    public void testReuploadApp() throws Exception
    {
        RegisteredApplication dummyApp = this.dataProvider.getApplication(this.project);

        try (InputStream sampleIs = new ByteArrayInputStream("Hello World!".getBytes(StandardCharsets.UTF_8)))
        {
            String newFileName = "new-file.jar";
            Entity entity = this.dataProvider.getMultipartFormDataEntity(sampleIs, newFileName);

            ResteasyWebTarget registeredAppTarget = getResteasyWebTarget(dummyApp.getId(), "reupload");

            Response response = registeredAppTarget.request().put(entity);
            response.bufferEntity();
            String stringEntity = response.readEntity(String.class);
            RegisteredApplication updatedApp = response.readEntity(RegisteredApplication.class);
            response.close();

            Assert.assertEquals(HttpStatus.SC_OK, response.getStatus());

            File oldFile = new File(dummyApp.getInputPath());
            File newFile = new File(updatedApp.getInputPath());

            Assert.assertFalse("Old app file should get deleted", oldFile.exists());
            Assert.assertTrue("New app file should be created", newFile.exists());

            sampleIs.reset();
            ServiceTestUtil.assertFileContentsAreEqual(sampleIs, new FileInputStream(updatedApp.getInputPath()));

            Assert.assertEquals(newFileName, updatedApp.getTitle());
        }
        finally
        {
            for (RegisteredApplication application : registeredApplicationEndpoint.getAllApplications())
            {
                registeredApplicationEndpoint.deleteApplication(application.getId());
            }
        }
    }

    @Test
    @RunAsClient
    public void testDeleteApp() throws Exception
    {
        RegisteredApplication dummyApp = this.dataProvider.getApplication(this.project);

        ResteasyWebTarget registeredAppTarget = getResteasyWebTarget(dummyApp.getId());

        Response response = registeredAppTarget.request().delete();
        response.close();

        Assert.assertEquals(HttpStatus.SC_NO_CONTENT, response.getStatus());
        ServiceTestUtil.assertFileDoesNotExist(dummyApp.getInputPath());
    }

    private ResteasyWebTarget getResteasyWebTarget(Long appId)
    {
        return this.getResteasyWebTarget(appId, "");
    }

    private ResteasyWebTarget getResteasyWebTarget(Long appId, String resource)
    {
        String registeredAppTargetUri = this.target.getUri() + RegisteredApplicationEndpoint.REGISTERED_APPLICATIONS + "/" + appId;

        if (!resource.isEmpty())
        {
            registeredAppTargetUri += "/"  + resource;
        }

        return this.client.target(registeredAppTargetUri);
    }

    @Test
    @RunAsClient
    public void testReuploadAppWithoutFile() throws Exception
    {
        RegisteredApplication app = this.dataProvider.getApplication(this.project);

        MultipartFormDataOutput uploadData = new MultipartFormDataOutput();
        GenericEntity<MultipartFormDataOutput> genericEntity = new GenericEntity<MultipartFormDataOutput>(uploadData)
        {
        };
        Entity entity = Entity.entity(genericEntity, MediaType.MULTIPART_FORM_DATA_TYPE);

        ResteasyWebTarget registeredAppTarget = getResteasyWebTarget(app.getId(), "reupload");

        Response response = registeredAppTarget.request().put(entity);
        response.close();

        Assert.assertEquals(HttpStatus.SC_BAD_REQUEST, response.getStatus());
    }

    @Test
    @RunAsClient
    public void testEditReuploadNonExistingApp() throws Exception
    {
        Long nonExistingAppId = 0L;

        try (InputStream sampleIs = new ByteArrayInputStream("Hello World!".getBytes(StandardCharsets.UTF_8)))
        {
            String newFileName = "new-file.jar";
            Entity entity = this.dataProvider.getMultipartFormDataEntity(sampleIs, newFileName);

            ResteasyWebTarget registeredAppTarget = this.getResteasyWebTarget(nonExistingAppId, "reupload");

            Response response = registeredAppTarget.request().put(entity);
            response.close();

            Assert.assertEquals(HttpStatus.SC_NOT_FOUND, response.getStatus());
        }
    }

    @Test
    @RunAsClient
    public void testDeleteNonExistingApp() throws Exception
    {
        Long nonExistingAppId = 0L;
        ResteasyWebTarget registeredAppTarget = this.getResteasyWebTarget(nonExistingAppId);

        Response response = registeredAppTarget.request().delete();
        response.close();

        Assert.assertEquals(HttpStatus.SC_NOT_FOUND, response.getStatus());
    }
}
