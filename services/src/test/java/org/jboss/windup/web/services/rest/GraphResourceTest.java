package org.jboss.windup.web.services.rest;

import org.jboss.arquillian.container.test.api.RunAsClient;
import org.jboss.arquillian.junit.Arquillian;
import org.jboss.arquillian.test.api.ArquillianResource;
import org.jboss.arquillian.warp.WarpTest;
import org.jboss.resteasy.client.jaxrs.ResteasyClient;
import org.jboss.resteasy.client.jaxrs.ResteasyClientBuilder;
import org.jboss.resteasy.client.jaxrs.ResteasyWebTarget;
import org.jboss.resteasy.plugins.providers.RegisterBuiltin;
import org.jboss.resteasy.spi.ResteasyProviderFactory;
import org.jboss.windup.graph.model.WindupFrame;
import org.jboss.windup.web.addons.websupport.model.RegisteredApplicationModel;
import org.jboss.windup.web.services.AbstractTest;
import org.junit.Assert;
import org.junit.Before;
import org.junit.BeforeClass;
import org.junit.Test;
import org.junit.runner.RunWith;

import java.net.URL;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * @author <a href="mailto:jesse.sightler@gmail.com">Jesse Sightler</a>
 */
@WarpTest
@RunWith(Arquillian.class)
public class GraphResourceTest extends AbstractTest
{
    @ArquillianResource
    private URL contextPath;

    private GraphResource graphResource;

    @BeforeClass
    public static void setUpClass() throws Exception
    {
        // initializes the rest easy client framework
        RegisterBuiltin.register(ResteasyProviderFactory.getInstance());
    }

    @Before
    public void setUp()
    {
        ResteasyClient client = new ResteasyClientBuilder().build();
        ResteasyWebTarget target = client.target(contextPath + "rest");

        this.graphResource = target.proxy(GraphResource.class);
    }

    @Test
    @RunAsClient
    public void testCreate()
    {
        Map<String, Object> data = new HashMap<>();
        data.put("string1", "value1");
        data.put("integer1", 1);
        data.put("boolean1", true);
        data.put(WindupFrame.TYPE_PROP, Collections.singletonList(RegisteredApplicationModel.TYPE));

        Map<String, Object> created = graphResource.create(GraphResource.GLOBAL_GRAPH, data);
        Assert.assertEquals(5, created.size());
        Assert.assertEquals("value1", created.get("string1"));
        Assert.assertEquals(1, created.get("integer1"));
        Assert.assertEquals(true, created.get("boolean1"));
        Assert.assertTrue(created.get(GraphResource.KEY_ID) instanceof Integer);

        List<String> types = (List<String>)created.get(WindupFrame.TYPE_PROP);
        Assert.assertTrue(types.contains(RegisteredApplicationModel.TYPE));
    }

    @Test
    @RunAsClient
    public void testCreateWithEdge()
    {
        Map<String, Object> data = new HashMap<>();
        data.put("string1", "value1");
        data.put("integer1", 1);
        data.put("boolean1", true);

        Map<String, Object> edge = new HashMap<>();
        edge.put("direction", "OUT");

        Map<String, Object> relatedData = new HashMap<>();
        relatedData.put("relateddatavalue1", "relateddata1");
        edge.put("vertices", Collections.singletonList(relatedData));

        data.put("related", edge);

        Map<String, Object> created = graphResource.create(GraphResource.GLOBAL_GRAPH, data);

        Map<String, Object> loaded = graphResource.get(GraphResource.GLOBAL_GRAPH, (Integer)created.get(GraphResource.KEY_ID), 1);
        Assert.assertEquals("value1", loaded.get("string1"));

        Map<String, Object> loadedRelated = (Map<String, Object>)loaded.get("related");
        Assert.assertEquals("OUT", loadedRelated.get("direction"));

        Map<String, Object> loadedRelatedVertex = ((List<Map<String, Object>>)loadedRelated.get("vertices")).get(0);
        Assert.assertEquals("relateddata1", loadedRelatedVertex.get("relateddatavalue1"));
    }

    @Test
    @RunAsClient
    public void testUpdate()
    {
        Map<String, Object> data = new HashMap<>();
        data.put("string2", "value2");
        data.put("integer2", 2);
        data.put("boolean2", false);

        Map<String, Object> created = graphResource.create(GraphResource.GLOBAL_GRAPH, data);
        created.put("string2", "value3");
        created.put("integer2", 3);

        graphResource.update(GraphResource.GLOBAL_GRAPH, (Integer)created.get(GraphResource.KEY_ID), created);

        Map<String, Object> updated = graphResource.get(GraphResource.GLOBAL_GRAPH, (Integer)created.get(GraphResource.KEY_ID), null);
        Assert.assertEquals(4, updated.size());
        Assert.assertEquals("value3", updated.get("string2"));
        Assert.assertEquals(3, updated.get("integer2"));
        Assert.assertEquals(false, updated.get("boolean2"));
        Assert.assertTrue(updated.get(GraphResource.KEY_ID) instanceof Integer);
    }
}
