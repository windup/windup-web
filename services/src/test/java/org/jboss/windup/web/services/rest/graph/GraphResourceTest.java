package org.jboss.windup.web.services.rest.graph;

import java.net.URL;
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
import org.jboss.windup.web.services.WindupData;
import org.jboss.windup.web.services.model.WindupExecution;
import org.jboss.windup.web.services.rest.ApplicationGroupEndpoint;
import org.jboss.windup.web.services.rest.RegisteredApplicationEndpoint;
import org.jboss.windup.web.services.rest.WindupEndpoint;
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

    ApplicationGroupEndpoint applicationGroupEndpoint;
    RegisteredApplicationEndpoint registeredApplicationEndpoint;
    WindupEndpoint windupEndpoint;
    GraphResource graphResource;
    WindupExecution execution;

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

        if (this.execution == null)
        {
            WindupData windupData = new WindupData(registeredApplicationEndpoint, applicationGroupEndpoint, windupEndpoint);
            this.execution = windupData.executeWindup();
        }
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

    @Test
    @RunAsClient
    public void testQueryByTypeAndProperty()
    {
        List<Map<String, Object>> fileModels = graphResource.getByType(execution.getId(), FileModel.TYPE, FileModel.FILE_NAME, "java", 1);
        Assert.assertNotNull(fileModels);
        Assert.assertTrue(fileModels.size() == 1);

        for (Map<String, Object> fileModel : fileModels)
        {
            System.out.println("FileModel: " + fileModel);
        }
    }
}
