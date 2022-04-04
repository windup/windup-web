package org.jboss.windup.web.services.rest;

import org.jboss.arquillian.container.test.api.RunAsClient;
import org.jboss.arquillian.junit.Arquillian;
import org.jboss.arquillian.test.api.ArquillianResource;
import org.jboss.resteasy.client.jaxrs.ResteasyClient;
import org.jboss.resteasy.client.jaxrs.ResteasyWebTarget;
import org.jboss.windup.exec.configuration.options.SourceOption;
import org.jboss.windup.exec.configuration.options.TargetOption;
import org.jboss.windup.web.services.AbstractTest;
import org.jboss.windup.web.services.ServiceTestUtil;
import org.jboss.windup.web.services.SourceTargetTechnologies;
import org.jboss.windup.web.services.data.DataProvider;
import org.jboss.windup.web.services.data.ServiceConstants;
import org.jboss.windup.web.services.model.AdvancedOption;
import org.jboss.windup.web.services.model.AnalysisContext;
import org.jboss.windup.web.services.model.Configuration;
import org.jboss.windup.web.services.model.MigrationPath;
import org.jboss.windup.web.services.model.MigrationProject;
import org.jboss.windup.web.services.model.PathType;
import org.jboss.windup.web.services.model.RulesPath;
import org.jboss.windup.web.services.model.ScopeType;
import org.json.JSONException;
import org.json.JSONObject;
import org.junit.Assert;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;

import javax.ws.rs.core.Response;
import java.net.URL;
import java.util.Arrays;
import java.util.Collections;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

/**
 * @author <a href="mailto:jesse.sightler@gmail.com">Jesse Sightler</a>
 */
@RunWith(Arquillian.class)
public class AnalysisContextEndpointTest extends AbstractTest
{
    @ArquillianResource
    private URL contextPath;

    private MigrationPathEndpoint migrationPathEndpoint;
    private AnalysisContextEndpoint analysisContextEndpoint;
    private ConfigurationEndpoint configurationEndpoint;
    private RuleEndpoint ruleEndpoint;
    private DataProvider dataProvider;
    private ResteasyClient client;
    private ResteasyWebTarget target;

    @Before
    public void setUp()
    {
        this.client = ServiceTestUtil.getResteasyClient();
        this.target = client.target(contextPath + ServiceConstants.REST_BASE);
        this.dataProvider = new DataProvider(target);

        this.migrationPathEndpoint = target.proxy(MigrationPathEndpoint.class);
        this.analysisContextEndpoint = target.proxy(AnalysisContextEndpoint.class);
        this.configurationEndpoint = target.proxy(ConfigurationEndpoint.class);
        this.ruleEndpoint = target.proxy(RuleEndpoint.class);
    }

    @Test
    @RunAsClient
    public void testEndpointWithExistingCustomRules() throws JSONException {
        // Just grab the first one (this is completely arbitrary)
        MigrationPath path = migrationPathEndpoint.getAvailablePaths().iterator().next();

        Configuration configuration = configurationEndpoint.getGlobalConfiguration();
        configuration.setRulesPaths(Collections.singleton(new RulesPath(ConfigurationEndpointTest.CUSTOM_RULESPATH, PathType.USER_PROVIDED, ScopeType.GLOBAL)));
        configurationEndpoint.saveConfiguration(configuration.getId(), configuration);

        MigrationProject project = this.dataProvider.getMigrationProject();
        AnalysisContext analysisContext = this.dataProvider.getAnalysisContext(project);
        analysisContext.setMigrationPath(path);
        analysisContext.setCloudTargetsIncluded(true);
        analysisContext.setLinuxTargetsIncluded(true);
        analysisContext.setOpenJdkTargetsIncluded(true);

        analysisContext.setRulesPaths(configurationEndpoint.getGlobalConfiguration().getRulesPaths());

        analysisContext = analysisContextEndpoint.saveAsProjectDefault(analysisContext, project.getId(), false, true);

        AnalysisContext loaded = analysisContextEndpoint.get(analysisContext.getId());

        Response response = target.path("/analysis-context/" + analysisContext.getId()).request().get();
        response.bufferEntity();
        String stringResponse = response.readEntity(String.class);
        JSONObject json = new JSONObject(stringResponse);

        Assert.assertNotNull(loaded);
        Assert.assertEquals(analysisContext.getId(), loaded.getId());
        Assert.assertEquals(path, loaded.getMigrationPath());
        Assert.assertEquals(true, loaded.isCloudTargetsIncluded());
        Assert.assertEquals(true, loaded.isLinuxTargetsIncluded());
        Assert.assertEquals(true, loaded.isOpenJdkTargetsIncluded());
        Assert.assertEquals(1, loaded.getRulesPaths().size());
    }

    @Test
    @RunAsClient
    public void testEndpointWithSkippingChangeToProvisional() throws JSONException {
        MigrationProject project = this.dataProvider.getProvisionalMigrationProject();

        Assert.assertNotNull(project);
        Assert.assertTrue(project.isProvisional());
    }

    @Test
    @RunAsClient
    public void testAnalysisContextCustomTechnologies() throws JSONException {
        // Just grab the first one (this is completely arbitrary)
        MigrationPath path = migrationPathEndpoint.getAvailablePaths().iterator().next();

        // Project configuration
        MigrationProject project = this.dataProvider.getMigrationProject();

        Configuration projectConfiguration = configurationEndpoint.getConfigurationByProject(project.getId());
        projectConfiguration.setRulesPaths(new HashSet<>(List.of(
                new RulesPath(ConfigurationEndpointTest.CUSTOM_RULESPATH_WITH_CUSTOM_TECHNOLOGIES1, PathType.USER_PROVIDED, ScopeType.GLOBAL),
                new RulesPath(ConfigurationEndpointTest.CUSTOM_RULESPATH_WITH_CUSTOM_TECHNOLOGIES2, PathType.USER_PROVIDED, ScopeType.PROJECT)
        )));
        configurationEndpoint.saveConfiguration(projectConfiguration.getId(), projectConfiguration);

        // Create Analysis Context with predefined data
        AnalysisContext analysisContext = this.dataProvider.getAnalysisContext(project);
        analysisContext.setMigrationPath(path);
        analysisContext.setRulesPaths(configurationEndpoint.getConfigurationByProject(project.getId()).getRulesPaths());
        analysisContext = analysisContextEndpoint.saveAsProjectDefault(analysisContext, project.getId(), false, true);

        // Fetch custom technologies
        SourceTargetTechnologies customTechnologies = analysisContextEndpoint.getCustomTechnologies(analysisContext.getId());
        Assert.assertNotNull(customTechnologies);

        Assert.assertEquals(2, customTechnologies.getSources().size());
        Assert.assertTrue(customTechnologies.getSources().contains("myCustomSource1"));
        Assert.assertTrue(customTechnologies.getSources().contains("myCustomSource2"));

        Assert.assertEquals(2, customTechnologies.getTargets().size());
        Assert.assertTrue(customTechnologies.getTargets().contains("myCustomTarget1"));
        Assert.assertTrue(customTechnologies.getTargets().contains("myCustomTarget2"));
    }

    @Test
    @RunAsClient
    public void testAnalysisContextAdvancedOptionsAreSynchronizedWithRulesPath() throws JSONException {
        // Just grab the first one (this is completely arbitrary)
        MigrationPath path = migrationPathEndpoint.getAvailablePaths().iterator().next();

        // Project configuration
        MigrationProject project = this.dataProvider.getMigrationProject();

        Configuration projectConfiguration = configurationEndpoint.getConfigurationByProject(project.getId());
        projectConfiguration.setRulesPaths(new HashSet<>(Arrays.asList(
                new RulesPath(ConfigurationEndpointTest.CUSTOM_RULESPATH_WITH_CUSTOM_TECHNOLOGIES1, PathType.USER_PROVIDED, ScopeType.GLOBAL),
                new RulesPath(ConfigurationEndpointTest.CUSTOM_RULESPATH_WITH_CUSTOM_TECHNOLOGIES2, PathType.USER_PROVIDED, ScopeType.PROJECT)
        )));
        configurationEndpoint.saveConfiguration(projectConfiguration.getId(), projectConfiguration);

        // Create Analysis Context with predefined data
        AnalysisContext analysisContext = this.dataProvider.getAnalysisContext(project);
        analysisContext.setMigrationPath(path);
        analysisContext.setAdvancedOptions(Arrays.asList(
                new AdvancedOption(SourceOption.NAME, "anySourceThatWillBePrunedAndDisappear"),
                new AdvancedOption(TargetOption.NAME, "anySourceThatWillBePrunedAndDisappear")
        ));
        analysisContext.setRulesPaths(configurationEndpoint.getConfigurationByProject(project.getId()).getRulesPaths());
        analysisContext = analysisContextEndpoint.saveAsProjectDefault(analysisContext, project.getId(), false, true);

        // Fetch Analysis Context for verifying its content
        analysisContext = analysisContextEndpoint.get(analysisContext.getId());
        Assert.assertNotNull(analysisContext);

        List<String> sources = analysisContext.getAdvancedOptions().stream()
                .filter(advancedOption -> advancedOption.getName().equals(SourceOption.NAME))
                .map(AdvancedOption::getValue)
                .collect(Collectors.toList());
        List<String> targets = analysisContext.getAdvancedOptions().stream()
                .filter(advancedOption -> advancedOption.getName().equals(TargetOption.NAME))
                .map(AdvancedOption::getValue)
                .collect(Collectors.toList());

        // Verify only Project scoped sources/targets were added automatically to the advanced options and
        // "anySourceThatWillBePrunedAndDisappear, anySourceThatWillBePrunedAndDisappear" should've been pruned
        Assert.assertEquals(1, sources.size());
        Assert.assertEquals("myCustomSource2", sources.get(0));

        Assert.assertEquals(1, targets.size());
        Assert.assertEquals("myCustomTarget2", targets.get(0));
    }

    @Test
    @RunAsClient
    public void testAnalysisContextAdvancedOptionsAreUpdatedWhenRulePathIsDeleted() throws JSONException {
        // Just grab the first one (this is completely arbitrary)
        MigrationPath path = migrationPathEndpoint.getAvailablePaths().iterator().next();

        // Project configuration
        MigrationProject project = this.dataProvider.getMigrationProject();

        Configuration projectConfiguration = configurationEndpoint.getConfigurationByProject(project.getId());
        projectConfiguration.setRulesPaths(new HashSet<>(List.of(
                new RulesPath(ConfigurationEndpointTest.CUSTOM_RULESPATH_WITH_CUSTOM_TECHNOLOGIES1, PathType.USER_PROVIDED, ScopeType.PROJECT)
        )));
        configurationEndpoint.saveConfiguration(projectConfiguration.getId(), projectConfiguration);

        // Create Analysis Context with predefined data
        AnalysisContext analysisContext = this.dataProvider.getAnalysisContext(project);
        analysisContext.setMigrationPath(path);
        analysisContext.setAdvancedOptions(Arrays.asList(
                new AdvancedOption(SourceOption.NAME, "weblogic"),
                new AdvancedOption(TargetOption.NAME, "eap")
        ));
        analysisContext.setRulesPaths(configurationEndpoint.getConfigurationByProject(project.getId()).getRulesPaths());
        analysisContext = analysisContextEndpoint.saveAsProjectDefault(analysisContext, project.getId(), false, true);

        // Fetch Analysis Context for verifying its content
        analysisContext = analysisContextEndpoint.get(analysisContext.getId());
        Assert.assertNotNull(analysisContext);

        List<String> sources = analysisContext.getAdvancedOptions().stream()
                .filter(advancedOption -> advancedOption.getName().equals(SourceOption.NAME))
                .map(AdvancedOption::getValue)
                .collect(Collectors.toList());
        List<String> targets = analysisContext.getAdvancedOptions().stream()
                .filter(advancedOption -> advancedOption.getName().equals(TargetOption.NAME))
                .map(AdvancedOption::getValue)
                .collect(Collectors.toList());

        Assert.assertEquals(2, sources.size());
        Assert.assertTrue(sources.contains("weblogic"));
        Assert.assertTrue(sources.contains("myCustomSource1"));

        Assert.assertEquals(2, targets.size());
        Assert.assertTrue(targets.contains("eap"));
        Assert.assertTrue(targets.contains("myCustomTarget1"));

        // Now we delete RulesPath and see if the custom sources/targets were removed too
        Optional<RulesPath> customProjectScopedRulePath = analysisContext.getRulesPaths().stream()
                .filter(rulesPath -> rulesPath.getRulesPathType().equals(PathType.USER_PROVIDED) && rulesPath.getScopeType().equals(ScopeType.PROJECT))
                .findAny();
        Assert.assertTrue(customProjectScopedRulePath.isPresent());
        ruleEndpoint.deleteRuleProvider(customProjectScopedRulePath.get().getId());

        analysisContext = analysisContextEndpoint.get(analysisContext.getId());
        Assert.assertNotNull(analysisContext);

        sources = analysisContext.getAdvancedOptions().stream()
                .filter(advancedOption -> advancedOption.getName().equals(SourceOption.NAME))
                .map(AdvancedOption::getValue)
                .collect(Collectors.toList());
        targets = analysisContext.getAdvancedOptions().stream()
                .filter(advancedOption -> advancedOption.getName().equals(TargetOption.NAME))
                .map(AdvancedOption::getValue)
                .collect(Collectors.toList());

        Assert.assertEquals(1, sources.size());
        Assert.assertTrue(sources.contains("weblogic"));

        Assert.assertEquals(1, targets.size());
        Assert.assertTrue(targets.contains("eap"));
    }

    @Test
    @RunAsClient
    public void testAnalysisContextDeletesTechnologiesComingFromCustomRules() throws JSONException {
        // Just grab the first one (this is completely arbitrary)
        MigrationPath path = migrationPathEndpoint.getAvailablePaths().iterator().next();

        // Project configuration
        MigrationProject project = this.dataProvider.getMigrationProject();

        Configuration projectConfiguration = configurationEndpoint.getConfigurationByProject(project.getId());
        projectConfiguration.setRulesPaths(new HashSet<>(List.of(
                new RulesPath(ConfigurationEndpointTest.CUSTOM_RULESPATH_WITH_CUSTOM_TECHNOLOGIES1, PathType.USER_PROVIDED, ScopeType.PROJECT)
        )));
        configurationEndpoint.saveConfiguration(projectConfiguration.getId(), projectConfiguration);

        // Create Analysis Context with predefined data
        AnalysisContext analysisContext = this.dataProvider.getAnalysisContext(project);
        analysisContext.setMigrationPath(path);
        analysisContext.setAdvancedOptions(Arrays.asList(
                new AdvancedOption(SourceOption.NAME, "weblogic"),
                new AdvancedOption(TargetOption.NAME, "eap")
        ));
        analysisContext.setRulesPaths(configurationEndpoint.getConfigurationByProject(project.getId()).getRulesPaths());
        analysisContext = analysisContextEndpoint.saveAsProjectDefault(analysisContext, project.getId(), false, true);

        // Fetch Analysis Context for verifying its content
        analysisContext = analysisContextEndpoint.get(analysisContext.getId());
        Assert.assertNotNull(analysisContext);

        List<String> sources = analysisContext.getAdvancedOptions().stream()
                .filter(advancedOption -> advancedOption.getName().equals(SourceOption.NAME))
                .map(AdvancedOption::getValue)
                .collect(Collectors.toList());
        List<String> targets = analysisContext.getAdvancedOptions().stream()
                .filter(advancedOption -> advancedOption.getName().equals(TargetOption.NAME))
                .map(AdvancedOption::getValue)
                .collect(Collectors.toList());

        Assert.assertEquals(2, sources.size());
        Assert.assertTrue(sources.contains("weblogic"));
        Assert.assertTrue(sources.contains("myCustomSource1"));

        Assert.assertEquals(2, targets.size());
        Assert.assertTrue(targets.contains("eap"));
        Assert.assertTrue(targets.contains("myCustomTarget1"));

        // Now we delete the custom source/target and see if the change is persisted
        List<AdvancedOption> advancedOptionsWithoutCustomTechnologies = analysisContext.getAdvancedOptions().stream()
                .filter(advancedOption -> !advancedOption.getValue().equals("myCustomSource1") && !advancedOption.getValue().equals("myCustomTarget1"))
                .collect(Collectors.toList());
        analysisContext.setAdvancedOptions(advancedOptionsWithoutCustomTechnologies);

        analysisContext = analysisContextEndpoint.saveAsProjectDefault(analysisContext, project.getId(), false, false);
        analysisContext = analysisContextEndpoint.get(analysisContext.getId());
        Assert.assertNotNull(analysisContext);

        sources = analysisContext.getAdvancedOptions().stream()
                .filter(advancedOption -> advancedOption.getName().equals(SourceOption.NAME))
                .map(AdvancedOption::getValue)
                .collect(Collectors.toList());
        targets = analysisContext.getAdvancedOptions().stream()
                .filter(advancedOption -> advancedOption.getName().equals(TargetOption.NAME))
                .map(AdvancedOption::getValue)
                .collect(Collectors.toList());

        Assert.assertEquals(1, sources.size());
        Assert.assertTrue(sources.contains("weblogic"));

        Assert.assertEquals(1, targets.size());
        Assert.assertTrue(targets.contains("eap"));
    }
}
