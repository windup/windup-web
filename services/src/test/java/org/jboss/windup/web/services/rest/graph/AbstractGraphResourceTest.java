package org.jboss.windup.web.services.rest.graph;

import org.jboss.arquillian.container.test.api.Deployment;
import org.jboss.arquillian.test.api.ArquillianResource;
import org.jboss.resteasy.client.jaxrs.ResteasyClient;
import org.jboss.resteasy.client.jaxrs.ResteasyWebTarget;
import org.jboss.shrinkwrap.api.spec.WebArchive;
import org.jboss.windup.web.addons.websupport.rest.GraphPathLookup;
import org.jboss.windup.web.addons.websupport.rest.graph.ClassificationResource;
import org.jboss.windup.web.addons.websupport.rest.graph.FileModelResource;
import org.jboss.windup.web.addons.websupport.rest.graph.GraphResource;
import org.jboss.windup.web.addons.websupport.rest.graph.HintResource;
import org.jboss.windup.web.addons.websupport.rest.graph.LinkResource;
import org.jboss.windup.web.addons.websupport.rest.graph.TechnologyTagResource;
import org.jboss.windup.web.services.AbstractTest;
import org.jboss.windup.web.services.ServiceTestUtil;
import org.jboss.windup.web.services.data.ServiceConstants;
import org.jboss.windup.web.services.data.WindupExecutionUtil;
import org.jboss.windup.web.services.model.ApplicationGroup;
import org.jboss.windup.web.services.model.WindupExecution;
import org.jboss.windup.web.services.rest.ApplicationGroupEndpoint;
import org.junit.Before;
import org.junit.Rule;
import org.junit.rules.TestName;

import javax.ws.rs.Consumes;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.UriInfo;
import java.net.URL;
import java.util.Collection;
import java.util.Optional;

/**
 * @author <a href="mailto:jesse.sightler@gmail.com">Jesse Sightler</a>
 */
public abstract class AbstractGraphResourceTest
{
    @ArquillianResource
    private URL contextPath;

    @Rule
    public TestName name = new TestName();


    GraphResource graphResource;
    ApplicationGroupEndpoint applicationGroupEndpoint;

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
        ResteasyClient client = ServiceTestUtil.getResteasyClient();
        ResteasyWebTarget target = client.target(contextPath + ServiceConstants.REST_BASE);
        ResteasyWebTarget furnaceRestTarget = client.target(contextPath + ServiceConstants.FURNACE_REST_BASE);

        this.applicationGroupEndpoint = target.proxy(ApplicationGroupEndpoint.class);
        this.graphResource = furnaceRestTarget.proxy(GraphResourceTest.GraphResourceSubInterface.class);

        if (this.execution != null)
            return;

        Collection<ApplicationGroup> groups = this.applicationGroupEndpoint.getApplicationGroups();
        Optional<WindupExecution> existingExecution = groups
                .stream()
                .map(group -> group.getExecutions())
                .filter(executions -> !executions.isEmpty())
                .map(executions -> executions.iterator().next())
                .findFirst();
        if (existingExecution.isPresent())
            this.execution = existingExecution.get();

        if (execution == null)
        {
            System.out.println("Executing windup!!!");
            printDebugging(groups);

            WindupExecutionUtil windupExecutionUtil = new WindupExecutionUtil(client, target);
            this.execution = windupExecutionUtil.executeWindup();
        } else
        {
            System.out.println("Not Executing windup!!!");
            printDebugging(groups);
        }
    }

    protected LinkResource getLinkResource(ResteasyWebTarget target)
    {
        return target.proxy(LinkResourceSubclass.class);
    }

    protected TechnologyTagResource getTechnologyTagResource(ResteasyWebTarget target)
    {
        return target.proxy(TechnologyTagResourceSubclass.class);
    }

    protected FileModelResource getFileResource(ResteasyWebTarget target)
    {
        return target.proxy(FileModelResourceSubclass.class);
    }

    protected ClassificationResource getClassificationResource(ResteasyWebTarget target)
    {
        return target.proxy(ClassificationResourceSubclass.class);
    }

    protected HintResource getHintResource(ResteasyWebTarget target)
    {
        return target.proxy(HintResourceSubclass.class);
    }

    private void printDebugging(Collection<ApplicationGroup> groups)
    {
        System.out.println(Thread.currentThread().getName() + ", " + name.getMethodName() + ": Executing windup!!!! " + groups.size());
        for (ApplicationGroup group : groups)
        {
            System.out.println("\tGroup: " + group.getId() + ": " + group.getTitle());
            for (WindupExecution execution : group.getExecutions())
            {
                System.out.println("\t\tExecution: " + execution.getId() + " state: " + execution.getState() + " path: " + execution.getOutputPath());
            }
        }
    }

    /**
     * This exists solely to work around RESTEASY-798. Without it, the client proxy will fail to be generated when it
     * hits the unannotated methods.
     */
    @Path(ClassificationResource.BASE_URL)
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public interface ClassificationResourceSubclass extends ClassificationResource
    {
        @Override
        @POST
        void setUriInfo(UriInfo uriInfo);

        @Override
        @POST
        void setGraphPathLookup(GraphPathLookup graphPathLookup);
    }

    /**
     * This exists solely to work around RESTEASY-798. Without it, the client proxy will fail to be generated when it
     * hits the unannotated methods.
     */
    @Path(FileModelResource.FILE_MODEL_RESOURCE_URL)
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public interface FileModelResourceSubclass extends FileModelResource
    {
        @Override
        @POST
        void setUriInfo(UriInfo uriInfo);

        @Override
        @POST
        void setGraphPathLookup(GraphPathLookup graphPathLookup);
    }

    /**
     * This exists solely to work around RESTEASY-798. Without it, the client proxy will fail to be generated when it
     * hits the unannotated methods.
     */
    @Path(HintResource.BASE_URL)
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public interface HintResourceSubclass extends HintResource
    {
        @Override
        @POST
        void setUriInfo(UriInfo uriInfo);

        @Override
        @POST
        void setGraphPathLookup(GraphPathLookup graphPathLookup);
    }

    /**
     * This exists solely to work around RESTEASY-798. Without it, the client proxy will fail to be generated when it
     * hits the unannotated methods.
     */
    @Path(TechnologyTagResource.BASE_URL)
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public interface TechnologyTagResourceSubclass extends TechnologyTagResource
    {
        @Override
        @POST
        void setUriInfo(UriInfo uriInfo);

        @Override
        @POST
        void setGraphPathLookup(GraphPathLookup graphPathLookup);
    }

    /**
     * This exists solely to work around RESTEASY-798. Without it, the client proxy will fail to be generated when it
     * hits the unannotated methods.
     */
    @Path(LinkResource.BASE_URL)
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public interface LinkResourceSubclass extends LinkResource
    {
        @Override
        @POST
        void setUriInfo(UriInfo uriInfo);

        @Override
        @POST
        void setGraphPathLookup(GraphPathLookup graphPathLookup);
    }
}
