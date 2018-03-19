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
import org.jboss.windup.web.addons.websupport.rest.graph.FileModelResource;
import org.jboss.windup.web.addons.websupport.rest.graph.GraphResource;
import org.jboss.windup.web.addons.websupport.rest.graph.HintResource;
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
public class HintResourceTest extends AbstractGraphResourceTest
{
    private static Logger LOG = Logger.getLogger(HintResourceTest.class.getCanonicalName());

    @ArquillianResource
    private URL contextPath;

    private FileModelResource fileModelResource;
    private HintResource hintResource;

    @Before
    public void setUp() throws Exception
    {
        ResteasyClient client = ServiceTestUtil.getResteasyClient();
        ResteasyWebTarget target = client.target(contextPath + ServiceConstants.FURNACE_REST_BASE);

        super.setUp();
        this.fileModelResource = getFileResource(target);
        this.hintResource = getHintResource(target);
    }

    @Test
    @RunAsClient
    public void testGetHints()
    {
        Long executionID = this.execution.getId();
        List<Map<String, Object>> results = this.fileModelResource.get(executionID, "pom.xml");

        Assert.assertEquals(1, results.size());
        for (Map<String, Object> result : results)
        {
            Integer id = (Integer) result.get(GraphResource.KEY_ID);
            LOG.info("Getting hints for id: " + id);
            List<Map<String, Object>> hints = this.hintResource.getHints(executionID, id);
            Assert.assertNotNull(hints);
            Assert.assertTrue(!hints.isEmpty());

            boolean foundPOMPropertiesHint = false;
            for (Map<String, Object> hint : hints)
            {
                String title = (String) hint.get("InlineHintModel-title");
                if (title != null && title.equals("POM Properties"))
                    foundPOMPropertiesHint = true;
            }
            Assert.assertTrue(foundPOMPropertiesHint);

            break;
        }
    }
}
