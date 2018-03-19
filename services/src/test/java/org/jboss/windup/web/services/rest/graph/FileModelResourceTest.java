package org.jboss.windup.web.services.rest.graph;

import java.net.URL;
import java.util.List;
import java.util.Map;
import java.util.logging.Logger;

import org.jboss.arquillian.container.test.api.RunAsClient;
import org.jboss.arquillian.junit.Arquillian;
import org.jboss.arquillian.test.api.ArquillianResource;
import org.jboss.resteasy.client.jaxrs.ResteasyClient;
import org.jboss.resteasy.client.jaxrs.ResteasyWebTarget;
import org.jboss.windup.graph.model.resource.FileModel;
import org.jboss.windup.web.addons.websupport.rest.graph.FileModelResource;
import org.jboss.windup.web.addons.websupport.rest.graph.GraphResource;
import org.jboss.windup.web.services.ServiceTestUtil;
import org.jboss.windup.web.services.data.ServiceConstants;
import org.junit.Assert;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;

/**
 * @author <a href="mailto:jesse.sightler@gmail.com">Jesse Sightler</a>
 */
@RunWith(Arquillian.class)
public class FileModelResourceTest extends AbstractGraphResourceTest
{
    private static Logger LOG = Logger.getLogger(FileModelResourceTest.class.getCanonicalName());

    @ArquillianResource
    private URL contextPath;

    private FileModelResource fileModelResource;

    @Before
    public void setUp() throws Exception
    {
        ResteasyClient client = ServiceTestUtil.getResteasyClient();
        ResteasyWebTarget target = client.target(contextPath + ServiceConstants.FURNACE_REST_BASE);

        super.setUp();
        this.fileModelResource = getFileResource(target);
    }

    @Test
    @RunAsClient
    public void testFileByName()
    {
        Long executionID = this.execution.getId();
        List<Map<String, Object>> results = this.fileModelResource.get(executionID, "windup-src-example");

        Assert.assertTrue(results.size() == 1);
        for (Map<String, Object> result : results)
        {
            Assert.assertEquals(true, result.get(FileModel.IS_DIRECTORY));
            Assert.assertEquals("windup-src-example", result.get(FileModel.FILE_NAME));

            Object parentFile = ((Map<String, Object>)result.get(GraphResource.VERTICES_OUT)).get(FileModel.PARENT_FILE);
            Assert.assertNotNull(parentFile);
        }
    }

    @Test
    @RunAsClient
    public void testGetClassifications()
    {
        Long executionID = this.execution.getId();
        List<Map<String, Object>> results = this.fileModelResource.get(executionID, "pom.xml");

        Assert.assertTrue(results.size() == 1);
        for (Map<String, Object> result : results)
        {
            Integer id = (Integer)result.get(GraphResource.KEY_ID);
            String source = this.fileModelResource.getSource(executionID, id);
            Assert.assertNotNull(source);
            Assert.assertTrue(source.length() > 512);

            break;
        }
    }
}
