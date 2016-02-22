package org.jboss.windup.web.services;

import org.jboss.arquillian.container.test.api.Deployment;
import org.jboss.arquillian.junit.Arquillian;
import org.jboss.forge.furnace.Furnace;
import org.jboss.shrinkwrap.api.GenericArchive;
import org.jboss.shrinkwrap.api.ShrinkWrap;
import org.jboss.shrinkwrap.api.importer.ExplodedImporter;
import org.jboss.shrinkwrap.api.spec.WebArchive;
import org.jboss.shrinkwrap.resolver.api.maven.Maven;
import org.jboss.windup.graph.GraphContext;
import org.jboss.windup.graph.GraphContextFactory;
import org.jboss.windup.graph.model.resource.FileModel;
import org.jboss.windup.graph.service.FileService;
import org.junit.Assert;
import org.junit.Test;
import org.junit.runner.RunWith;

import javax.inject.Inject;
import java.io.File;

@RunWith(Arquillian.class)
public class FurnaceProducerTest extends AbstractTest
{
    @Inject
    private Furnace furnace;

    @Inject
    private GraphContextFactory graphContextFactory;

    @Test
    public void testFurnace() throws Exception
    {
        Assert.assertNotNull(furnace);
        Assert.assertNotNull(graphContextFactory);

        try (GraphContext context = graphContextFactory.create())
        {
            Assert.assertNotNull(context);

            FileService fileService = new FileService(context);
            FileModel fileModel = fileService.createByFilePath("/home/jsightler/tmp/");
            Assert.assertNotNull(fileModel);
            Assert.assertTrue(fileModel.isDirectory());
        }
    }
}