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
public class FileResourceTest extends GraphResourceTest
{

    @ArquillianResource
    private URL contextPath;

    private FileModelResource fileModelResource;

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

        super.setUp();
        this.fileModelResource = target.proxy(FileModelResource.class);
    }

    @Test
    @RunAsClient
    public void testFileByName()
    {
        Long executionID = this.execution.getId();
        List<Map<String, Object>> results = this.fileModelResource.get(executionID, "java");

        Assert.assertTrue(results.size() == 1);
        for (Map<String, Object> result : results)
        {
            Assert.assertEquals(true, result.get(FileModel.IS_DIRECTORY));
            Assert.assertEquals("java", result.get(FileModel.FILE_NAME));
            Assert.assertNotNull(result.get(FileModel.PARENT_FILE));
        }
    }
}
