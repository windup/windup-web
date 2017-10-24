import {ProjectListPage} from "../../pages/project-list.po";
import {CreateProjectWorkflow} from "../../workflows/create-project.wf";
import {ConfirmDialogPage} from "../../pages/confirm-dialog.po";
import {browser} from "protractor";

describe('Project List', () => {
    const projectPage = new ProjectListPage();

    describe('With projects', () => {
        let projectName: string;
        let projectListPromise: Promise<any[]>;

        beforeAll((done) => {
            const workflow = new CreateProjectWorkflow();

            const date = new Date();
            projectName = 'Test ' + date.getTime().toString();

            workflow.createProject(projectName)
                .then(() => projectPage.navigateTo())
                .then(() => browser.waitForAngular())
                .then(() => {
                    projectListPromise = projectPage.getProjectList();
                })
                .then(() => browser.waitForAngular())
                .then(() => done());
        });

        it('Should show project list', () => {
            expect(projectPage.projectListDiv.isPresent()).toBeTruthy();
        });

        it('Should contain just created project', () => {
            projectListPromise.then(projects => {
                expect(projects.some(item => item.name === projectName)).toBeTruthy();
            });
        });

        afterAll(async () => {
            await projectListPromise.then(projects => {
                let project = projects.find(item => item.name === projectName);

                if (project != null) {
                    project.deleteButton.click().then(() => {
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
