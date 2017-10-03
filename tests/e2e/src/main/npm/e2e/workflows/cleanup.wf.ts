import {Project, ProjectPage} from "../pages/project.po";
import {ConfirmDialogPage} from "../pages/confirm-dialog.po";

export class CleanupWorkflow {
    public deleteProject(name: string) {
        const projectPage = new ProjectPage();
        let projectList;

        return projectPage.navigateTo()
            .then(() => {
                projectPage.getProjectList().then(projects => projectList = projects);
            })
            .then(() => this.deleteProjectFromList(name, projectList));
    }

    public deleteProjectFromList(name: string, projectList: Project[]) {
        let project = projectList.find(item => item.name === name);

        if (project != null) {
            return project.deleteButton.click().then(() => {
                const confirmDialog = new ConfirmDialogPage();

                confirmDialog.requiresText().then(requiresText => {
                    if (requiresText) {
                        confirmDialog.writeText(name);
                    }

                    return confirmDialog.clickConfirm();
                });
            });
        } else {
            return new Promise((resolve, reject) => reject('Project not found'));
        }
    }
}
