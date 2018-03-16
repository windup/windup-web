package org.jboss.windup.web.services.rest.graph;

import org.jboss.arquillian.container.test.api.RunAsClient;
import org.jboss.arquillian.junit.Arquillian;
import org.jboss.arquillian.test.api.ArquillianResource;
import org.jboss.resteasy.client.jaxrs.ResteasyClient;
import org.jboss.resteasy.client.jaxrs.ResteasyWebTarget;
import org.jboss.windup.web.addons.websupport.rest.graph.ClassificationResource;
import org.jboss.windup.web.addons.websupport.rest.graph.FileModelResource;
import org.jboss.windup.web.addons.websupport.rest.graph.GraphResource;
import org.jboss.windup.web.services.ServiceTestUtil;
import org.jboss.windup.web.services.data.ServiceConstants;
import org.junit.Assert;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;

import java.net.URL;
import java.util.List;
import java.util.Map;
import java.util.logging.Logger;

/**
 * @author <a href="mailto:jesse.sightler@gmail.com">Jesse Sightler</a>
 */
@RunWith(Arquillian.class)
public class ClassificationResourceTest extends AbstractGraphResourceTest
{
    private static Logger LOG = Logger.getLogger(ClassificationResourceTest.class.getCanonicalName());

    @ArquillianResource
    private URL contextPath;

    private FileModelResource fileModelResource;
    private ClassificationResource classificationResource;

    @Before
    public void setUp() throws Exception
    {
        ResteasyClient client = ServiceTestUtil.getResteasyClient();
        ResteasyWebTarget target = client.target(contextPath + ServiceConstants.FURNACE_REST_BASE);

        super.setUp();
        this.fileModelResource = getFileResource(target);
        this.classificationResource = getClassificationResource(target);
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
            LOG.info("Getting classifications for: " + id);
            List<Map<String, Object>> classifications = this.classificationResource.getClassifications(executionID, id);
            Assert.assertNotNull(classifications);
            Assert.assertTrue(!classifications.isEmpty());

            boolean foundPOMClassification = false;
            for (Map<String, Object> classification : classifications)
            {
                String title = (String)classification.get("ClassificationModel-classification");
                if (title != null && title.equals("Maven POM (pom.xml)"))
                    foundPOMClassification = true;
            }
            Assert.assertTrue(foundPOMClassification);

            break;
        }
    }
}
