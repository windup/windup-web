package org.jboss.windup.web.services.rest;

import java.net.URL;
import java.util.List;
import java.util.Map;

import org.jboss.arquillian.container.test.api.RunAsClient;
import org.jboss.arquillian.junit.Arquillian;
import org.jboss.arquillian.test.api.ArquillianResource;
import org.jboss.resteasy.client.jaxrs.ResteasyClient;
import org.jboss.resteasy.client.jaxrs.ResteasyWebTarget;
import org.jboss.windup.config.ConfigurationOption;
import org.jboss.windup.web.services.AbstractTest;
import org.jboss.windup.web.services.data.ServiceConstants;
import org.junit.Assert;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;

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
        ResteasyClient client = getResteasyClient();
        String uri = contextPath + "rest/" + ConfigurationOptionsEndpoint.CONFIGURATION_OPTIONS_PATH;
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
}
