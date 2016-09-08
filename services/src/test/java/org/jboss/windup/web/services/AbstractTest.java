package org.jboss.windup.web.services;

import org.jboss.arquillian.container.test.api.Deployment;
import org.jboss.resteasy.client.jaxrs.ResteasyClient;
import org.jboss.resteasy.client.jaxrs.ResteasyClientBuilder;
import org.jboss.shrinkwrap.api.GenericArchive;
import org.jboss.shrinkwrap.api.ShrinkWrap;
import org.jboss.shrinkwrap.api.importer.ExplodedImporter;
import org.jboss.shrinkwrap.api.spec.WebArchive;
import org.jboss.shrinkwrap.resolver.api.maven.Maven;
import org.jboss.shrinkwrap.resolver.api.maven.PomEquippedResolveStage;
import org.jboss.windup.web.tests.authentication.KeycloakAuthenticationHelper;

import javax.ws.rs.client.ClientRequestContext;
import javax.ws.rs.client.ClientRequestFilter;
import javax.ws.rs.core.MultivaluedMap;
import java.io.File;
import java.io.IOException;

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
        return war;
    }

    protected ResteasyClient getResteasyClient()
    {
        return new ResteasyClientBuilder()
                .register(new Authenticator())
                .build();
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
