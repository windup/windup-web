package org.jboss.windup.web.fileservlet;

import java.io.File;
import java.net.URL;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.logging.Logger;
import org.apache.commons.httpclient.HttpClient;
import org.apache.commons.httpclient.methods.GetMethod;
import org.jboss.arquillian.junit.Arquillian;
import org.junit.Assert;
import org.junit.Test;
import org.junit.runner.RunWith;

import org.jboss.arquillian.container.test.api.Deployment;
import org.jboss.arquillian.test.api.ArquillianResource;
import org.jboss.shrinkwrap.api.GenericArchive;
import org.jboss.shrinkwrap.api.ShrinkWrap;
import org.jboss.shrinkwrap.api.importer.ExplodedImporter;
import org.jboss.shrinkwrap.api.spec.WebArchive;
import org.jboss.shrinkwrap.resolver.api.maven.Maven;
import org.jboss.windup.web.addons.websupport.WebPathUtil;
import org.junit.Ignore;

@RunWith(Arquillian.class)
public class FileServletTest
{
    private static final Logger log = Logger.getLogger( FileServletTest.class.getName() );

    @ArquillianResource
    private URL baseURL;

    @Deployment
    public static WebArchive createDeployment()
    {
        WebArchive war = ShrinkWrap.create(WebArchive.class, "windup-web-services-servlet.war");
        File[] files = Maven.resolver().loadPomFromFile("pom.xml").importRuntimeDependencies().resolve().withTransitivity().asFile();
        war.addAsLibraries(files);
        war.addPackages(true, WebPathUtil.class.getPackage().toString());
        war.addClass(WebPathUtil.class);
        war.addClass(FileServlet.class);
        //war.merge(ShrinkWrap.create(ExplodedImporter.class).importDirectory("src/main/webapp/WEB-INF/").as(GenericArchive.class), "/WEB-INF");
        war.addAsWebInfResource(new File("src/main/webapp/WEB-INF/web.xml"));
        return war;
    }

    @Test
    public void testExpandVariables() throws Exception
    {
        Assert.assertEquals("Foo/"+System.getProperty("jboss.server.data.dir")+"/Baz", WebPathUtil.expandVariables("Foo/${jboss.server.data.dir}/Baz"));
    }

    private static final String TESTFILE_PREFIX = "FileServletTest-";


    @Test
    public void testFileServlet() throws Exception
    {
        final Path reportsDir = Paths.get(System.getProperty("jboss.server.data.dir"), "windup", "reports");
        Files.createDirectories(reportsDir);
        Path tempFile = Files.createTempFile(reportsDir, TESTFILE_PREFIX, ".file");

        HttpClient httpClient = new HttpClient();
        final String testFileUrl = baseURL.toURI().toString() + "staticReport/" + tempFile.getFileName();
        int exec = httpClient.executeMethod(new GetMethod(testFileUrl));
        log.info("FileServlet returned HTTP code: " + exec);

        Assert.assertNotEquals("Test file not found at: " + testFileUrl, 403L, exec);
        Assert.assertNotEquals("Test file not found at: " + testFileUrl, 404L, exec);
        Assert.assertNotEquals("Test file not found at: " + testFileUrl, 500L, exec);
    }
}