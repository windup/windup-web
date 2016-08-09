package org.jboss.windup.web.services.rest;

import org.apache.commons.lang3.RandomStringUtils;
import org.jboss.arquillian.container.test.api.RunAsClient;
import org.jboss.arquillian.junit.Arquillian;
import org.jboss.arquillian.test.api.ArquillianResource;
import org.jboss.arquillian.warp.WarpTest;
import org.jboss.resteasy.client.jaxrs.ResteasyClient;
import org.jboss.resteasy.client.jaxrs.ResteasyClientBuilder;
import org.jboss.resteasy.client.jaxrs.ResteasyWebTarget;
import org.jboss.resteasy.plugins.providers.RegisterBuiltin;
import org.jboss.resteasy.spi.ResteasyProviderFactory;
import org.jboss.windup.web.services.AbstractTest;
import org.jboss.windup.web.services.model.ApplicationGroup;
import org.jboss.windup.web.services.model.MigrationProject;
import org.junit.Assert;
import org.junit.Before;
import org.junit.BeforeClass;
import org.junit.Test;
import org.junit.runner.RunWith;

import java.net.URL;

/**
 * @author <a href="mailto:jesse.sightler@gmail.com">Jesse Sightler</a>
 */
@WarpTest
@RunWith(Arquillian.class)
public class ApplicationGroupTest extends AbstractTest
{
    @ArquillianResource
    private URL contextPath;

    private ApplicationGroupEndpoint applicationGroupEndpoint;
    private MigrationProjectEndpoint migrationProjectEndpoint;

    @BeforeClass
    public static void setUpClass() throws Exception
    {
        // initializes the rest easy client framework
        RegisterBuiltin.register(ResteasyProviderFactory.getInstance());
    }

    @Before
    public void setUp()
    {
        ResteasyClient client = new ResteasyClientBuilder().build();
        ResteasyWebTarget target = client.target(contextPath + "rest");

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
    }
}
