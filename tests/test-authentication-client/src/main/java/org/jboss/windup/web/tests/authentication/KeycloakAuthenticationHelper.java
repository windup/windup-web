package org.jboss.windup.web.tests.authentication;

import org.keycloak.authorization.client.AuthzClient;

import java.util.logging.Logger;

/**
 * @author <a href="mailto:jesse.sightler@gmail.com">Jesse Sightler</a>
 */
public class KeycloakAuthenticationHelper {
    private static Logger LOG = Logger.getLogger(KeycloakAuthenticationHelper.class.getName());

    public static final String DEFAULT_USER = "windup";
    public static final String DEFAULT_PASSWORD = "password";

    public static final void main(String[] argv) {
        getAccessToken();
    }

    public static String getAccessToken() {
        LOG.fine("Creating authorization client...");
        // create a new instance based on the configuration define at keycloak-authz.json
        AuthzClient authzClient = AuthzClient.create();
        LOG.fine("Requesting token...");
        String token = authzClient.obtainAccessToken(DEFAULT_USER, DEFAULT_PASSWORD).getToken();
        LOG.fine("Retrieved token: " + token);
        return token;
    }
}