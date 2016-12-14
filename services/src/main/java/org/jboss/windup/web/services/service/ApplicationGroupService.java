package org.jboss.windup.web.services.service;

import org.jboss.windup.web.addons.websupport.WebPathUtil;
import org.jboss.windup.web.furnaceserviceprovider.FromFurnace;
import org.jboss.windup.web.services.model.AnalysisContext;
import org.jboss.windup.web.services.model.ApplicationGroup;
import org.jboss.windup.web.services.model.MigrationProject;
import org.jboss.windup.web.services.model.PackageMetadata;
import org.jboss.windup.web.services.model.ReportFilter;

import javax.inject.Inject;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.ws.rs.BadRequestException;
import javax.ws.rs.NotFoundException;
import java.nio.file.Path;

/**
 * @author <a href="mailto:dklingenberg@gmail.com">David Klingenberg</a>
 */
public class ApplicationGroupService
{
    @PersistenceContext
    private EntityManager entityManager;

    @Inject
    private AnalysisContextService analysisContextService;

    @Inject
    @FromFurnace
    WebPathUtil webPathUtil;

    public ApplicationGroup getApplicationGroup(Long groupID)
    {
        ApplicationGroup applicationGroup = this.entityManager.find(ApplicationGroup.class, groupID);

        if (applicationGroup == null)
        {
            throw new NotFoundException("ApplicationGroup with id: " + groupID + " not found");
        }

        return applicationGroup;
    }

    public ApplicationGroup createApplicationGroup(String title, MigrationProject project)
    {
        ApplicationGroup applicationGroup = new ApplicationGroup(project);
        applicationGroup.setTitle(title);
        applicationGroup.setReportFilter(new ReportFilter(applicationGroup));
        applicationGroup.setPackageMetadata(new PackageMetadata());

        entityManager.persist(applicationGroup);

        AnalysisContext analysisContext = this.analysisContextService.createDefaultAnalysisContext(applicationGroup);
        applicationGroup.setAnalysisContext(analysisContext);

        Path outputPath = webPathUtil.createApplicationGroupPath(
                applicationGroup.getMigrationProject().getId().toString(),
                applicationGroup.getId().toString());

        applicationGroup.setOutputPath(outputPath.toAbsolutePath().toString());

        project.addGroup(applicationGroup);

        entityManager.merge(applicationGroup);

        return entityManager.find(ApplicationGroup.class, applicationGroup.getId());
    }

    public ApplicationGroup createDefaultApplicationGroup(MigrationProject project)
    {
        return this.createApplicationGroup(ApplicationGroup.DEFAULT_NAME, project);
    }
}
