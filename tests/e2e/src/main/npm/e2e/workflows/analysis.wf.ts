import {Project, ProjectPage} from "../pages/project.po";
import {ConfirmDialogPage} from "../pages/confirm-dialog.po";
import {AnalysisConfigurationPage} from "../pages/project-level/analysis-config.po";
import {$, browser} from "protractor";
import {ContextMenuPage} from "../pages/project-level/context-menu.po";

export class AnalysisWorkflow {

    analysisConfigPage = new AnalysisConfigurationPage();
    contextMenuPage = new ContextMenuPage();
    confirmDialogPage = new ConfirmDialogPage();

    startAnalysis(project: Project): Promise<any> {
        return project.projectDiv.click()
            .then(() => browser.waitForAngular())
            .then(() => this.startAnalysisFromProjectPage());
    }

    startAnalysisFromProjectPage(): Promise<any> {
        return this.contextMenuPage.openAnalysisConfig()
            .then(() => this.analysisConfigPage.saveAndRun())
            .then(() => console.error('going to wait'))
            //.then(() => browser.waitForAngular())
            .then(() => {
                console.error('Dialog present?');
                return this.confirmDialogPage.isPresent().then(isPresent => {
                    if (isPresent) {
                        console.error('Modal dialog is showed, need to click confirm button');

                        return this.confirmDialogPage.clickConfirm();
                    }
                });
            });
    }
}
