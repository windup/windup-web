package org.jboss.windup.web.services.rest;

import java.net.URL;
import java.util.List;
import java.util.Map;

import org.jboss.arquillian.container.test.api.RunAsClient;
import org.jboss.arquillian.junit.Arquillian;
import org.jboss.arquillian.test.api.ArquillianResource;
import org.jboss.resteasy.client.jaxrs.ResteasyClient;
import org.jboss.resteasy.client.jaxrs.ResteasyWebTarget;
import org.jboss.windup.exec.configuration.options.UserIgnorePathOption;
import org.jboss.windup.rules.apps.java.config.SourceModeOption;
import org.jboss.windup.web.services.AbstractTest;
import org.jboss.windup.web.services.ServiceTestUtil;
import org.jboss.windup.web.services.model.AdvancedOption;
import org.junit.Assert;
import org.junit.Test;
import org.junit.runner.RunWith;

import javax.ws.rs.client.Entity;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

/**
 * @author <a href="mailto:jesse.sightler@gmail.com">Jesse Sightler</a>
 */
@RunWith(Arquillian.class)
public class ConfigurationOptionsEndpointTest extends AbstractTest
{
    @ArquillianResource
    private URL contextPath;

    @Test
    @RunAsClient
    public void testConfigurationOptionsList() throws Exception
    {
        ResteasyClient client = ServiceTestUtil.getResteasyClient();
        String uri = contextPath + ConfigurationOptionsEndpoint.CONFIGURATION_OPTIONS_PATH;
        ResteasyWebTarget target = client.target(uri);
        Response response = target.request().get();
        Assert.assertEquals(200, response.getStatus());

        // Just read it as a List of Maps, as ConfigurationOption can't easily be deserialized by jackson (abstract class).
        List<?> optionList = response.readEntity(List.class);
        Assert.assertNotNull(optionList);
        Assert.assertTrue(optionList.size() > 1);

        int previousPriority = Integer.MIN_VALUE;
        for (Map<String, Object> option : (List<Map<String, Object>>)optionList)
        {
            int priority = (int)option.get("priority");
            if (priority < previousPriority)
                Assert.fail("Options are not listed in priority order");
        }
        response.close();
    }

    @Test
    @RunAsClient
    public void testValidationOkBoolean() throws Exception
    {
        Assert.assertTrue(validateOption(SourceModeOption.NAME, "true"));
    }

    @Test
    @RunAsClient
    public void testValidationBadPath() throws Exception
    {
        Assert.assertFalse(validateOption(UserIgnorePathOption.NAME, "/not/really/here"));
    }

    @Test
    @RunAsClient
    public void testValidationOkPath() throws Exception
    {
        Assert.assertTrue(validateOption(UserIgnorePathOption.NAME, "src/main/java"));
    }

    private boolean validateOption(String name, String value) {
        ResteasyClient client = ServiceTestUtil.getResteasyClient();
        String uri = contextPath + ConfigurationOptionsEndpoint.CONFIGURATION_OPTIONS_PATH + "/" + ConfigurationOptionsEndpoint.VALIDATE_OPTION;
        ResteasyWebTarget target = client.target(uri);

        AdvancedOption option = new AdvancedOption();
        option.setName(name);
        option.setValue(value);

        Response response = target.request().post(Entity.entity(option, MediaType.APPLICATION_JSON_TYPE));
        Assert.assertEquals(200, response.getStatus());

        Map<String, Object> optionMap = response.readEntity(Map.class);
        switch ((String)optionMap.get("level"))
        {
            case "SUCCESS":
            case "WARNING":
                return true;
            default:
                return false;
        }
    }
}
