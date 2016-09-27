package org.jboss.windup.web.services.rest;

import org.jboss.arquillian.container.test.api.RunAsClient;
import org.jboss.arquillian.junit.Arquillian;
import org.jboss.arquillian.test.api.ArquillianResource;
import org.jboss.arquillian.warp.WarpTest;
import org.jboss.resteasy.client.jaxrs.ResteasyClient;
import org.jboss.resteasy.client.jaxrs.ResteasyWebTarget;
import org.jboss.resteasy.plugins.providers.RegisterBuiltin;
import org.jboss.resteasy.spi.ResteasyProviderFactory;
import org.jboss.windup.web.services.data.ServiceConstants;
import org.jboss.windup.web.services.data.WindupExecutionUtil;
import org.jboss.windup.web.services.model.ApplicationGroup;
import org.jboss.windup.web.services.model.ExecutionState;
import org.jboss.windup.web.services.model.RegisteredApplication;
import org.jboss.windup.web.services.AbstractTest;
import org.jboss.windup.web.services.model.WindupExecution;
import org.junit.Assert;
import org.junit.Before;
import org.junit.BeforeClass;
import org.junit.Test;
import org.junit.runner.RunWith;

import java.net.URL;
import java.nio.file.Paths;
import java.util.Collections;

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

    @BeforeClass
    public static void setUpClass() throws Exception
    {
        // initializes the rest easy client framework
        RegisterBuiltin.register(ResteasyProviderFactory.getInstance());
    }

    @Before
    public void setUp()
    {
        this.client = getResteasyClient();
        this.target = client.target(contextPath + ServiceConstants.REST_BASE);

    }

    @Test
    @RunAsClient
    public void testExecutionGroup() throws Exception
    {
        WindupExecutionUtil util = new WindupExecutionUtil(client, target);
        WindupExecution status = util.executeWindup();

        Assert.assertEquals(ExecutionState.COMPLETED, status.getState());
        Assert.assertTrue(status.getTotalWork() > 10);
        Assert.assertTrue(status.getWorkCompleted() > 9);
    }
}
