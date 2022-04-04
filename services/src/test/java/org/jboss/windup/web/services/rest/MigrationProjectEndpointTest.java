package org.jboss.windup.web.services.rest;

import java.io.IOException;
import java.net.URL;
import java.util.Collection;
import java.util.Map;

import javax.ws.rs.NotFoundException;

import org.apache.commons.lang3.RandomStringUtils;
import org.jboss.arquillian.container.test.api.RunAsClient;
import org.jboss.arquillian.junit.Arquillian;
import org.jboss.arquillian.test.api.ArquillianResource;
import org.jboss.resteasy.client.jaxrs.ResteasyClient;
import org.jboss.resteasy.client.jaxrs.ResteasyWebTarget;
import org.jboss.windup.web.services.AbstractTest;
import org.jboss.windup.web.services.MigrationProjectAssertions;
import org.jboss.windup.web.services.ServiceTestUtil;
import org.jboss.windup.web.services.data.DataProvider;
import org.jboss.windup.web.services.data.ServiceConstants;
import org.jboss.windup.web.services.model.AnalysisContext;
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
    private AnalysisContextEndpoint analysisContextEndpoint;
    private DataProvider dataProvider;

    @Before
    public void setUp()
    {
        ResteasyClient client = ServiceTestUtil.getResteasyClient();
        ResteasyWebTarget target = client.target(contextPath + ServiceConstants.REST_BASE);

        this.migrationProjectEndpoint = target.proxy(MigrationProjectEndpoint.class);
        this.analysisContextEndpoint = target.proxy(AnalysisContextEndpoint.class);
        this.dataProvider = new DataProvider(target);
    }

    @Test
    @RunAsClient
    public void testCreateMigrationProject() throws Exception
    {
        Collection<MigrationProjectEndpoint.ExtendedMigrationProject> existingProjects = migrationProjectEndpoint.getMigrationProjects();
        Assert.assertEquals(0, existingProjects.size());

        String title = "Test Migration Project" + RandomStringUtils.randomAlphabetic(5);

        MigrationProject migrationProject = new MigrationProject();
        migrationProject.setTitle(title);

        MigrationProject createdProject = this.migrationProjectEndpoint.createMigrationProject(migrationProject);
        this.analysisContextEndpoint.saveAsProjectDefault(new AnalysisContext(createdProject), createdProject.getId(), false, false);

        Collection<MigrationProjectEndpoint.ExtendedMigrationProject> apps = migrationProjectEndpoint.getMigrationProjects();
        Assert.assertEquals(1, apps.size());
        Assert.assertNotNull(apps.iterator().next());
        Assert.assertEquals(title, ((Map)apps.iterator().next().get("migrationProject")).get("title"));

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
            Collection<MigrationProjectEndpoint.ExtendedMigrationProject> existingProjects = migrationProjectEndpoint.getMigrationProjects();
            Assert.assertEquals(1, existingProjects.size());

            MigrationProjectEndpoint.ExtendedMigrationProject projectFromServer = existingProjects.iterator().next();

            Assert.assertEquals(0, (int)(Integer) projectFromServer.get("applicationCount"));
            Assert.assertEquals(project.getTitle(), ((Map)projectFromServer.get("migrationProject")).get("title"));
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
            Collection<MigrationProjectEndpoint.ExtendedMigrationProject> existingProjects = migrationProjectEndpoint.getMigrationProjects();
            Assert.assertEquals(1, existingProjects.size());

            MigrationProjectEndpoint.ExtendedMigrationProject projectFromServer = existingProjects.iterator().next();

            Assert.assertEquals(2, (int)(Integer) projectFromServer.get("applicationCount"));
            Assert.assertEquals(project.getTitle(), ((Map)projectFromServer.get("migrationProject")).get("title"));
        }
        finally
        {
            this.migrationProjectEndpoint.deleteProject(project);
        }
    }

    @Test
    @RunAsClient
    public void testUpdateProject()
    {
        MigrationProject project = this.dataProvider.getMigrationProject();

        try
        {
            String updatedTitle = "This should be updated title";
            project.setTitle(updatedTitle);

            MigrationProject resultOfUpdate = this.migrationProjectEndpoint.updateMigrationProject(project);
            MigrationProject updatedProject = this.migrationProjectEndpoint.getMigrationProject(project.getId());

            Assert.assertEquals(updatedTitle, resultOfUpdate.getTitle());
            Assert.assertEquals(updatedTitle, updatedProject.getTitle());

            MigrationProjectAssertions.assertLastModifiedIsUpdated(project, resultOfUpdate);
            MigrationProjectAssertions.assertLastModifiedIsUpdated(project, updatedProject);
        }
        finally
        {
            this.migrationProjectEndpoint.deleteProject(project);
        }
    }
}
