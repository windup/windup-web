package org.jboss.windup.web.services.data;

import java.io.InputStream;

import org.jboss.resteasy.client.jaxrs.ResteasyClient;
import org.jboss.resteasy.client.jaxrs.ResteasyWebTarget;
import org.jboss.windup.web.services.model.AnalysisContext;
import org.jboss.windup.web.services.model.ExecutionState;
import org.jboss.windup.web.services.model.MigrationProject;
import org.jboss.windup.web.services.model.RegisteredApplication;
import org.jboss.windup.web.services.model.WindupExecution;
import org.jboss.windup.web.services.rest.AnalysisContextEndpoint;
import org.jboss.windup.web.services.rest.WindupEndpoint;
import org.junit.Assert;

/**
 * @author <a href="mailto:jesse.sightler@gmail.com">Jesse Sightler</a>
 */
public class WindupExecutionUtil
{
    private ResteasyClient client;
    private ResteasyWebTarget target;
    private AnalysisContextEndpoint analysisContextEndpoint;
    private WindupEndpoint windupEndpoint;

    public WindupExecutionUtil(ResteasyClient client, ResteasyWebTarget target)
    {
        this.client = client;
        this.target = target;
        this.analysisContextEndpoint = target.proxy(AnalysisContextEndpoint.class);
        this.windupEndpoint = target.proxy(WindupEndpoint.class);
    }

    public WindupExecution executeWindup() throws Exception
    {
        DataProvider dataProvider = new DataProvider(this.target);
        MigrationProject project = dataProvider.getMigrationProject();
        AnalysisContext context = dataProvider.getAnalysisContext(project);

        try (InputStream sampleIS = getClass().getResourceAsStream(DataProvider.TINY_SAMPLE_PATH))
        {
            RegisteredApplication application = dataProvider.getApplication(project, sampleIS, "sample-tiny.war");

            context.addApplication(application);
            this.analysisContextEndpoint.update(context.getId(), context);
        }

        System.out.println("Setup Graph test, registered application and ready to start Windup analysis...");

        WindupExecution initialExecution = this.windupEndpoint.executeProjectWithContext(context, context.getMigrationProject().getId());

        WindupExecution status = this.windupEndpoint.getExecution(initialExecution.getId());
        long beginTime = System.currentTimeMillis();
        do
        {
            Thread.sleep(1000L);

            status = this.windupEndpoint.getExecution(status.getId());
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
