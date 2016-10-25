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
import org.jboss.windup.web.services.AbstractTest;
import org.jboss.windup.web.services.data.ServiceConstants;
import org.jboss.windup.web.services.data.WindupExecutionUtil;
import org.jboss.windup.web.services.model.WindupExecution;
import org.junit.Assert;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;

/**
 * @author <a href="mailto:jesse.sightler@gmail.com">Jesse Sightler</a>
 */
@RunWith(Arquillian.class)
public class GraphResourceTest extends AbstractTest
{
    @ArquillianResource
    private URL contextPath;

    GraphResource graphResource;
    WindupExecution execution;

    @Before
    public void setUp() throws Exception
    {
        ResteasyClient client = getResteasyClient();
        ResteasyWebTarget target = client.target(contextPath + ServiceConstants.REST_BASE);

        this.graphResource = target.proxy(GraphResource.class);

        if (this.execution == null)
        {
            WindupExecutionUtil windupExecutionUtil = new WindupExecutionUtil(client, target);
            this.execution = windupExecutionUtil.executeWindup();
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
    public void testEdgeQuery()
    {
        List<Map<String, Object>> fileModels = graphResource.getByType(execution.getId(), FileModel.TYPE, FileModel.FILE_NAME, "windup-src-example", 0);
        Assert.assertNotNull(fileModels);
        Assert.assertTrue(fileModels.size() == 1);

        for (Map<String, Object> fileModel : fileModels)
        {
            Map<String, Object> verticesOut = (Map<String, Object>)fileModel.get(AbstractGraphResource.VERTICES_OUT);
            Assert.assertNotNull(verticesOut);

            Map<String, Object> parentFileLinkDetails = (Map<String, Object>)verticesOut.get(FileModel.PARENT_FILE);
            Assert.assertEquals(AbstractGraphResource.TYPE_LINK, parentFileLinkDetails.get(AbstractGraphResource.TYPE));

            String edgesUri = (String)parentFileLinkDetails.get(AbstractGraphResource.LINK);
            Assert.assertNotNull(edgesUri);

            Object vertexID = fileModel.get(AbstractGraphResource.KEY_ID);
            List<Map<String, Object>> edges = graphResource.getEdges(execution.getId(), (Integer)vertexID, "OUT", FileModel.PARENT_FILE);
            Assert.assertNotNull(edges);
            Assert.assertEquals(1, edges.size());
            Assert.assertNotNull(edges.get(0));
        }
    }

    @Test
    @RunAsClient
    public void testQueryByTypeAndProperty()
    {
        List<Map<String, Object>> fileModels = graphResource.getByType(execution.getId(), FileModel.TYPE, FileModel.FILE_NAME, "windup-src-example", 1);
        Assert.assertNotNull(fileModels);
        Assert.assertTrue(fileModels.size() == 1);

        for (Map<String, Object> fileModel : fileModels)
        {
            System.out.println("FileModel: " + fileModel);
            System.out.println("File Path: " + fileModel.get(FileModel.FILE_PATH));

            Map<String, Object> verticesOut = (Map<String, Object>)fileModel.get(AbstractGraphResource.VERTICES_OUT);
            Assert.assertNotNull(verticesOut);

            Map<String, Object> parentFileInfo = (Map<String, Object>)verticesOut.get(FileModel.PARENT_FILE);
            Assert.assertNotNull(parentFileInfo);
            List<Object> parentFiles = (List<Object>)parentFileInfo.get(AbstractGraphResource.VERTICES);
            Assert.assertEquals(1, parentFiles.size());

            Map<String, Object> verticesIn = (Map<String, Object>)fileModel.get(AbstractGraphResource.VERTICES_IN);
            Map<String, Object> childFiles = (Map<String, Object>)verticesIn.get(FileModel.PARENT_FILE);
            Assert.assertNotNull(childFiles);

            List<Object> vertices = (List)childFiles.get(AbstractGraphResource.VERTICES);
            Assert.assertTrue(vertices.size() > 0);
        }
    }
}
