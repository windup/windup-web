package org.jboss.windup.web.services.servlet;

import java.net.URL;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.logging.Logger;

import org.apache.http.HttpResponse;
import org.apache.http.client.HttpClient;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.impl.client.HttpClients;
import org.jboss.arquillian.junit.Arquillian;
import org.jboss.windup.web.furnaceserviceprovider.FromFurnace;
import org.jboss.windup.web.services.AbstractTest;
import org.junit.Assert;
import org.junit.Test;
import org.junit.runner.RunWith;

import org.jboss.arquillian.test.api.ArquillianResource;
import org.jboss.windup.web.addons.websupport.WebPathUtil;

import javax.inject.Inject;

@RunWith(Arquillian.class)
public class FileDefaultServletTest extends AbstractTest
{
    private static final Logger log = Logger.getLogger(FileDefaultServletTest.class.getName());

    @ArquillianResource
    private URL baseURL;

    @Inject @FromFurnace
    private WebPathUtil webPathUtil;

    @Test
    public void testExpandVariables() throws Exception
    {
        Assert.assertEquals("Foo/"+System.getProperty("jboss.server.data.dir")+"/Baz", webPathUtil.expandVariables("Foo/${jboss.server.data.dir}/Baz"));
    }

    private static final String TESTFILE_PREFIX = "FileServletTest-";

    @Test
    public void testFileServlet() throws Exception
    {
        final Path reportsDir = Paths.get(System.getProperty("jboss.server.data.dir"), "windup", "reports");
        Files.createDirectories(reportsDir);
        Path tempFile = Files.createTempFile(reportsDir, TESTFILE_PREFIX, ".file");

        HttpClient httpClient = HttpClients.createDefault();
        final String testFileUrl = baseURL.toURI().toString() + "staticReport/" + tempFile.getFileName();
        HttpResponse response = httpClient.execute(new HttpGet(testFileUrl));
        int exec = response.getStatusLine().getStatusCode();
        log.info("FileServlet returned HTTP code: " + exec);

        Assert.assertNotEquals("Test file not found at: " + testFileUrl, 403L, exec);
        Assert.assertNotEquals("Test file not found at: " + testFileUrl, 404L, exec);
        Assert.assertNotEquals("Test file not found at: " + testFileUrl, 500L, exec);
    }
}