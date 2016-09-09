package org.jboss.windup.web.services.rest;

import org.jboss.arquillian.container.test.api.RunAsClient;
import org.jboss.arquillian.junit.Arquillian;
import org.jboss.arquillian.test.api.ArquillianResource;
import org.jboss.arquillian.warp.WarpTest;
import org.jboss.resteasy.client.jaxrs.ResteasyClient;
import org.jboss.resteasy.client.jaxrs.ResteasyClientBuilder;
import org.jboss.resteasy.client.jaxrs.ResteasyWebTarget;
import org.jboss.resteasy.plugins.providers.RegisterBuiltin;
import org.jboss.resteasy.spi.ResteasyProviderFactory;
import org.jboss.windup.web.services.AbstractTest;
import org.jboss.windup.web.services.model.AnalysisContext;
import org.jboss.windup.web.services.model.ApplicationGroup;
import org.jboss.windup.web.services.model.MigrationPath;
import org.junit.Assert;
import org.junit.Before;
import org.junit.BeforeClass;
import org.junit.Test;
import org.junit.runner.RunWith;

import java.net.URL;
import java.util.Collections;

/**
 * @author <a href="mailto:jesse.sightler@gmail.com">Jesse Sightler</a>
 */
@WarpTest
@RunWith(Arquillian.class)
public class AnalysisContextEndpointTest extends AbstractTest
{
    @ArquillianResource
    private URL contextPath;

    private ApplicationGroupEndpoint applicationGroupEndpoint;
    private MigrationPathEndpoint migrationPathEndpoint;
    private AnalysisContextEndpoint analysisContextEndpoint;

    @BeforeClass
    public static void setUpClass() throws Exception
    {
        // initializes the rest easy client framework
        RegisterBuiltin.register(ResteasyProviderFactory.getInstance());
    }

    @Before
    public void setUp()
    {
        ResteasyClient client = getResteasyClient();
        ResteasyWebTarget target = client.target(contextPath + "rest");

        this.applicationGroupEndpoint = target.proxy(ApplicationGroupEndpoint.class);
        this.migrationPathEndpoint = target.proxy(MigrationPathEndpoint.class);
        this.analysisContextEndpoint = target.proxy(AnalysisContextEndpoint.class);
    }

    @Test
    @RunAsClient
    public void testEndpoint()
    {
        ApplicationGroup group = createGroup();

        // Just grab the first one (this is completely arbitrary)
        MigrationPath path = migrationPathEndpoint.getAvailablePaths().iterator().next();

        AnalysisContext analysisContext = new AnalysisContext();
        analysisContext.setApplicationGroup(group);
        analysisContext.setMigrationPath(path);
        analysisContext.setPackages(Collections.singleton("include"));
        analysisContext.setExcludePackages(Collections.singleton("exclude"));

        analysisContext = analysisContextEndpoint.create(analysisContext);

        AnalysisContext loaded = analysisContextEndpoint.get(analysisContext.getId());
        Assert.assertEquals(analysisContext.getId(), loaded.getId());

        Assert.assertEquals(1, loaded.getPackages().size());
        Assert.assertEquals("include", loaded.getPackages().iterator().next());

        Assert.assertEquals(1, loaded.getExcludePackages().size());
        Assert.assertEquals("exclude", loaded.getExcludePackages().iterator().next());

        Assert.assertEquals(path, loaded.getMigrationPath());

        Assert.assertEquals(group, loaded.getApplicationGroup());
    }

    private ApplicationGroup createGroup()
    {
        ApplicationGroup group = new ApplicationGroup();
        group.setTitle("Group 1");
        return applicationGroupEndpoint.create(group);
    }
}
