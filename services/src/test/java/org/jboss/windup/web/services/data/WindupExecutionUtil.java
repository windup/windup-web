package org.jboss.windup.web.services.data;

import java.io.InputStream;

import org.jboss.resteasy.client.jaxrs.ResteasyClient;
import org.jboss.resteasy.client.jaxrs.ResteasyWebTarget;
import org.jboss.windup.web.services.model.ApplicationGroup;
import org.jboss.windup.web.services.model.ExecutionState;
import org.jboss.windup.web.services.model.MigrationProject;
import org.jboss.windup.web.services.model.RegisteredApplication;
import org.jboss.windup.web.services.model.WindupExecution;
import org.jboss.windup.web.services.rest.ApplicationGroupEndpoint;
import org.jboss.windup.web.services.rest.WindupEndpoint;
import org.junit.Assert;

/**
 * @author <a href="mailto:jesse.sightler@gmail.com">Jesse Sightler</a>
 */
public class WindupExecutionUtil
{
    private ResteasyClient client;
    private ResteasyWebTarget target;
    private ApplicationGroupEndpoint applicationGroupEndpoint;
    private WindupEndpoint windupEndpoint;

    public WindupExecutionUtil(ResteasyClient client, ResteasyWebTarget target)
    {
        this.client = client;
        this.target = target;
        this.applicationGroupEndpoint = target.proxy(ApplicationGroupEndpoint.class);
        this.windupEndpoint = target.proxy(WindupEndpoint.class);
    }

    public WindupExecution executeWindup() throws Exception
    {
        DataProvider dataProvider = new DataProvider(this.target);
        MigrationProject project = dataProvider.getMigrationProject();
        ApplicationGroup group = dataProvider.getApplicationGroup(project);

        try (InputStream sampleIS = getClass().getResourceAsStream(DataProvider.TINY_SAMPLE_PATH))
        {
            RegisteredApplication application = dataProvider.getApplication(project, sampleIS, "sample-tiny.war");

            group.addApplication(application);
            this.applicationGroupEndpoint.update(group);
        }

        System.out.println("Setup Graph test, registered application and ready to start Windup analysis...");

        WindupExecution initialExecution = this.windupEndpoint.executeGroup(group.getId());

        WindupExecution status = this.windupEndpoint.getStatus(initialExecution.getId());
        long beginTime = System.currentTimeMillis();
        do
        {
            Thread.sleep(1000L);

            status = this.windupEndpoint.getStatus(status.getId());
            System.out.println("Status: " + status);

            if ((System.currentTimeMillis() - beginTime) > (1000L * 240L))
            {
                // taking too long... fail
                Assert.fail("Processing never completed. Current status: " + status);
            }
        }
        while (status.getState() == ExecutionState.STARTED || status.getState() == ExecutionState.QUEUED);

        Assert.assertEquals(ExecutionState.COMPLETED, status.getState());
        return status;
    }
}
