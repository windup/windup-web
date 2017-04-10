package org.jboss.windup.web.services.rest;

import org.jboss.arquillian.container.test.api.RunAsClient;
import org.jboss.arquillian.junit.Arquillian;
import org.jboss.arquillian.test.api.ArquillianResource;
import org.jboss.resteasy.client.jaxrs.ResteasyClient;
import org.jboss.resteasy.client.jaxrs.ResteasyWebTarget;
import org.jboss.windup.web.services.MigrationProjectAssertions;
import org.jboss.windup.web.services.ServiceTestUtil;
import org.jboss.windup.web.services.data.DataProvider;
import org.jboss.windup.web.services.data.ServiceConstants;
import org.jboss.windup.web.services.data.WindupExecutionUtil;
import org.jboss.windup.web.services.model.ExecutionState;
import org.jboss.windup.web.services.AbstractTest;
import org.jboss.windup.web.services.model.MigrationProject;
import org.jboss.windup.web.services.model.WindupExecution;
import org.junit.Assert;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;

import java.net.URL;

/**
 * @author <a href="mailto:jesse.sightler@gmail.com">Jesse Sightler</a>
 */
@RunWith(Arquillian.class)
public class WindupEndpointTest extends AbstractTest
{
    @ArquillianResource
    private URL contextPath;

    private ResteasyClient client;
    private ResteasyWebTarget target;
    private MigrationProjectEndpoint migrationProjectEndpoint;

    @Before
    public void setUp()
    {
        this.client = ServiceTestUtil.getResteasyClient();
        this.target = client.target(contextPath + ServiceConstants.REST_BASE);
        this.migrationProjectEndpoint = this.target.proxy(MigrationProjectEndpoint.class);
    }

    @Test
    @RunAsClient
    public void testExecution() throws Exception
    {
        DataProvider dataProvider = new DataProvider(this.target);
        MigrationProject project = dataProvider.getMigrationProject();

        WindupExecutionUtil util = new WindupExecutionUtil(client, target);
        WindupExecution status = util.executeWindup(project);

        Assert.assertEquals(ExecutionState.COMPLETED, status.getState());
        Assert.assertTrue(status.getTotalWork() > 10);
        Assert.assertTrue(status.getWorkCompleted() > 9);

        MigrationProject updatedProject = this.migrationProjectEndpoint.getMigrationProject(project.getId());
        MigrationProjectAssertions.assertLastModifiedIsUpdated(project, updatedProject);
    }
}
