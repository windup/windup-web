import {Project, ProjectListPage} from "../pages/project-list.po";
import {ConfirmDialogPage} from "../pages/confirm-dialog.po";
import {browser} from "protractor";

export class CleanupWorkflow {
    protected loadProject(name: string): Promise<Project> {
        const projectPage = new ProjectListPage();

        let projectList;
        return projectPage.navigateTo().then(() => {
            projectPage.getProjectList().then(projects => projectList = projects)
        }).then(() => {
            return projectList.find(item => item.name === name);
        });
    }

    public deleteProjectFromList(name: string, projectList: Project[]) {
        const project = projectList.find(item => item.name === name);
        return this.deleteProject(project);
    }

    public deleteProject(project: string|Project) {
        if (typeof project === 'string') {
            return this.loadProject(project)
                .then(projectObject => this.doDeleteProject(projectObject));
        } else {
            return this.doDeleteProject(project);
        }
    }

    protected doDeleteProject(project: Project): Promise<any> {
        if (project != null) {
            return project.deleteButton.click().then(() => {
                const confirmDialog = new ConfirmDialogPage();

                confirmDialog.requiresText().then(requiresText => {
                    if (requiresText) {
                        confirmDialog.writeText(project.name);
                    }

                    return confirmDialog.clickConfirm()
                        .then(() => browser.waitForAngular());
                });
            });
        } else {
            return new Promise((resolve, reject) => reject('Project not found'));
        }
    }
}
