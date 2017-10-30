import {Project, ProjectListPage} from "../pages/project-list.po";
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
            .then(() => browser.waitForAngular())
            .then(() => {
                /**
                 * TODO: Here is some issue with timeout. isPresent() behaves very non-deterministically.
                 * Sometimes it resolves successfully, but sometimes it blocks and timeouts on 110 sec. internal protractor
                 * (or webdriver) timeout.
                 *
                 * I have no idea why. waitForAngularEnabled(false) solves that issue.
                 *
                 * Problem might be related to some setTimeout or setInterval async code.
                 */
                browser.waitForAngularEnabled(false);
                console.error('Dialog present?');

                return this.confirmDialogPage.isPresent().then(isPresent => {
                    console.error("Dialog present:", isPresent);

                    if (isPresent) {
                        console.error('Modal dialog is showed, need to click confirm button');

                        return browser.isElementPresent(this.confirmDialogPage.confirmButton).then(isPresent => {
                           if (isPresent) {
                               console.error('Clicking on confirm button');
                               return this.confirmDialogPage.clickConfirm();
                           }
                        });
                    }
                }, error => {
                    console.error('error: ', error);
                }).then(() => {
                    browser.waitForAngularEnabled(true);
                });
            });
    }
}
