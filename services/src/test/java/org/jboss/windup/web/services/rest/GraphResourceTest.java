package org.jboss.windup.web.services.rest;

import java.net.URL;
import java.nio.file.Paths;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.jboss.arquillian.container.test.api.RunAsClient;
import org.jboss.arquillian.junit.Arquillian;
import org.jboss.arquillian.test.api.ArquillianResource;
import org.jboss.arquillian.warp.WarpTest;
import org.jboss.resteasy.client.jaxrs.ResteasyClient;
import org.jboss.resteasy.client.jaxrs.ResteasyWebTarget;
import org.jboss.resteasy.plugins.providers.RegisterBuiltin;
import org.jboss.resteasy.spi.ResteasyProviderFactory;
import org.jboss.windup.graph.model.resource.FileModel;
import org.jboss.windup.web.services.AbstractTest;
import org.jboss.windup.web.services.model.ApplicationGroup;
import org.jboss.windup.web.services.model.ExecutionState;
import org.jboss.windup.web.services.model.RegisteredApplication;
import org.jboss.windup.web.services.model.WindupExecution;
import org.junit.Assert;
import org.junit.Before;
import org.junit.BeforeClass;
import org.junit.Test;
import org.junit.runner.RunWith;

/**
 * @author <a href="mailto:jesse.sightler@gmail.com">Jesse Sightler</a>
 */
@WarpTest
@RunWith(Arquillian.class)
public class GraphResourceTest extends AbstractTest
{
    @ArquillianResource
    private URL contextPath;

    private ApplicationGroupEndpoint applicationGroupEndpoint;
    private RegisteredApplicationEndpoint registeredApplicationEndpoint;
    private WindupEndpoint windupEndpoint;
    private GraphResource graphResource;
    private WindupExecution execution;

    @BeforeClass
    public static void setUpClass() throws Exception
    {
        // initializes the rest easy client framework
        RegisterBuiltin.register(ResteasyProviderFactory.getInstance());
    }

    @Before
    public void setUp() throws Exception
    {
        ResteasyClient client = getResteasyClient();
        ResteasyWebTarget target = client.target(contextPath + "rest");

        this.applicationGroupEndpoint = target.proxy(ApplicationGroupEndpoint.class);
        this.registeredApplicationEndpoint = target.proxy(RegisteredApplicationEndpoint.class);
        this.windupEndpoint = target.proxy(WindupEndpoint.class);
        this.graphResource = target.proxy(GraphResource.class);

      //  this.execution = executeWindup();
    }

    @Test
    @RunAsClient
    public void testQueryByType()
    {
        List<Map<String, Object>> fileModels = graphResource.getByType(execution.getId(), FileModel.TYPE, 1);
        Assert.assertNotNull(fileModels);
        Assert.assertTrue(fileModels.size() > 1);

        for (Map<String, Object> fileModel : fileModels)
        {
            System.out.println("FileModel: " + fileModel);
        }
    }
/*
    private WindupExecution executeWindup() throws Exception
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
    */
}
