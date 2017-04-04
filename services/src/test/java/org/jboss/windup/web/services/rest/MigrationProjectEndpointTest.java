package org.jboss.windup.web.services.rest;

import java.io.IOException;
import java.net.URL;
import java.util.Collection;

import javax.ws.rs.NotFoundException;

import org.apache.commons.lang3.RandomStringUtils;
import org.jboss.arquillian.container.test.api.RunAsClient;
import org.jboss.arquillian.junit.Arquillian;
import org.jboss.arquillian.test.api.ArquillianResource;
import org.jboss.resteasy.client.jaxrs.ResteasyClient;
import org.jboss.resteasy.client.jaxrs.ResteasyWebTarget;
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
public class MigrationProjectEndpointTest extends AbstractTest
{
    @ArquillianResource
    private URL contextPath;

    private MigrationProjectEndpoint migrationProjectEndpoint;
    private DataProvider dataProvider;

    @Before
    public void setUp()
    {
        ResteasyClient client = ServiceTestUtil.getResteasyClient();
        ResteasyWebTarget target = client.target(contextPath + ServiceConstants.REST_BASE);

        this.migrationProjectEndpoint = target.proxy(MigrationProjectEndpoint.class);
        this.dataProvider = new DataProvider(target);
    }

    @Test
    @RunAsClient
    public void testCreateMigrationProject() throws Exception
    {
        Collection<MigrationProjectEndpoint.MigrationProjectAndAppCount> existingProjects = migrationProjectEndpoint.getMigrationProjects();
        Assert.assertEquals(0, existingProjects.size());

        String title = "Test Migration Project" + RandomStringUtils.randomAlphabetic(5);

        MigrationProject migrationProject = new MigrationProject();
        migrationProject.setTitle(title);

        MigrationProject createdProject = this.migrationProjectEndpoint.createMigrationProject(migrationProject);

        Collection<MigrationProjectEndpoint.MigrationProjectAndAppCount> apps = migrationProjectEndpoint.getMigrationProjects();
        Assert.assertEquals(1, apps.size());
        Assert.assertNotNull(apps.iterator().next());
        Assert.assertEquals(title, apps.iterator().next().getMigrationProject().getTitle());

        // TODO: Assert created/lastModifier

        this.migrationProjectEndpoint.deleteProject(createdProject);
    }

    @Test
    @RunAsClient
    public void testDeleteProject()
    {
        MigrationProject project = this.dataProvider.getMigrationProject();

        this.migrationProjectEndpoint.deleteProject(project);

        try
        {
            MigrationProject reloaded = this.migrationProjectEndpoint.getMigrationProject(project.getId());
            Assert.fail("Exception should have been thrown");
        }
        catch (NotFoundException e)
        {

        }
    }

    @Test
    @RunAsClient
    public void testDeleteProjectWithApp() throws IOException
    {
        MigrationProject project = this.dataProvider.getMigrationProject();
        RegisteredApplication app = this.dataProvider.getApplication(project);

        this.migrationProjectEndpoint.deleteProject(project);

        try
        {
            MigrationProject reloaded = this.migrationProjectEndpoint.getMigrationProject(project.getId());
            Assert.fail("Exception should have been thrown");
        }
        catch (NotFoundException e)
        {

        }
    }

    @Test
    @RunAsClient
    public void testGetProjectListOneProjectWithoutApps()
    {
        MigrationProject project = this.dataProvider.getMigrationProject();

        try
        {
            Collection<MigrationProjectEndpoint.MigrationProjectAndAppCount> existingProjects = migrationProjectEndpoint.getMigrationProjects();
            Assert.assertEquals(1, existingProjects.size());

            MigrationProjectEndpoint.MigrationProjectAndAppCount projectFromServer = existingProjects.iterator().next();

            Assert.assertEquals(0L, (long) projectFromServer.applicationCount);
            Assert.assertEquals(project.getTitle(), projectFromServer.getMigrationProject().getTitle());
        }
        finally
        {
            this.migrationProjectEndpoint.deleteProject(project);
        }
    }

    @Test
    @RunAsClient
    public void testGetProjectListOneProjectWithApps() throws IOException
    {
        MigrationProject project = this.dataProvider.getMigrationProject();
        this.dataProvider.getApplication(project);
        this.dataProvider.getApplication(project);

        try
        {
            Collection<MigrationProjectEndpoint.MigrationProjectAndAppCount> existingProjects = migrationProjectEndpoint.getMigrationProjects();
            Assert.assertEquals(1, existingProjects.size());

            MigrationProjectEndpoint.MigrationProjectAndAppCount projectFromServer = existingProjects.iterator().next();

            Assert.assertEquals(2L, (long) projectFromServer.applicationCount);
            Assert.assertEquals(project.getTitle(), projectFromServer.getMigrationProject().getTitle());
        }
        finally
        {
            this.migrationProjectEndpoint.deleteProject(project);
        }
    }
}
