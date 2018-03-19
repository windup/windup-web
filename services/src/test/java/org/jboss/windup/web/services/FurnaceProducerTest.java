package org.jboss.windup.web.services;

import org.jboss.arquillian.junit.Arquillian;
import org.jboss.forge.furnace.Furnace;
import org.jboss.forge.furnace.util.OperatingSystemUtils;
import org.jboss.windup.graph.GraphContext;
import org.jboss.windup.graph.GraphContextFactory;
import org.jboss.windup.graph.model.resource.FileModel;
import org.jboss.windup.graph.service.FileService;
import org.junit.Assert;
import org.junit.Test;
import org.junit.runner.RunWith;
import javax.inject.Inject;


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

        try (GraphContext context = graphContextFactory.create(true))
        {
            Assert.assertNotNull(context);

            FileService fileService = new FileService(context);
            FileModel fileModel = fileService.createByFilePath(OperatingSystemUtils.getTempDirectory().toString());
            Assert.assertNotNull(fileModel);
            Assert.assertTrue(fileModel.isDirectory());
        }
    }
}