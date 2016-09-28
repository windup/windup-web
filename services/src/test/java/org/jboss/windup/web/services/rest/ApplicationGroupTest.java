package org.jboss.windup.web.services.rest;

import org.apache.commons.lang3.RandomStringUtils;
import org.jboss.arquillian.container.test.api.RunAsClient;
import org.jboss.arquillian.junit.Arquillian;
import org.jboss.arquillian.test.api.ArquillianResource;
import org.jboss.resteasy.client.jaxrs.ResteasyClient;
import org.jboss.resteasy.client.jaxrs.ResteasyWebTarget;
import org.jboss.windup.web.services.AbstractTest;
import org.jboss.windup.web.services.data.ServiceConstants;
import org.jboss.windup.web.services.model.ApplicationGroup;
import org.jboss.windup.web.services.model.MigrationProject;
import org.junit.Assert;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;

import java.net.URL;

/**
 * @author <a href="mailto:jesse.sightler@gmail.com">Jesse Sightler</a>
 */
@RunWith(Arquillian.class)
public class ApplicationGroupTest extends AbstractTest
{
    @ArquillianResource
    private URL contextPath;

    private ApplicationGroupEndpoint applicationGroupEndpoint;
    private MigrationProjectEndpoint migrationProjectEndpoint;

    @Before
    public void setUp()
    {
        ResteasyClient client = getResteasyClient();
        ResteasyWebTarget target = client.target(contextPath + ServiceConstants.REST_BASE);

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
