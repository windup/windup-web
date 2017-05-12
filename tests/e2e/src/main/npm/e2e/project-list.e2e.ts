import {ProjectPage} from "./pages/project.po";
import {CreateProjectWorkflow} from "./workflows/create-project.wf";
import {ConfirmDialogPage} from "./pages/confirm-dialog.po";

describe('Project List', () => {
    const projectPage = new ProjectPage();

    describe('Without any projects', () => {
        beforeAll(() => {
            projectPage.navigateTo();
            // TODO: Ensure no project exists
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

    describe('With projects', () => {
        let projectName: string;
        let projectListPromise: Promise<any[]>;

        beforeAll(() => {
            const workflow = new CreateProjectWorkflow();

            const date = new Date();
            projectName = 'Test ' + date.getTime().toString();

            workflow.createProject(projectName)
                .then(() => projectPage.navigateTo())
                .then(() => {
                    projectListPromise = projectPage.getProjectList();
                });
        });

        it('Should show project list', () => {
            expect(projectPage.projectListDiv.isPresent()).toBeTruthy();
        });

        it('Should contain just created project', () => {
            projectListPromise.then(projects => {
                expect(projects.some(item => item.name === projectName)).toBeTruthy();
            });
        });

        afterAll(() => {
            projectListPromise.then(projects => {
                let project = projects.find(item => item.name === projectName);

                console.log(project);

                if (project != null) {
                    project.deleteButton.click().then(() => {
                        console.log('delete');
                        const confirmDialog = new ConfirmDialogPage();

                        confirmDialog.requiresText().then(requiresText => {
                            if (requiresText) {
                                confirmDialog.writeText(projectName);
                            }

                            return confirmDialog.clickConfirm();
                        });
                    });
                }
            });
        });
    });
});
