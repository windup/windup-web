package org.jboss.windup.web.services.rest.graph;

import java.net.URL;
import java.util.List;
import java.util.Map;

import org.jboss.arquillian.container.test.api.RunAsClient;
import org.jboss.arquillian.junit.Arquillian;
import org.jboss.arquillian.test.api.ArquillianResource;
import org.jboss.resteasy.client.jaxrs.ResteasyClient;
import org.jboss.resteasy.client.jaxrs.ResteasyWebTarget;
import org.jboss.windup.graph.model.resource.FileModel;
import org.jboss.windup.web.addons.websupport.rest.GraphPathLookup;
import org.jboss.windup.web.addons.websupport.rest.graph.FileModelResource;
import org.jboss.windup.web.addons.websupport.rest.graph.GraphResource;
import org.jboss.windup.web.services.data.ServiceConstants;
import org.junit.Assert;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;

import javax.ws.rs.Consumes;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.UriInfo;

/**
 * @author <a href="mailto:jesse.sightler@gmail.com">Jesse Sightler</a>
 */
@RunWith(Arquillian.class)
public class FileModelResourceTest extends AbstractGraphResourceTest
{

    @ArquillianResource
    private URL contextPath;

    private FileModelResource fileModelResource;

    @Before
    public void setUp() throws Exception
    {
        ResteasyClient client = getResteasyClient();
        ResteasyWebTarget target = client.target(contextPath + ServiceConstants.FURNACE_REST_BASE);

        super.setUp();
        this.fileModelResource = target.proxy(FileModelResourceSubclass.class);
    }

    /**
     * This exists solely to work around RESTEASY-798. Without it, the client proxy will fail to be generated when it
     * hits the unannotated methods.
     */
    @Path(FileModelResource.FILE_MODEL_RESOURCE_URL)
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public interface FileModelResourceSubclass extends FileModelResource
    {
        @Override
        @POST
        void setUriInfo(UriInfo uriInfo);

        @Override
        @POST
        void setGraphPathLookup(GraphPathLookup graphPathLookup);
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
}
