package org.jboss.windup.web.ui;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.logging.Logger;

import javax.servlet.ServletContext;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import freemarker.template.ObjectWrapper;
import freemarker.template.SimpleHash;
import freemarker.template.TemplateMethodModelEx;
import freemarker.template.TemplateModel;
import freemarker.template.TemplateModelException;
import org.apache.commons.lang3.StringUtils;

/**
 * Overridden Freemarker Servlet that includes the following Map in the template model: - keycloak - publicKey - serverUrl
 *
 * This will also automatically append the ".ftl" extension during template path resolution for files that end with ".html" or ".json".
 *
 * @author <a href="mailto:jesse.sightler@gmail.com">Jesse Sightler</a>
 */
public class FreemarkerServlet extends freemarker.ext.servlet.FreemarkerServlet
{
    public static final String USER_PRINCIPAL = "userPrincipal";
    public static final String KEYCLOAK = "keycloak";
    public static final String PUBLIC_KEY = "publicKey";
    public static final String SERVER_URL = "serverUrl";
    private static Logger LOG = Logger.getLogger(FreemarkerServlet.class.getName());

    @Override
    protected TemplateModel createModel(ObjectWrapper objectWrapper, ServletContext servletContext, HttpServletRequest request,
                HttpServletResponse response) throws TemplateModelException
    {
        TemplateModel templateModel = super.createModel(objectWrapper, servletContext, request, response);
        if (templateModel instanceof SimpleHash)
        {
            SimpleHash hashModel = (SimpleHash) templateModel;

            if (request.getUserPrincipal() != null)
            {
                hashModel.put(USER_PRINCIPAL, request.getUserPrincipal().getName());
            }
            else
            {
                hashModel.put(USER_PRINCIPAL, null);
            }

            // The superclass seems to try to put these into the hash, but the code doesn't seem to work.
            // Thus, it is repeated here.
            hashModel.put("request", request);
            hashModel.put("response", response);

            hashModel.put("dispatchRequest", new TemplateMethodModelEx()
            {
                @SuppressWarnings("rawtypes")
                @Override
                public Object exec(List arguments) throws TemplateModelException
                {
                    String page = arguments.get(0).toString();
                    try
                    {
                        request.getRequestDispatcher(page).forward(request, response);
                        return null;
                    }
                    catch (Throwable t)
                    {
                        throw new RuntimeException(t);
                    }
                }
            });

            Map<String, String> keycloakProperties = new HashMap<>();
            keycloakProperties.put(PUBLIC_KEY, System.getProperty("keycloak.realm.public.key"));
            keycloakProperties.put(SERVER_URL, System.getProperty("keycloak.server.url"));

            hashModel.put(KEYCLOAK, keycloakProperties);

            String serverURI = request.getRequestURI();
            String serverAddress = request.getRequestURL().toString().replace(serverURI, "");
            String serverAddressWithContextPath = serverAddress.concat(request.getContextPath());

            hashModel.put("serverUrl", serverAddressWithContextPath);
            hashModel.put("basePath", request.getContextPath() + "/");

            /*
             * 1) Read env. variable, if set,
             * 2) If not, use system property rhamt.apiServer.url as fallback,
             * 3) If system property not set, use current address + rhamt-web-services as fallback
             */
            String apiServerUrl = this.readEnvVariable(
                    "RHAMT_API_SERVER_URL",
                    System.getProperty("rhamt.apiServer.url", serverAddress + "/rhamt-web/api")
            );

            hashModel.put("apiServerUrl", apiServerUrl);
            hashModel.put("graphApiServerUrl", apiServerUrl.concat("/furnace"));
            hashModel.put("staticReportServerUrl", apiServerUrl.concat("/static-report"));
        }

        deriveResponseContentType(request, response);
        return templateModel;
    }

    /**
     * Reads env. variable, if set. If not, uses fallbackValue
     */
    protected String readEnvVariable(String envVariableName, String fallbackValue)
    {
        String value = System.getenv(envVariableName);

        if (value == null)
        {
            LOG.info("Env. variable " + envVariableName + " not set, using fallback value");
            value = fallbackValue;
        }

        return value;
    }

    @Override
    protected String requestUrlToTemplatePath(HttpServletRequest request) throws ServletException
    {
        String superPath = super.requestUrlToTemplatePath(request);
        LOG.info("Resolving freemarker path from: " + superPath);

        if (superPath.endsWith(".html") || superPath.endsWith(".json"))
        {
            superPath += ".ftl";
        }
        LOG.info("Resolved freemarker path to: " + superPath);
        return superPath;
    }


    private void deriveResponseContentType(HttpServletRequest request, HttpServletResponse response)
    {
        Map<String, String> suffixToMimeType = new HashMap<>();
        suffixToMimeType.put("html", "text/html");
        suffixToMimeType.put("xml", "text/xml");
        suffixToMimeType.put("json", "application/json");
        suffixToMimeType.put("js", "application/javascript");
        suffixToMimeType.put("ts", "application/x-typescript");

        String suffix = StringUtils.removeEnd(request.getPathInfo(), ".ftl");
        suffix = StringUtils.substringAfterLast(suffix, ".");

        // Just assume html if there is no other suffix.
        if (suffix == null)
            suffix = "html";

        String mimeType = suffixToMimeType.get(suffix);
        if (mimeType != null)
            response.setContentType(mimeType + ";charset=UTF-8");
    }
}
