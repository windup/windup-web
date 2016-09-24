package org.jboss.windup.web.services.data;

import org.apache.commons.lang3.RandomStringUtils;
import org.jboss.resteasy.client.jaxrs.ResteasyWebTarget;
import org.jboss.windup.web.services.model.ApplicationGroup;
import org.jboss.windup.web.services.model.MigrationProject;
import org.jboss.windup.web.services.rest.ApplicationGroupEndpoint;
import org.jboss.windup.web.services.rest.MigrationProjectEndpoint;

/**
 * @author <a href="mailto:dklingen@redhat.com">David Klingenberg</a>
 */
public class DataProvider
{
    public static final String TINY_SAMPLE_PATH = "/sample/sample-tiny.war";

    private MigrationProjectEndpoint migrationProjectEndpoint;
    private ApplicationGroupEndpoint applicationGroupEndpoint;

    public DataProvider(ResteasyWebTarget restEasyTarget)
    {
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

}
