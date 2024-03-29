package org.jboss.windup.web.services.data;

import org.apache.commons.lang3.RandomStringUtils;
import org.jboss.resteasy.client.jaxrs.ResteasyWebTarget;
import org.jboss.resteasy.plugins.providers.multipart.MultipartFormDataOutput;
import org.jboss.windup.web.services.model.AnalysisContext;
import org.jboss.windup.web.services.model.Configuration;
import org.jboss.windup.web.services.model.MigrationProject;
import org.jboss.windup.web.services.model.PathType;
import org.jboss.windup.web.services.model.RegisteredApplication;
import org.jboss.windup.web.services.model.RulesPath;
import org.jboss.windup.web.services.model.ScopeType;
import org.jboss.windup.web.services.rest.AnalysisContextEndpoint;
import org.jboss.windup.web.services.rest.ConfigurationEndpoint;
import org.jboss.windup.web.services.rest.ConfigurationEndpointTest;
import org.jboss.windup.web.services.rest.MigrationProjectEndpoint;
import org.jboss.windup.web.services.rest.MigrationProjectRegisteredApplicationsEndpoint;
import org.json.JSONException;
import org.json.JSONObject;

import javax.ws.rs.client.Entity;
import javax.ws.rs.core.GenericEntity;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.LinkedHashSet;
import java.util.Set;

/**
 * @author <a href="mailto:dklingen@redhat.com">David Klingenberg</a>
 */
public class DataProvider
{
    public static final String TINY_SAMPLE_PATH = "/sample/sample-tiny.war";

    private final ResteasyWebTarget target;
    private final ConfigurationEndpoint configurationEndpoint;
    private final AnalysisContextEndpoint analysisContextEndpoint;
    private final MigrationProjectEndpoint migrationProjectEndpoint;
    private Set<RulesPath> rulesPathSet;

    public DataProvider(ResteasyWebTarget restEasyTarget)
    {
        this.target = restEasyTarget;
        this.configurationEndpoint = restEasyTarget.proxy(ConfigurationEndpoint.class);
        this.analysisContextEndpoint = restEasyTarget.proxy(AnalysisContextEndpoint.class);
        this.migrationProjectEndpoint = restEasyTarget.proxy(MigrationProjectEndpoint.class);

        updateConfiguration();
    }

    private void updateConfiguration()
    {
        Configuration configuration = this.configurationEndpoint.getGlobalConfiguration();
        configuration.getRulesPaths().add(getTestRulesPath());
        configuration = this.configurationEndpoint.saveConfiguration(configuration.getId(), configuration);
        this.rulesPathSet = configuration.getRulesPaths();
    }

    public MigrationProject getMigrationProject()
    {
        String projectTitle = "Project " + RandomStringUtils.randomAlphabetic(5);

        MigrationProject migrationProject = new MigrationProject();
        migrationProject.setTitle(projectTitle);

        migrationProject = this.migrationProjectEndpoint.createMigrationProject(migrationProject);
        this.analysisContextEndpoint.saveAsProjectDefault(new AnalysisContext(migrationProject), migrationProject.getId(), false, false);
        migrationProject = this.migrationProjectEndpoint.getMigrationProject(migrationProject.getId());
        return migrationProject;
    }

    public MigrationProject getProvisionalMigrationProject()
    {
        String projectTitle = "Project " + RandomStringUtils.randomAlphabetic(5);

        MigrationProject migrationProject = new MigrationProject();
        migrationProject.setTitle(projectTitle);

        migrationProject = this.migrationProjectEndpoint.createMigrationProject(migrationProject);
        this.analysisContextEndpoint.saveAsProjectDefault(new AnalysisContext(migrationProject), migrationProject.getId(), true, false);
        migrationProject = this.migrationProjectEndpoint.getMigrationProject(migrationProject.getId());
        return migrationProject;
    }

    protected Long getProjectAnalysisContextId(MigrationProject project) throws JSONException
    {
        Response response = target.path("/migrationProjects/get/" + project.getId()).request().get();
        response.bufferEntity();
        String stringResponse = response.readEntity(String.class);
        JSONObject json = new JSONObject(stringResponse);

        return json.getLong("defaultAnalysisContextId");
    }

    public AnalysisContext getAnalysisContext(MigrationProject project) throws JSONException
    {
        Long contextId = this.getProjectAnalysisContextId(project);
        AnalysisContext analysisContext = this.analysisContextEndpoint.get(contextId);

        if (analysisContext.getRulesPaths() == null)
        {
            analysisContext.setRulesPaths(new LinkedHashSet<>());
        }

        analysisContext.getRulesPaths().add(getTestRulesPath());

        return this.analysisContextEndpoint.saveAsProjectDefault(analysisContext, project.getId(), false, false);
    }

    private RulesPath getTestRulesPath()
    {
        Path path = Paths.get(ConfigurationEndpointTest.CUSTOM_RULESPATH).toAbsolutePath();
        String pathString = path.toString();
        if (this.rulesPathSet == null)
        {
            return new RulesPath(pathString, PathType.USER_PROVIDED, ScopeType.GLOBAL);
        } else
        {
            for (RulesPath rulesPath : rulesPathSet)
            {
                if (rulesPath.getPath().equals(pathString))
                    return rulesPath;
            }
            return null;
        }
    }

    public Entity getMultipartFormDataEntity(InputStream sampleIS, String filename) throws IOException
    {
        MultipartFormDataOutput uploadData = new MultipartFormDataOutput();
        uploadData.addFormData("file", sampleIS, MediaType.APPLICATION_OCTET_STREAM_TYPE, filename);
        GenericEntity<MultipartFormDataOutput> entity = new GenericEntity<MultipartFormDataOutput>(uploadData){};

        return Entity.entity(entity, MediaType.MULTIPART_FORM_DATA_TYPE);
    }

    public RegisteredApplication getApplication(MigrationProject project) throws IOException
    {
        String appName = "App " + RandomStringUtils.randomAlphabetic(5) + ".war";

        return this.getApplication(project, appName);
    }

    public RegisteredApplication getApplication(MigrationProject project, String appName) throws IOException
    {
        try (InputStream sampleIS = getClass().getResourceAsStream(DataProvider.TINY_SAMPLE_PATH))
        {
            return this.getApplication(project, sampleIS, appName);
        }
    }

    public RegisteredApplication getApplication(MigrationProject project, InputStream inputStream, String filename) throws IOException {
        Entity entity = this.getMultipartFormDataEntity(inputStream, filename);

        String registeredAppTargetUri = this.target.getUri() + MigrationProjectRegisteredApplicationsEndpoint.PROJECT_APPLICATIONS
            .replace("{projectId}", project.getId().toString()) + "/upload";
        ResteasyWebTarget registeredAppTarget = this.target.getResteasyClient().target(registeredAppTargetUri);

        try
        {
            Response response = registeredAppTarget.request().post(entity);
            response.bufferEntity();
            String entityAsString = response.readEntity(String.class);
            RegisteredApplication application = response.readEntity(RegisteredApplication.class);
            response.close();

            return application;
        }
        catch (Throwable t)
        {
            t.printStackTrace();
            throw new RuntimeException("Failed to post application due to: " + t.getMessage() + " exception: " + t.getClass().getName());
        }
    }
}
