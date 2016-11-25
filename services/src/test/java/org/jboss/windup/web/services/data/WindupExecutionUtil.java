package org.jboss.windup.web.services.data;

import java.io.InputStream;

import org.jboss.resteasy.client.jaxrs.ResteasyClient;
import org.jboss.resteasy.client.jaxrs.ResteasyWebTarget;
import org.jboss.resteasy.plugins.providers.multipart.MultipartFormDataOutput;
import org.jboss.windup.web.services.model.ApplicationGroup;
import org.jboss.windup.web.services.model.ExecutionState;
import org.jboss.windup.web.services.model.MigrationProject;
import org.jboss.windup.web.services.model.WindupExecution;
import org.jboss.windup.web.services.rest.ApplicationGroupEndpoint;
import org.jboss.windup.web.services.rest.WindupEndpoint;
import org.jboss.windup.web.tests.authentication.KeycloakAuthenticationHelper;
import org.junit.Assert;

import javax.ws.rs.ProcessingException;
import javax.ws.rs.client.Entity;
import javax.ws.rs.core.GenericEntity;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

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

        MultipartFormDataOutput uploadData = new MultipartFormDataOutput();

        try (InputStream sampleIS = getClass().getResourceAsStream(DataProvider.TINY_SAMPLE_PATH))
        {
            uploadData.addFormData("file", sampleIS, MediaType.APPLICATION_OCTET_STREAM_TYPE, "sample-tiny.war");

            GenericEntity<MultipartFormDataOutput> entity = new GenericEntity<MultipartFormDataOutput>(uploadData) {};
            String registeredAppTargetUri = this.target.getUri() + ServiceConstants.REGISTERED_APP_ENDPOINT + "/appGroup/" + group.getId();
            ResteasyWebTarget registeredAppTarget = this.client.target(registeredAppTargetUri);

            try {
                Response response = registeredAppTarget.request().post(Entity.entity(entity, MediaType.MULTIPART_FORM_DATA_TYPE));
                response.close();
            } catch (Throwable t) {
                t.printStackTrace();
                throw new RuntimeException("Failed to post application due to: " + t.getMessage());
            }
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
