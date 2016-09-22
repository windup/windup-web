package org.jboss.windup.web.services;

import java.nio.file.Paths;
import java.util.Collections;

import org.jboss.windup.web.services.model.ApplicationGroup;
import org.jboss.windup.web.services.model.ExecutionState;
import org.jboss.windup.web.services.model.RegisteredApplication;
import org.jboss.windup.web.services.model.WindupExecution;
import org.jboss.windup.web.services.rest.ApplicationGroupEndpoint;
import org.jboss.windup.web.services.rest.RegisteredApplicationEndpoint;
import org.jboss.windup.web.services.rest.WindupEndpoint;
import org.junit.Assert;

/**
 * @author <a href="mailto:jesse.sightler@gmail.com">Jesse Sightler</a>
 */
public class WindupData
{
    private RegisteredApplicationEndpoint registeredApplicationEndpoint;
    private ApplicationGroupEndpoint applicationGroupEndpoint;
    private WindupEndpoint windupEndpoint;

    public WindupData(RegisteredApplicationEndpoint registeredApplicationEndpoint, ApplicationGroupEndpoint applicationGroupEndpoint,
                WindupEndpoint windupEndpoint)
    {
        this.registeredApplicationEndpoint = registeredApplicationEndpoint;
        this.applicationGroupEndpoint = applicationGroupEndpoint;
        this.windupEndpoint = windupEndpoint;
    }

    public WindupExecution executeWindup() throws Exception
    {
        String inputPath = Paths.get("src/main/java").toAbsolutePath().normalize().toString();

        RegisteredApplication input = new RegisteredApplication();
        input.setInputPath(inputPath);

        input = this.registeredApplicationEndpoint.registerApplication(input);
        System.out.println("Setup Graph test... registered application: " + input);

        ApplicationGroup group = new ApplicationGroup();
        group.setTitle("Group");
        group.setApplications(Collections.singleton(input));
        group = applicationGroupEndpoint.create(group);

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
        while (status.getState() == ExecutionState.STARTED);

        Assert.assertEquals(ExecutionState.COMPLETED, status.getState());
        return status;
    }
}
