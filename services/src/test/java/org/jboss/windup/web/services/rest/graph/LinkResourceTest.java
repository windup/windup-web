package org.jboss.windup.web.services.rest.graph;

import org.jboss.arquillian.container.test.api.RunAsClient;
import org.jboss.arquillian.junit.Arquillian;
import org.jboss.arquillian.test.api.ArquillianResource;
import org.jboss.resteasy.client.jaxrs.ResteasyClient;
import org.jboss.resteasy.client.jaxrs.ResteasyWebTarget;
import org.jboss.windup.web.addons.websupport.rest.graph.FileModelResource;
import org.jboss.windup.web.addons.websupport.rest.graph.GraphResource;
import org.jboss.windup.web.addons.websupport.rest.graph.LinkResource;
import org.jboss.windup.web.addons.websupport.rest.graph.TechnologyTagResource;
import org.jboss.windup.web.services.ServiceTestUtil;
import org.jboss.windup.web.services.data.ServiceConstants;
import org.junit.Assert;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;

import java.net.URL;
import java.util.List;
import java.util.Map;

/**
 * @author <a href="mailto:jesse.sightler@gmail.com">Jesse Sightler</a>
 */
@RunWith(Arquillian.class)
public class LinkResourceTest extends AbstractGraphResourceTest
{
    @ArquillianResource
    private URL contextPath;

    private FileModelResource fileModelResource;
    private LinkResource linkResource;

    @Before
    public void setUp() throws Exception
    {
        ResteasyClient client = ServiceTestUtil.getResteasyClient();
        ResteasyWebTarget target = client.target(contextPath + ServiceConstants.FURNACE_REST_BASE);

        super.setUp();
        this.fileModelResource = getFileResource(target);
        this.linkResource = getLinkResource(target);
    }

    @Test
    @RunAsClient
    public void testGetLinkResource()
    {
        Long executionID = this.execution.getId();
        List<Map<String, Object>> results = this.fileModelResource.get(executionID, "pom.xml");

        Assert.assertTrue(results.size() == 1);
        for (Map<String, Object> result : results)
        {
            Integer id = (Integer) result.get(GraphResource.KEY_ID);
            List<Map<String, Object>> links = this.linkResource.getLinksToTransformedFiles(executionID, id);
            Assert.assertNotNull(links);
            Assert.assertTrue(!links.isEmpty());

            boolean foundTransformedPOM = false;
            for (Map<String, Object> link : links)
            {
                String title = (String) link.get("description");
                if (title != null && title.equals("Example XSLT Conversion"))
                    foundTransformedPOM = true;
            }
            Assert.assertTrue(foundTransformedPOM);

            break;
        }
    }
}
