package org.jboss.windup.web.services.rest;

import java.io.ByteArrayInputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.InputStream;
import java.io.StringReader;
import java.net.URL;
import java.nio.charset.StandardCharsets;
import java.util.List;
import javax.json.Json;

import javax.ws.rs.client.Entity;
import javax.ws.rs.core.GenericEntity;
import javax.ws.rs.core.GenericType;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.xml.bind.annotation.XmlList;

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
import org.junit.Ignore;
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
    @Ignore
    public void testGetAppFromProject() throws Exception
    {
        RegisteredApplication dummyApp = this.dataProvider.getApplication(this.project);

        String uri = this.target.getUri() + RegisteredApplicationEndpoint.REGISTERED_APPLICATIONS;
        ResteasyWebTarget target = this.client.target(uri).queryParam("projectId", this.project.getId());
        Response response = target.request().get();
        response.close();
        Assert.assertEquals(HttpStatus.SC_OK, response.getStatus());

        //String json = response.readEntity(String.class);
        //Json.createParser(new StringReader(json)).;
        List<RegisteredApplication> apps = response.readEntity(new GenericType<List<RegisteredApplication>>(){});
        Assert.assertEquals("App ID matches", dummyApp.getId(), apps.get(0).getId());
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
            for (RegisteredApplication application : registeredApplicationEndpoint.getAllApplications(null))
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
