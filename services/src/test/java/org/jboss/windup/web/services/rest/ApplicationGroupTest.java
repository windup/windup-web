package org.jboss.windup.web.services.rest;

import org.apache.commons.lang3.RandomStringUtils;
import org.apache.http.HttpStatus;
import org.jboss.arquillian.container.test.api.RunAsClient;
import org.jboss.arquillian.junit.Arquillian;
import org.jboss.arquillian.test.api.ArquillianResource;
import org.jboss.resteasy.client.jaxrs.ResteasyClient;
import org.jboss.resteasy.client.jaxrs.ResteasyWebTarget;
import org.jboss.windup.web.services.AbstractTest;
import org.jboss.windup.web.services.ServiceTestUtil;
import org.jboss.windup.web.services.data.DataProvider;
import org.jboss.windup.web.services.data.ServiceConstants;
import org.jboss.windup.web.services.model.ApplicationGroup;
import org.jboss.windup.web.services.model.MigrationProject;
import org.jboss.windup.web.services.model.PackageMetadata;
import org.jboss.windup.web.services.model.RegisteredApplication;
import org.json.JSONArray;
import org.json.JSONObject;
import org.junit.Assert;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;

import javax.ws.rs.core.Response;
import java.net.URL;

/**
 * @author <a href="mailto:jesse.sightler@gmail.com">Jesse Sightler</a>
 */
@RunWith(Arquillian.class)
public class ApplicationGroupTest extends AbstractTest
{
    @ArquillianResource
    private URL contextPath;

    private ResteasyWebTarget target;
    private ResteasyClient client;

    private ApplicationGroupEndpoint applicationGroupEndpoint;
    private MigrationProjectEndpoint migrationProjectEndpoint;
    private DataProvider dataProvider;

    @Before
    public void setUp()
    {
        this.client = ServiceTestUtil.getResteasyClient();
        this.target = client.target(contextPath + ServiceConstants.REST_BASE);

        this.dataProvider = new DataProvider(target);

        this.applicationGroupEndpoint = target.proxy(ApplicationGroupEndpoint.class);
        this.migrationProjectEndpoint = target.proxy(MigrationProjectEndpoint.class);
    }

    @Test
    @RunAsClient
    public void createApplicationGroup()
    {
        String projectTitle = "Project " + RandomStringUtils.randomAlphabetic(5);
        String groupTitle = "Group " + RandomStringUtils.randomAlphabetic(5);

        MigrationProject migrationProject = new MigrationProject();
        migrationProject.setTitle(projectTitle);

        migrationProject = migrationProjectEndpoint.createMigrationProject(migrationProject);

        ApplicationGroup applicationGroup = new ApplicationGroup();
        applicationGroup.setMigrationProject(migrationProject);
        applicationGroup.setTitle(groupTitle);

        applicationGroup = applicationGroupEndpoint.create(applicationGroup);
        Assert.assertEquals(groupTitle, applicationGroup.getTitle());

        ApplicationGroup retrievedGroup = null;
        for (ApplicationGroup possibleMatch : applicationGroupEndpoint.getApplicationGroups())
        {
            if (possibleMatch.getTitle().equals(groupTitle))
            {
                retrievedGroup = possibleMatch;
                break;
            }
        }

        Assert.assertNotNull(retrievedGroup);
        Assert.assertEquals(applicationGroup.getId(), retrievedGroup.getId());
        Assert.assertEquals(applicationGroup.getTitle(), retrievedGroup.getTitle());
        Assert.assertNotNull(retrievedGroup.getAnalysisContext());
        Assert.assertNotNull(retrievedGroup.getExecutions());
        Assert.assertNotNull(retrievedGroup.getApplications());
        Assert.assertNotNull(retrievedGroup.getMigrationProject());
    }

    /**
     * TODO: Write some meaningful test.
     * Problem is how. Result of this endpoint depends on JMS queue processing.
     *
     * @throws Exception
     */
    @Test
    @RunAsClient
    public void testGetPackages() throws Exception
    {
        MigrationProject dummyProject = this.dataProvider.getMigrationProject();
        ApplicationGroup dummyGroup = this.dataProvider.getApplicationGroup(dummyProject);
        RegisteredApplication dummyApp = this.dataProvider.getApplication(dummyGroup);

        String registeredAppTargetUri = this.target.getUri() + "/applicationGroups/" + dummyGroup.getId() + "/packages";
        ResteasyWebTarget registeredAppTarget = this.client.target(registeredAppTargetUri);

        PackageMetadata packageMetadata;
        Response response;
        JSONObject json;

        long beginTime = System.currentTimeMillis();
        do {
            Thread.sleep(1000L);

            response = registeredAppTarget.request().get();
            response.bufferEntity();
            packageMetadata = response.readEntity(PackageMetadata.class);
            String string = response.readEntity(String.class);
            json = new JSONObject(string);

            response.close();

            if ((System.currentTimeMillis() - beginTime) > (1000L * 240L))
            {
                // taking too long... fail
                Assert.fail("Processing never completed. Current status: " + packageMetadata.getScanStatus());
            }

        } while (packageMetadata.getScanStatus() != PackageMetadata.ScanStatus.COMPLETE);

        JSONArray packageTree = json.getJSONArray("packageTree");

        Assert.assertEquals(1, packageTree.length());
        Assert.assertEquals(HttpStatus.SC_OK, response.getStatus());
    }
}
