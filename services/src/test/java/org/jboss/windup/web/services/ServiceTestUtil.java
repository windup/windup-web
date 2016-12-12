package org.jboss.windup.web.services;

import java.io.File;
import java.io.IOException;
import java.io.InputStream;

import javax.ws.rs.client.ClientRequestContext;
import javax.ws.rs.client.ClientRequestFilter;
import javax.ws.rs.core.MultivaluedMap;

import org.apache.commons.codec.digest.DigestUtils;
import org.jboss.resteasy.client.jaxrs.ResteasyClient;
import org.jboss.resteasy.client.jaxrs.ResteasyClientBuilder;
import org.jboss.windup.web.tests.authentication.KeycloakAuthenticationHelper;
import org.junit.Assert;

/**
 * @author <a href="mailto:jesse.sightler@gmail.com">Jesse Sightler</a>
 */
public class ServiceTestUtil
{

    public static ResteasyClient getResteasyClient()
    {
        return new ResteasyClientBuilder()
                    .register(new Authenticator())
                    .build();
    }

    public static void assertFileExists(String path)
    {
        File file = new File(path);
        Assert.assertTrue("File should exist", file.exists());
    }

    public static void assertFileDoesNotExist(String path)
    {
        File file = new File(path);
        Assert.assertFalse("File should not exist", file.exists());
    }

    public static void assertFileContentsAreEqual(InputStream expected, InputStream actual) throws IOException
    {
        String expectedMd5 = DigestUtils.md5Hex(expected);
        String actualMd5 = DigestUtils.md5Hex(actual);

        Assert.assertEquals("File contents differ!", expectedMd5, actualMd5);
    }

    private static class Authenticator implements ClientRequestFilter
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
