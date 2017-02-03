package org.jboss.windup.web.services.rest;

import java.io.File;
import java.io.FileInputStream;
import java.io.InputStream;
import java.net.URL;
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
public class MigrationProjectRegisteredApplicationsEndpointTest extends AbstractTest
{

    @ArquillianResource
    private URL contextPath;
    private ResteasyClient client;
    private ResteasyWebTarget target;
    private MigrationProjectRegisteredApplicationsEndpoint migrationProjectRegisteredApplicationsEndpoint;
    private RegisteredApplicationEndpoint registeredApplicationEndpoint;
    private DataProvider dataProvider;

    private MigrationProject dummyProject;

    @Before
    public void setUp()
    {
        this.client = ServiceTestUtil.getResteasyClient();
        this.target = client.target(contextPath + ServiceConstants.REST_BASE);
        this.dataProvider = new DataProvider(target);

        this.migrationProjectRegisteredApplicationsEndpoint = target.proxy(MigrationProjectRegisteredApplicationsEndpoint.class);
    }

    @Test
    @RunAsClient
    public void testRegisterAppByPath() throws Exception
    {
        Collection<RegisteredApplication> existingApps = registeredApplicationEndpoint.getAllApplications();
        Assert.assertEquals(0, existingApps.size());

        File tempFile1 = File.createTempFile(RegisteredApplicationEndpointTest.class.getSimpleName() + ".1", ".ear");
        File tempFile2 = File.createTempFile(RegisteredApplicationEndpointTest.class.getSimpleName() + ".2", ".ear");

        MigrationProject project = this.dataProvider.getMigrationProject();

        RegisteredApplication dto1 = new RegisteredApplication(tempFile1.getAbsolutePath());
        RegisteredApplication dto2 = new RegisteredApplication(tempFile2.getAbsolutePath());
        this.migrationProjectRegisteredApplicationsEndpoint.registerApplicationByPath(project.getId(), dto1);
        this.migrationProjectRegisteredApplicationsEndpoint.registerApplicationByPath(project.getId(), dto2);

        try
        {
            Collection<RegisteredApplication> apps = registeredApplicationEndpoint.getAllApplications();
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
            for (RegisteredApplication application : registeredApplicationEndpoint.getAllApplications())
            {
                registeredApplicationEndpoint.deleteApplication(application.getId());
            }
        }
    }

    @Test
    @RunAsClient
    public void testRegisterAppUpload() throws Exception
    {
        Collection<RegisteredApplication> existingApps = registeredApplicationEndpoint.getAllApplications();
        Assert.assertEquals(0, existingApps.size());

        try (InputStream sampleIS = getClass().getResourceAsStream(DataProvider.TINY_SAMPLE_PATH))
        {
            String fileName = "sample-tiny.war";
            String registeredAppTargetUri = this.target.getUri() + MigrationProjectRegisteredApplicationsEndpoint.PROJECT_APPLICATIONS
                    .replace("{projectId}", dummyProject.getId().toString());
            ResteasyWebTarget registeredAppTarget = this.client.target(registeredAppTargetUri);

            try
            {
                Entity entity = this.dataProvider.getMultipartFormDataEntity(sampleIS, fileName);
                Response response = registeredAppTarget.request().post(entity);
                RegisteredApplication application = response.readEntity(RegisteredApplication.class);
                response.close();

                Collection<RegisteredApplication> apps = registeredApplicationEndpoint.getAllApplications();
                Assert.assertEquals(1, apps.size());

                Assert.assertEquals(fileName, application.getTitle());
                ServiceTestUtil.assertFileExists(application.getInputPath());

                ServiceTestUtil.assertFileContentsAreEqual(getClass().getResourceAsStream(
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
                for (RegisteredApplication application : registeredApplicationEndpoint.getAllApplications())
                {
                    registeredApplicationEndpoint.deleteApplication(application.getId());
                }
            }
        }
    }

    public void testRegisterAppWithoutFile() throws Exception
    {
        MultipartFormDataOutput uploadData = new MultipartFormDataOutput();
        GenericEntity<MultipartFormDataOutput> genericEntity = new GenericEntity<MultipartFormDataOutput>(uploadData)
        {
        };
        Entity entity = Entity.entity(genericEntity, MediaType.MULTIPART_FORM_DATA_TYPE);

        String registeredAppTargetUri = this.target.getUri() + MigrationProjectRegisteredApplicationsEndpoint.PROJECT_APPLICATIONS
                .replace("{projectId}", dummyProject.getId().toString());
        ResteasyWebTarget registeredAppTarget = this.client.target(registeredAppTargetUri);

        Response response = registeredAppTarget.request().post(entity);
        response.close();

        Assert.assertEquals(HttpStatus.SC_BAD_REQUEST, response.getStatus());
    }
}
