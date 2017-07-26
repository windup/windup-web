package org.jboss.windup.web.services;

import java.io.InputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.net.URLConnection;
import java.util.logging.Logger;

import org.apache.commons.io.IOUtils;
import org.apache.commons.lang3.StringUtils;

/**
 * Provides basic authentication functions for verifying tokens.
 *
 * @author <a href="mailto:jesse.sightler@gmail.com">Jesse Sightler</a>
 */
public class KeycloakAuthenticator
{
    public static final String PROPERTY_KEYCLOAK_URL = "keycloak.server.url";

    /**
     * Authenticate the given keycloak token with the keycloak server.
     *
     * The host of the current server is included in the request, to cover the case where the keycloak url setting
     * is a relative url.
     *
     * @param token
     * @throws KeycloakAuthenticationException
     */
    public static void validateToken(String serverHost, String token) throws KeycloakAuthenticationException
    {
        String keycloakUrl = getKeycloakUrl(serverHost);

        if (!keycloakUrl.endsWith("/"))
            keycloakUrl += "/";

        String fullUrl = keycloakUrl + "realms/rhamt/protocol/openid-connect/userinfo";

        try
        {
            URLConnection urlConnection = new URL(fullUrl).openConnection();
            urlConnection.setRequestProperty("Authorization", "Bearer " + token);

            try (InputStream inputStream = urlConnection.getInputStream())
            {
                if (((HttpURLConnection) urlConnection).getResponseCode() != 200)
                    throw new KeycloakAuthenticationException("Failed to authenticate request!");

                // Just consume it... the main thing is that it must be a 200 code
                IOUtils.toByteArray(inputStream);
            }
        }
        catch (Exception e)
        {
            throw new KeycloakAuthenticationException("Could not authenticate due to: " + e.getMessage(), e);
        }
    }

    private static String getKeycloakUrl(String serverHost)
    {

        String keycloakUrl = System.getProperty(PROPERTY_KEYCLOAK_URL);
        if (StringUtils.isBlank(keycloakUrl))
            throw new RuntimeException("Could not read keycloak urk from system properties... expected in: " + PROPERTY_KEYCLOAK_URL);

        if (!keycloakUrl.toLowerCase().startsWith("http"))
            keycloakUrl = "http://" + serverHost + keycloakUrl;

        return keycloakUrl;
    }
}
