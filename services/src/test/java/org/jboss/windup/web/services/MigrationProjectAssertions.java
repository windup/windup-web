package org.jboss.windup.web.services;

import org.jboss.windup.web.services.model.MigrationProject;
import org.junit.Assert;

/**
 * Test assertions for MigrationProject entity
 *
 * @author <a href="mailto:dklingenberg@gmail.com">David Klingenberg</a>
 */
public class MigrationProjectAssertions
{
    /**
     * Asserts lastModified field of project is updated
     */
    public static void assertLastModifiedIsUpdated(MigrationProject originalProject, MigrationProject updatedProject)
    {
        Assert.assertNotNull(updatedProject.getLastModified());
        Assert.assertTrue(updatedProject.getLastModified().after(originalProject.getLastModified()));
    }

    /**
     * Asserts lastModified field of project is not updated
     */
    public static void assertLastModifiedIsNotUpdated(MigrationProject originalProject, MigrationProject updatedProject)
    {
        Assert.assertNotNull(updatedProject.getLastModified());
        Assert.assertEquals(updatedProject.getLastModified(), originalProject.getLastModified());
    }
}
