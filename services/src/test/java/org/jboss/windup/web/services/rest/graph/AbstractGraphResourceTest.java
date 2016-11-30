package org.jboss.windup.web.services.rest.graph;

import org.jboss.arquillian.container.test.api.Deployment;
import org.jboss.arquillian.test.api.ArquillianResource;
import org.jboss.resteasy.client.jaxrs.ResteasyClient;
import org.jboss.resteasy.client.jaxrs.ResteasyWebTarget;
import org.jboss.shrinkwrap.api.spec.WebArchive;
import org.jboss.windup.web.addons.websupport.rest.graph.GraphResource;
import org.jboss.windup.web.services.AbstractTest;
import org.jboss.windup.web.services.data.ServiceConstants;
import org.jboss.windup.web.services.data.WindupExecutionUtil;
import org.jboss.windup.web.services.model.WindupExecution;
import org.junit.Before;

import java.net.URL;

/**
 * @author <a href="mailto:jesse.sightler@gmail.com">Jesse Sightler</a>
 */
public abstract class AbstractGraphResourceTest extends AbstractTest
{
    @ArquillianResource
    private URL contextPath;

    GraphResource graphResource;
    WindupExecution execution;

    @Deployment
    public static WebArchive createDeployment()
    {
        WebArchive war = AbstractTest.createDeployment();
        war.addAsResource("META-INF/persistence-ondisk.xml", "/WEB-INF/classes/META-INF/persistence.xml");
        return war;
    }

    @Before
    public void setUp() throws Exception
    {
        ResteasyClient client = getResteasyClient();
        ResteasyWebTarget target = client.target(contextPath + ServiceConstants.REST_BASE);
        ResteasyWebTarget furnaceRestTarget = client.target(contextPath + ServiceConstants.FURNACE_REST_BASE);

        this.graphResource = furnaceRestTarget.proxy(GraphResourceTest.GraphResourceSubInterface.class);

        if (this.execution == null)
        {
            System.out.println("Executing windup!!!!");
            WindupExecutionUtil windupExecutionUtil = new WindupExecutionUtil(client, target);
            this.execution = windupExecutionUtil.executeWindup();
        }
    }

}
