package org.jboss.windup.web.services.service;

import org.jboss.windup.web.addons.websupport.WebPathUtil;
import org.jboss.windup.web.services.model.*;
import org.jboss.windup.web.services.model.Package;
import org.junit.Before;
import org.junit.Rule;
import org.junit.Test;
import org.junit.rules.ExpectedException;

import javax.persistence.EntityManager;
import javax.persistence.TypedQuery;
import javax.ws.rs.BadRequestException;

import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.HashSet;

import static org.junit.Assert.assertTrue;
import static org.mockito.Mockito.doReturn;
import static org.mockito.Mockito.mock;

public class MigrationProjectServiceTest {
    protected MigrationProjectService migrationProjectService;



    @Before
    public void setUp()
    {
        this.migrationProjectService = new MigrationProjectService();
        this.migrationProjectService.entityManager = mock(EntityManager.class);
        this.migrationProjectService.analysisContextService = mock(AnalysisContextService.class);
        this.migrationProjectService.webPathUtil = mock(WebPathUtil.class);
    }

    @Rule
    public ExpectedException thrown= ExpectedException.none();



    @Test
    public void testCreateProject()
    {
        MigrationProject project = new MigrationProject();
        project.setId(new Long(1));
        ArrayList projectList = new ArrayList();

        TypedQuery mockQuery = mock(TypedQuery.class);
        doReturn(mockQuery).when(this.migrationProjectService.entityManager).createQuery("SELECT proj FROM MigrationProject proj WHERE proj.title = :title and proj.provisional = FALSE", MigrationProject.class);
        doReturn(mockQuery).when(mockQuery).setParameter("title", project.getTitle());
        doReturn(projectList).when(mockQuery).getResultList();

        Long id = project.getId();
        assertTrue(id.longValue() == 1);
        assertTrue(project.getApplications().size()==0);
        this.migrationProjectService.createProject(project);
        id = project.getId();
        assertTrue(id == null);

    }


    @Test
    public void testDeleteProject()
    {
        MigrationProject project = new MigrationProject();
        project.setId(new Long(1));
        project.setTitle("testProject");
        RegisteredApplication app = new RegisteredApplication();
        PackageMetadata pm = new PackageMetadata();
        app.setPackageMetadata(pm);
        project.addApplication(app);
        doReturn(project).when(this.migrationProjectService.entityManager).find(MigrationProject.class, project.getId());
        AnalysisContext ac = new AnalysisContext(project);
        ArrayList contextList = new ArrayList();
        contextList.add(ac);

        TypedQuery mockQuery = mock(TypedQuery.class);
        doReturn(mockQuery).when(this.migrationProjectService.entityManager).createQuery("SELECT ctxt FROM AnalysisContext ctxt WHERE ctxt.migrationProject = :project",AnalysisContext.class);
        doReturn(mockQuery).when(mockQuery).setParameter("project", project);
        doReturn(contextList).when(mockQuery).getResultList();

        Path p = Paths.get("falseDir");
        doReturn(p).when(this.migrationProjectService.webPathUtil).createMigrationProjectPath(project.getId().toString());


        Long id = project.getId();
        assertTrue(id.longValue() == 1);
        assertTrue(project.getApplications().size()==1);
        this.migrationProjectService.deleteProject(project);

        assertTrue(project.getApplications().size()==0);

    }

    @Test
    public void testDeleteProjectWithIncludedPackagesFromDeletedApplication()
    {
        MigrationProject project = new MigrationProject();
        project.setId(new Long(1));
        project.setTitle("testProject");
        RegisteredApplication app = new RegisteredApplication();
        PackageMetadata pm = new PackageMetadata();
        app.setPackageMetadata(pm);
        project.addApplication(app);
        doReturn(project).when(this.migrationProjectService.entityManager).find(MigrationProject.class, project.getId());
        AnalysisContext ac = new AnalysisContext(project);
        HashSet<Package> includedPackages =  new HashSet<Package>();
        HashSet<RegisteredApplication> applications =  new HashSet<RegisteredApplication>();
        applications.add(app);
        Package selectedPackage = new Package("org.jboss.windup.included.package");
        includedPackages.add(selectedPackage);
        ac.setIncludePackages(includedPackages);
        ac.setApplications(applications);
        ArrayList contextList = new ArrayList();
        contextList.add(ac);

        TypedQuery mockQuery = mock(TypedQuery.class);
        doReturn(mockQuery).when(this.migrationProjectService.entityManager).createQuery("SELECT ctxt FROM AnalysisContext ctxt WHERE ctxt.migrationProject = :project",AnalysisContext.class);
        doReturn(mockQuery).when(mockQuery).setParameter("project", project);
        doReturn(contextList).when(mockQuery).getResultList();

        Path p = Paths.get("falseDir");
        doReturn(p).when(this.migrationProjectService.webPathUtil).createMigrationProjectPath(project.getId().toString());


        Long id = project.getId();
        assertTrue(id.longValue() == 1);
        assertTrue(project.getApplications().size()==1);
        this.migrationProjectService.deleteProject(project);

        assertTrue(project.getApplications().size()==0);
        assertTrue(ac.getIncludePackages().size() == 0);

    }

    @Test
    public void testCreateProjectNameAlreadyUsed()
    {
        MigrationProject project = new MigrationProject();
        project.setTitle("testProject");
        ArrayList projectList = new ArrayList();
        projectList.add(project);


        TypedQuery mockQuery = mock(TypedQuery.class);
        doReturn(mockQuery).when(this.migrationProjectService.entityManager).createQuery("SELECT proj FROM MigrationProject proj WHERE proj.title = :title and proj.provisional = FALSE", MigrationProject.class);
        doReturn(mockQuery).when(mockQuery).setParameter("title", project.getTitle());
        doReturn(projectList).when(mockQuery).getResultList();



        Long id = project.getId();
        assertTrue(id == null);
        assertTrue(project.getApplications().size()==0);
        thrown.expect(BadRequestException.class);
        this.migrationProjectService.createProject(project);

    }

}
