package org.jboss.windup.web.services;

import org.jboss.arquillian.container.test.api.Deployment;
import org.jboss.shrinkwrap.api.GenericArchive;
import org.jboss.shrinkwrap.api.ShrinkWrap;
import org.jboss.shrinkwrap.api.importer.ExplodedImporter;
import org.jboss.shrinkwrap.api.spec.WebArchive;
import org.jboss.shrinkwrap.resolver.api.maven.Maven;
import org.jboss.shrinkwrap.resolver.api.maven.PomEquippedResolveStage;

import java.io.File;

/**
 * @author <a href="mailto:jesse.sightler@gmail.com">Jesse Sightler</a>
 */
public class Deployments
{
    /**
     * Creates a deployment that is configured to store the database on disk (for reuse between deployments).
     *
     * This should really only be done if the data is relatively static (for example, setting up the graph as an immutable
     * entity for multiple graph related tests).
     */
    public static WebArchive createDeploymentPersistentToDisk()
    {
        WebArchive war = Deployments.createDeploymentInMemory();
        war.addAsResource("META-INF/persistence-ondisk.xml", "/META-INF/persistence.xml");

        // Keep persistent data in these tests
        war.deleteClass(ServerCleanupOnStartup.class);

        return war;
    }

    /**
     * Creates a deployment with an in-memory store that is thrown away after each test.
     */
    public static WebArchive createDeploymentInMemory()
    {
        WebArchive war = ShrinkWrap.create(WebArchive.class, "api.war");
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
        war.addAsResource("META-INF/persistence-inmemory.xml", "/META-INF/persistence.xml");
        return war;
    }
}
