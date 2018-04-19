package org.jboss.windup.web.services;

import java.io.InputStream;
import java.net.HttpURLConnection;
import java.net.Socket;
import java.net.URL;
import java.net.URLConnection;
import java.security.KeyManagementException;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.security.cert.CertificateException;
import java.security.cert.X509Certificate;
import java.util.logging.Logger;

import org.apache.commons.io.IOUtils;
import org.apache.commons.lang3.StringUtils;

import javax.net.ssl.HostnameVerifier;
import javax.net.ssl.HttpsURLConnection;
import javax.net.ssl.SSLContext;
import javax.net.ssl.SSLEngine;
import javax.net.ssl.SSLSession;
import javax.net.ssl.TrustManager;
import javax.net.ssl.X509ExtendedTrustManager;

/**
 * Provides basic authentication functions for verifying tokens.
 *
 * @author <a href="mailto:jesse.sightler@gmail.com">Jesse Sightler</a>
 */
public class KeycloakAuthenticator
{
    public static final String PROPERTY_KEYCLOAK_URL = "keycloak.server.url";
    public static final String TRUST_ALL = "keycloak.trust.all.ssl";
    private static Logger LOG = Logger.getLogger(KeycloakAuthenticator.class.getCanonicalName());

    /**
     * Authenticate the given keycloak token with the keycloak server.
     *
     * The host of the current server is included in the request, to cover the case where the keycloak url setting
     * is a relative url.
     *
     * @param token
     * @throws KeycloakAuthenticationException
     */
    public static void validateToken(boolean ssl, String serverHost, String token) throws KeycloakAuthenticationException
    {
        String keycloakUrl = getKeycloakUrl(ssl, serverHost);

        if (!keycloakUrl.endsWith("/"))
            keycloakUrl += "/";

        String fullUrl = keycloakUrl + "realms/rhamt/protocol/openid-connect/userinfo";
        try
        {
            URLConnection urlConnection = new URL(fullUrl).openConnection();
            if (urlConnection instanceof HttpsURLConnection)
            {
                HttpsURLConnection httpsConnection = (HttpsURLConnection)urlConnection;
                if (Boolean.getBoolean(TRUST_ALL)) // Yes, this method actually checks system properties :)
                    trustAll(httpsConnection);
            }

            urlConnection.setRequestProperty("Authorization", "Bearer " + token);
            LOG.fine("Sending authorization request to: " + fullUrl + " with token: " + token);

            try (InputStream inputStream = urlConnection.getInputStream())
            {
                int responseCode = ((HttpURLConnection) urlConnection).getResponseCode();

                // Just consume it... the main thing is that it must be a 200 code
                byte[] result = IOUtils.toByteArray(inputStream);
                LOG.fine("Authentication request response data: " + new String(result));

                if (responseCode != 200)
                    throw new KeycloakAuthenticationException("Failed to authenticate request (" + responseCode + "!");
            }
        }
        catch (Exception e)
        {
            throw new KeycloakAuthenticationException("Could not authenticate due to: " + e.getMessage(), e);
        }
    }

    private static String getKeycloakUrl(boolean ssl, String serverHost)
    {

        String keycloakUrl = System.getProperty(PROPERTY_KEYCLOAK_URL);
        if (StringUtils.isBlank(keycloakUrl))
            throw new RuntimeException("Could not read keycloak url from system properties... expected in: " + PROPERTY_KEYCLOAK_URL);

        String prefix = ssl ? "https" : "http";

        if (!keycloakUrl.toLowerCase().startsWith("http"))
            keycloakUrl = prefix + "://" + serverHost + keycloakUrl;

        LOG.fine("Keycloak authentication URL: " + keycloakUrl + " was ssl? " + ssl);
        return keycloakUrl;
    }

    private static void trustAll(HttpsURLConnection httpsConnection) throws KeyManagementException, NoSuchAlgorithmException {
        LOG.fine("Enabling SSL trust for keycloak connection...");
        httpsConnection.setHostnameVerifier(new HostnameVerifier() {
            @Override
            public boolean verify(String s, SSLSession sslSession) {
                return true;
            }
        });
        SSLContext sslContext = SSLContext.getInstance("SSL");
        TrustManager[] trustAllCerts = new TrustManager[] {
                new X509ExtendedTrustManager() {
                    @Override
                    public void checkClientTrusted(X509Certificate[] x509Certificates, String s, Socket socket) throws CertificateException {

                    }

                    @Override
                    public void checkServerTrusted(X509Certificate[] x509Certificates, String s, Socket socket) throws CertificateException {

                    }

                    @Override
                    public void checkClientTrusted(X509Certificate[] x509Certificates, String s, SSLEngine sslEngine) throws CertificateException {

                    }

                    @Override
                    public void checkServerTrusted(X509Certificate[] x509Certificates, String s, SSLEngine sslEngine) throws CertificateException {

                    }

                    @Override
                    public void checkClientTrusted(X509Certificate[] x509Certificates, String s) throws CertificateException {

                    }

                    @Override
                    public void checkServerTrusted(X509Certificate[] x509Certificates, String s) throws CertificateException {

                    }

                    @Override
                    public X509Certificate[] getAcceptedIssuers() {
                        return null;
                    }
                }
        };
        sslContext.init(null, trustAllCerts, new SecureRandom());

        httpsConnection.setSSLSocketFactory(sslContext.getSocketFactory());
    }
}
