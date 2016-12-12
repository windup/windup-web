package org.jboss.windup.web.services.rest;

import java.net.URL;
import java.util.Collections;

import org.jboss.arquillian.container.test.api.RunAsClient;
import org.jboss.arquillian.junit.Arquillian;
import org.jboss.arquillian.test.api.ArquillianResource;
import org.jboss.resteasy.client.jaxrs.ResteasyClient;
import org.jboss.resteasy.client.jaxrs.ResteasyWebTarget;
import org.jboss.windup.web.services.AbstractTest;
import org.jboss.windup.web.services.ServiceTestUtil;
import org.jboss.windup.web.services.data.DataProvider;
import org.jboss.windup.web.services.data.ServiceConstants;
import org.jboss.windup.web.services.model.*;
import org.jboss.windup.web.services.model.Package;
import org.jboss.windup.web.services.model.RulesPath.RulesPathType;
import org.junit.Assert;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;

/**
 * @author <a href="mailto:jesse.sightler@gmail.com">Jesse Sightler</a>
 */
@RunWith(Arquillian.class)
public class AnalysisContextEndpointTest extends AbstractTest
{
    @ArquillianResource
    private URL contextPath;

    private ApplicationGroupEndpoint applicationGroupEndpoint;
    private MigrationPathEndpoint migrationPathEndpoint;
    private AnalysisContextEndpoint analysisContextEndpoint;
    private ConfigurationEndpoint configurationEndpoint;
    private DataProvider dataProvider;
    private ResteasyClient client;
    private ResteasyWebTarget target;
    
    @Before
    public void setUp()
    {
        this.client = ServiceTestUtil.getResteasyClient();
        this.target = client.target(contextPath + ServiceConstants.REST_BASE);
        this.dataProvider = new DataProvider(target);

        this.applicationGroupEndpoint = target.proxy(ApplicationGroupEndpoint.class);
        this.migrationPathEndpoint = target.proxy(MigrationPathEndpoint.class);
        this.analysisContextEndpoint = target.proxy(AnalysisContextEndpoint.class);
        this.configurationEndpoint = target.proxy(ConfigurationEndpoint.class);
    }

    @Test
    @RunAsClient
    public void testEndpointWithExistingCustomRules()
    {
        ApplicationGroup group = createGroup();

        // Just grab the first one (this is completely arbitrary)
        MigrationPath path = migrationPathEndpoint.getAvailablePaths().iterator().next();

        Configuration configuration = configurationEndpoint.getConfiguration();
        configuration.setRulesPaths(Collections.singleton(new RulesPath(ConfigurationEndpointTest.CUSTOM_RULESPATH, RulesPathType.USER_PROVIDED)));
        configurationEndpoint.saveConfiguration(configuration);

        AnalysisContext analysisContext = new AnalysisContext(group);
        analysisContext.setMigrationPath(path);

        analysisContext.setRulesPaths(configurationEndpoint.getConfiguration().getRulesPaths());

        analysisContext = analysisContextEndpoint.create(analysisContext);

        AnalysisContext loaded = analysisContextEndpoint.get(analysisContext.getId());
        Assert.assertNotNull(loaded);

        Assert.assertEquals(analysisContext.getId(), loaded.getId());

        Assert.assertEquals(path, loaded.getMigrationPath());

        Assert.assertEquals(group, loaded.getApplicationGroup());
        Assert.assertEquals(1, loaded.getRulesPaths().size());
    }

    private ApplicationGroup createGroup()
    {
        MigrationProject dummyProject = this.dataProvider.getMigrationProject();
        return this.dataProvider.getApplicationGroup(dummyProject);
    }
}
