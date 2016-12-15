package org.jboss.windup.web.services.rest;

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
import org.junit.Assert;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;

import javax.ws.rs.NotFoundException;
import java.net.URL;
import java.util.Collection;

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
    private ResteasyClient client;
    private ResteasyWebTarget target;


    @Before
    public void setUp()
    {
        this.client = ServiceTestUtil.getResteasyClient();
        this.target = client.target(contextPath + ServiceConstants.REST_BASE);
        this.dataProvider = new DataProvider(target);

        this.migrationProjectEndpoint = target.proxy(MigrationProjectEndpoint.class);
    }

    @Test
    @RunAsClient
    public void testCreateMigrationProject() throws Exception
    {
        Collection<MigrationProject> existingProjects = migrationProjectEndpoint.getMigrationProjects();
        Assert.assertEquals(0, existingProjects.size());

        String title = "Test Migration Project" + RandomStringUtils.randomAlphabetic(5);

        MigrationProject migrationProject = new MigrationProject();
        migrationProject.setTitle(title);

        this.migrationProjectEndpoint.createMigrationProject(migrationProject);

        Collection<MigrationProject> apps = migrationProjectEndpoint.getMigrationProjects();
        Assert.assertEquals(1, apps.size());
        Assert.assertNotNull(apps.iterator().next());
        Assert.assertEquals(title, apps.iterator().next().getTitle());
    }


    @Test
    @RunAsClient
    public void testUpdateMigrationProject() throws Exception
    {
        String title = "Test Migration Project" + RandomStringUtils.randomAlphabetic(5);

        MigrationProject migrationProject = this.dataProvider.getMigrationProject();
        migrationProject.setTitle(title);

        MigrationProject updatedProject = this.migrationProjectEndpoint.updateMigrationProject(migrationProject);

        Assert.assertEquals(title, updatedProject.getTitle());
        Assert.assertEquals(migrationProject.getId(), updatedProject.getId());
        Assert.assertEquals(migrationProject.getGroups().size(), updatedProject.getGroups().size());
    }

    @Test
    @RunAsClient
    public void testDeleteMigrationProject() throws Exception
    {
        MigrationProject migrationProject = this.dataProvider.getMigrationProject();

        this.migrationProjectEndpoint.deleteProject(migrationProject);

        try {
            MigrationProject deletedProject = this.migrationProjectEndpoint.getMigrationProject(migrationProject.getId());
            Assert.fail("Expected exception to be thrown");
        } catch (NotFoundException e) {

        }
    }
}
