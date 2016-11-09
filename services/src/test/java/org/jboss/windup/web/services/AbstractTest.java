package org.jboss.windup.web.services;

import org.apache.commons.codec.digest.DigestUtils;
import org.jboss.arquillian.container.test.api.Deployment;
import org.jboss.resteasy.client.jaxrs.ResteasyClient;
import org.jboss.resteasy.client.jaxrs.ResteasyClientBuilder;
import org.jboss.resteasy.plugins.providers.RegisterBuiltin;
import org.jboss.resteasy.spi.ResteasyProviderFactory;
import org.jboss.shrinkwrap.api.GenericArchive;
import org.jboss.shrinkwrap.api.ShrinkWrap;
import org.jboss.shrinkwrap.api.importer.ExplodedImporter;
import org.jboss.shrinkwrap.api.spec.WebArchive;
import org.jboss.shrinkwrap.resolver.api.maven.Maven;
import org.jboss.shrinkwrap.resolver.api.maven.PomEquippedResolveStage;
import org.jboss.windup.web.tests.authentication.KeycloakAuthenticationHelper;
import org.junit.Assert;
import org.junit.BeforeClass;

import javax.ws.rs.client.ClientRequestContext;
import javax.ws.rs.client.ClientRequestFilter;
import javax.ws.rs.core.MultivaluedMap;
import java.io.File;
import java.io.IOException;
import java.io.InputStream;

/**
 * @author <a href="mailto:jesse.sightler@gmail.com">Jesse Sightler</a>
 */
public class AbstractTest
{
    @Deployment
    public static WebArchive createDeployment()
    {
        WebArchive war = ShrinkWrap.create(WebArchive.class, "windup-web-services.war");
        PomEquippedResolveStage pom = Maven.resolver().loadPomFromFile("pom.xml");
        File[] files = pom.importRuntimeDependencies().resolve().withTransitivity().asFile();
        war.addAsLibraries(files);

        File[] authClientLib = pom.resolve("org.jboss.windup.web:test-authentication-client").withTransitivity().asFile();
        war.addAsLibraries(authClientLib);
        war.addPackages(true, AbstractTest.class.getPackage());
        war.merge(ShrinkWrap.create(ExplodedImporter.class).importDirectory("src/main/resources/META-INF").as(GenericArchive.class), "/WEB-INF/classes/META-INF");
        war.merge(ShrinkWrap.create(ExplodedImporter.class).importDirectory("src/main/resources/migration-paths").as(GenericArchive.class), "/WEB-INF/classes/migration-paths");
        war.merge(ShrinkWrap.create(ExplodedImporter.class).importDirectory("src/main/webapp").as(GenericArchive.class), "/");
        war.merge(ShrinkWrap.create(ExplodedImporter.class).importDirectory("src/test/resources/WEB-INF").as(GenericArchive.class), "/WEB-INF");
        war.merge(ShrinkWrap.create(ExplodedImporter.class).importDirectory("src/test/resources/META-INF").as(GenericArchive.class), "/WEB-INF/classes/META-INF");
        return war;
    }

    @BeforeClass
    public static void setUpClass() throws Exception
    {
        // initializes the rest easy client framework
        RegisterBuiltin.register(ResteasyProviderFactory.getInstance());
    }


    protected ResteasyClient getResteasyClient()
    {
        return new ResteasyClientBuilder()
                .register(new Authenticator())
                .build();
    }

    protected void assertFileExists(String path)
    {
        File file = new File(path);
        Assert.assertTrue("File should exist", file.exists());
    }

    protected void assertFileDoesNotExist(String path)
    {
        File file = new File(path);
        Assert.assertFalse("File should not exist", file.exists());
    }

    protected void assertFileContentsAreEqual(InputStream expected, InputStream actual) throws IOException
    {
        String expectedMd5 = DigestUtils.md5Hex(expected);
        String actualMd5 = DigestUtils.md5Hex(actual);

        Assert.assertEquals("File contents differ!", expectedMd5, actualMd5);
    }

    private class Authenticator implements ClientRequestFilter
    {
        @Override
        public void filter(ClientRequestContext requestContext) throws IOException
        {
            String token = KeycloakAuthenticationHelper.getAccessToken();

            MultivaluedMap<String, Object> headers = requestContext.getHeaders();
            headers.add("Authorization", "Bearer " + token);
        }
    }
}
