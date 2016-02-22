package org.jboss.windup.web.services;

import org.jboss.arquillian.container.test.api.Deployment;
import org.jboss.shrinkwrap.api.GenericArchive;
import org.jboss.shrinkwrap.api.ShrinkWrap;
import org.jboss.shrinkwrap.api.importer.ExplodedImporter;
import org.jboss.shrinkwrap.api.spec.WebArchive;
import org.jboss.shrinkwrap.resolver.api.maven.Maven;

import java.io.File;

/**
 * @author <a href="mailto:jesse.sightler@gmail.com">Jesse Sightler</a>
 */
public class AbstractTest
{
    private static final String PACKAGE = "org.jboss.windup.web.services";

    @Deployment
    public static WebArchive createDeployment()
    {
        WebArchive war = ShrinkWrap.create(WebArchive.class, "windup-web-services.war");
        File[] files = Maven.resolver().loadPomFromFile("pom.xml").importRuntimeDependencies().resolve().withTransitivity().asFile();
        war.addAsLibraries(files);
        war.addPackages(true, PACKAGE);
        war.addPackages(true, AbstractTest.class.getPackage());
        war.merge(ShrinkWrap.create(ExplodedImporter.class).importDirectory("src/test/resources/WEB-INF").as(GenericArchive.class), "/WEB-INF");

        return war;
    }
}
