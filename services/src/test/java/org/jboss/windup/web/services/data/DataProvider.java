package org.jboss.windup.web.services.data;

import org.apache.commons.lang3.RandomStringUtils;
import org.jboss.resteasy.client.jaxrs.ResteasyWebTarget;
import org.jboss.resteasy.plugins.providers.multipart.MultipartFormDataOutput;
import org.jboss.windup.web.services.model.ApplicationGroup;
import org.jboss.windup.web.services.model.MigrationProject;
import org.jboss.windup.web.services.model.RegisteredApplication;
import org.jboss.windup.web.services.rest.ApplicationGroupEndpoint;
import org.jboss.windup.web.services.rest.MigrationProjectEndpoint;
import org.junit.Assert;

import javax.ws.rs.client.Entity;
import javax.ws.rs.core.GenericEntity;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.Collection;

/**
 * @author <a href="mailto:dklingen@redhat.com">David Klingenberg</a>
 */
public class DataProvider
{
    public static final String TINY_SAMPLE_PATH = "/sample/sample-tiny.war";

    private ResteasyWebTarget target;
    private MigrationProjectEndpoint migrationProjectEndpoint;
    private ApplicationGroupEndpoint applicationGroupEndpoint;

    public DataProvider(ResteasyWebTarget restEasyTarget)
    {
        this.target = restEasyTarget;
        this.migrationProjectEndpoint = restEasyTarget.proxy(MigrationProjectEndpoint.class);
        this.applicationGroupEndpoint = restEasyTarget.proxy(ApplicationGroupEndpoint.class);
    }

    public MigrationProject getMigrationProject()
    {
        String projectTitle = "Project " + RandomStringUtils.randomAlphabetic(5);

        MigrationProject migrationProject = new MigrationProject();
        migrationProject.setTitle(projectTitle);

        return this.migrationProjectEndpoint.createMigrationProject(migrationProject);
    }

    public ApplicationGroup getApplicationGroup(MigrationProject migrationProject)
    {
        String groupTitle = "App Group " + RandomStringUtils.randomAlphabetic(5);

        ApplicationGroup applicationGroup = new ApplicationGroup();
        applicationGroup.setMigrationProject(migrationProject);
        applicationGroup.setTitle(groupTitle);

        return this.applicationGroupEndpoint.create(applicationGroup);
    }

    public Entity getMultipartFormDataEntity(InputStream sampleIS, String filename) throws IOException
    {
        MultipartFormDataOutput uploadData = new MultipartFormDataOutput();
        uploadData.addFormData("file", sampleIS, MediaType.APPLICATION_OCTET_STREAM_TYPE, filename);
        GenericEntity<MultipartFormDataOutput> entity = new GenericEntity<MultipartFormDataOutput>(uploadData){};

        return Entity.entity(entity, MediaType.MULTIPART_FORM_DATA_TYPE);
    }

    public RegisteredApplication getApplication(ApplicationGroup group) throws IOException
    {
        try (InputStream sampleIS = getClass().getResourceAsStream(DataProvider.TINY_SAMPLE_PATH))
        {
            return this.getApplication(group, sampleIS, "sample-tiny.war");
        }
    }

    public RegisteredApplication getApplication(ApplicationGroup group, InputStream inputStream, String filename) throws IOException {
        Entity entity = this.getMultipartFormDataEntity(inputStream, filename);

        String registeredAppTargetUri = this.target.getUri() + ServiceConstants.REGISTERED_APP_ENDPOINT + "/appGroup/" + group.getId();
        ResteasyWebTarget registeredAppTarget = this.target.getResteasyClient().target(registeredAppTargetUri);

        try
        {
            Response response = registeredAppTarget.request().post(entity);
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
