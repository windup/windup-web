package org.jboss.windup.web.services.rest;

import org.apache.commons.lang3.RandomStringUtils;
import org.jboss.arquillian.container.test.api.RunAsClient;
import org.jboss.arquillian.junit.Arquillian;
import org.jboss.arquillian.test.api.ArquillianResource;
import org.jboss.resteasy.client.jaxrs.ResteasyClient;
import org.jboss.resteasy.client.jaxrs.ResteasyWebTarget;
import org.jboss.windup.web.services.AbstractTest;
import org.jboss.windup.web.services.ServiceTestUtil;
import org.jboss.windup.web.services.data.ServiceConstants;
import org.jboss.windup.web.services.model.MigrationProject;
import org.junit.Assert;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;

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

    @Before
    public void setUp()
    {
        ResteasyClient client = ServiceTestUtil.getResteasyClient();
        ResteasyWebTarget target = client.target(contextPath + ServiceConstants.REST_BASE);

        this.migrationProjectEndpoint = target.proxy(MigrationProjectEndpoint.class);
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

        this.migrationProjectEndpoint.createMigrationProject(migrationProject);

        Collection<MigrationProjectEndpoint.MigrationProjectAndAppCount> apps = migrationProjectEndpoint.getMigrationProjects();
        Assert.assertEquals(1, apps.size());
        Assert.assertNotNull(apps.iterator().next());
        Assert.assertEquals(title, apps.iterator().next().getMigrationProject().getTitle());
    }
}
