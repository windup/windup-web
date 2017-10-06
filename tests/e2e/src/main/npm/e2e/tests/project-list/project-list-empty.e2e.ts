import {ProjectPage} from "../../pages/project.po";
import {CleanupWorkflow} from "../../workflows/cleanup.wf";

xdescribe('Empty project list', () => {
    const projectPage = new ProjectPage();

    /*
     * Given there are no projects
     */
    beforeAll((done) => {
        projectPage.navigateTo();

        const cleanup = new CleanupWorkflow();

        projectPage.getProjectList()
            .then(projects => projects.map(project => cleanup.deleteProject(project)))
            .then(promises => Promise.all(promises).then(() => done()));
    });

    it('Should not show project list', () => {
        expect(projectPage.projectListDiv.isPresent()).toBeFalsy();
    });

    it('Should show New project button', () => {
        expect(projectPage.newProjectButton.isPresent()).toBeTruthy();
    });

    it('Should show welcome message', () => {
        expect(projectPage.emptyStateDiv.isPresent()).toBeTruthy();
    });
});
