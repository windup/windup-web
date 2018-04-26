package org.jboss.windup.web.services.rest.graph;

import java.io.StringReader;
import java.util.List;
import java.util.Map;

import org.jboss.arquillian.container.test.api.RunAsClient;
import org.jboss.arquillian.junit.Arquillian;
import org.jboss.windup.graph.model.resource.FileModel;
import org.jboss.windup.web.addons.websupport.rest.GraphPathLookup;
import org.jboss.windup.web.addons.websupport.rest.graph.GraphResource;
import org.jboss.windup.web.addons.websupport.services.ReportFilterService;
import org.junit.Assert;
import org.junit.Test;
import org.junit.runner.RunWith;

import javax.json.*;
import javax.ws.rs.Consumes;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.UriInfo;

/**
 * @author <a href="mailto:jesse.sightler@gmail.com">Jesse Sightler</a>
 */
@RunWith(Arquillian.class)
public class GraphResourceTest extends AbstractGraphResourceTest
{

    /**
     * This exists solely to work around RESTEASY-798. Without it, the client proxy will fail to be generated when it
     * hits the unannotated methods.
     */
    @Path(GraphResource.GRAPH_RESOURCE_URL)
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public interface GraphResourceSubInterface extends GraphResource
    {
        @Override
        @POST
        void setUriInfo(UriInfo uriInfo);

        @Override
        @POST
        void setGraphPathLookup(GraphPathLookup graphPathLookup);

        @POST
        @Override
        void setReportFilterService(ReportFilterService reportFilterService);
    }

    @Test
    @RunAsClient
    public void testQueryByType()
    {
        Response response = graphResource.getByType(execution.getId(), FileModel.TYPE, 1, false, null, null, true, null);
        Assert.assertNotNull(response);
        JsonArray fileModels = Json.createReader(new StringReader(response.readEntity(String.class))).readArray();
        Assert.assertTrue(fileModels.size() > 1);

        for (JsonValue fileModel : fileModels)
        {
            System.out.println("FileModel: " + fileModel);
        }
    }

    @Test
    @RunAsClient
    public void testEdgeQuery()
    {
        List<Map<String, Object>> fileModels = graphResource.getByType(execution.getId(), FileModel.TYPE, FileModel.FILE_NAME, "windup-src-example", 0, false, true);
        Assert.assertNotNull(fileModels);
        Assert.assertTrue(fileModels.size() == 1);

        for (Map<String, Object> fileModel : fileModels)
        {
            Map<String, Object> verticesOut = (Map<String, Object>)fileModel.get(GraphResource.VERTICES_OUT);
            Assert.assertNotNull(verticesOut);

            Map<String, Object> parentFileLinkDetails = (Map<String, Object>)verticesOut.get(FileModel.PARENT_FILE);
            Assert.assertEquals(GraphResource.TYPE_LINK, parentFileLinkDetails.get(GraphResource.TYPE));

            String edgesUri = (String)parentFileLinkDetails.get(GraphResource.LINK);
            Assert.assertNotNull(edgesUri);

            Object vertexID = fileModel.get(GraphResource.KEY_ID);
            List<Map<String, Object>> edges = graphResource.getEdges(execution.getId(), (Integer)vertexID, "OUT", FileModel.PARENT_FILE, false);
            Assert.assertNotNull(edges);
            Assert.assertEquals(1, edges.size());
            Assert.assertNotNull(edges.get(0));
        }
    }

    @Test
    @RunAsClient
    public void testQueryByTypeAndProperty()
    {
        List<Map<String, Object>> fileModels = graphResource.getByType(execution.getId(), FileModel.TYPE, FileModel.FILE_NAME, "windup-src-example", 1, false, true);
        Assert.assertNotNull(fileModels);
        Assert.assertTrue(fileModels.size() == 1);

        for (Map<String, Object> fileModel : fileModels)
        {
            System.out.println("FileModel: " + fileModel);
            System.out.println("File Path: " + fileModel.get(FileModel.FILE_PATH));

            Map<String, Object> verticesOut = (Map<String, Object>)fileModel.get(GraphResource.VERTICES_OUT);
            Assert.assertNotNull(verticesOut);

            Map<String, Object> parentFileInfo = (Map<String, Object>)verticesOut.get(FileModel.PARENT_FILE);
            Assert.assertNotNull(parentFileInfo);
            List<Object> parentFiles = (List<Object>)parentFileInfo.get(GraphResource.VERTICES);
            Assert.assertEquals(1, parentFiles.size());

            Map<String, Object> verticesIn = (Map<String, Object>)fileModel.get(GraphResource.VERTICES_IN);
            Map<String, Object> childFiles = (Map<String, Object>)verticesIn.get(FileModel.PARENT_FILE);
            Assert.assertNotNull(childFiles);

            List<Object> vertices = (List)childFiles.get(GraphResource.VERTICES);
            Assert.assertTrue(vertices.size() > 0);
        }
    }
}
