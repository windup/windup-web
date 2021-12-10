package org.jboss.windup.web.services;

import org.apache.commons.lang3.StringUtils;
import org.jboss.shrinkwrap.api.GenericArchive;
import org.jboss.shrinkwrap.api.ShrinkWrap;
import org.jboss.shrinkwrap.api.importer.ExplodedImporter;
import org.jboss.shrinkwrap.api.spec.JavaArchive;
import org.jboss.shrinkwrap.api.spec.WebArchive;
import org.jboss.shrinkwrap.resolver.api.maven.Maven;
import org.jboss.shrinkwrap.resolver.api.maven.PomEquippedResolveStage;

import java.io.File;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

/**
 * @author <a href="mailto:jesse.sightler@gmail.com">Jesse Sightler</a>
 */
public class Deployments
{
    /**
     * Creates a deployment with an in-memory store that is thrown away after each test.
     */
    public static WebArchive createDeploymentInMemory()
    {
        WebArchive war = ShrinkWrap.create(WebArchive.class, "api.war");
        PomEquippedResolveStage pom = Maven.configureResolver().fromFile("../settings.xml").loadPomFromFile("pom.xml");
        List<JavaArchive> archives = pom.importRuntimeDependencies().resolve().withTransitivity().asList(JavaArchive.class);

        // Make a mutable copy of the list
        archives = new ArrayList<>(archives);

        Optional<JavaArchive> jpaArchive = archives.stream().filter(archive -> StringUtils.contains(archive.getName(), "windup-web-jpa-model")).findFirst();
        jpaArchive.ifPresent(archives::remove);
        jpaArchive.ifPresent(archive -> {
            war.merge(archive, "/WEB-INF/classes");
        });

        war.addAsLibraries(archives);

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
