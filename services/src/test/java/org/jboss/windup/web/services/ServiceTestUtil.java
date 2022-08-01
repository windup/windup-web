package org.jboss.windup.web.services;

import org.apache.commons.codec.digest.DigestUtils;
import org.jboss.resteasy.client.jaxrs.ResteasyClient;
import org.jboss.resteasy.client.jaxrs.ResteasyClientBuilder;
import org.junit.Assert;

import java.io.File;
import java.io.IOException;
import java.io.InputStream;

/**
 * @author <a href="mailto:jesse.sightler@gmail.com">Jesse Sightler</a>
 */
public class ServiceTestUtil {

    public static ResteasyClient getResteasyClient() {
        return new ResteasyClientBuilder()
                .build();
    }

    public static void assertFileExists(String path) {
        File file = new File(path);
        Assert.assertTrue("File should exist", file.exists());
    }

    public static void assertFileDoesNotExist(String path) {
        File file = new File(path);
        Assert.assertFalse("File should not exist", file.exists());
    }

    public static void assertFileContentsAreEqual(InputStream expected, InputStream actual) throws IOException {
        String expectedMd5 = DigestUtils.md5Hex(expected);
        String actualMd5 = DigestUtils.md5Hex(actual);

        Assert.assertEquals("File contents differ!", expectedMd5, actualMd5);
    }

}
