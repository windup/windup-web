import {ProjectListPage} from "../pages/project-list.po";
import {CreateProjectPage} from "../pages/wizard/create-project.po";
import {AddApplicationsPage} from "../pages/wizard/add-applications.po";
import {AnalysisConfigurationPage} from "../pages/wizard/analysis-configuration.po";
import {browser, by, element} from "protractor";

const UPLOAD_FILE_PATH = browser.params.upload.filePath;

export class CreateProjectWorkflow {
    public createProject(name: string) {
        const projectPage = new ProjectListPage();
        return projectPage.navigateTo()
            .then(() => projectPage.newProject())
            .then(() => browser.waitForAngular())
            .then(() => {
                const createProjectPage = new CreateProjectPage();
                return createProjectPage.setTitle(name).then(() => createProjectPage.clickNext());
            })
            .then(() => browser.waitForAngular())
            .then(() => {
                const addApplications = new AddApplicationsPage();
                return addApplications.registerFileByServerPath(UPLOAD_FILE_PATH);
            })
            .then(() => browser.waitForAngular())
            .then(() => {
                const analysisConfig = new AnalysisConfigurationPage();
                return analysisConfig.clickSave();
            })
            .then(() => browser.waitForAngular())
            .then(() => {
                const confirmButton = element(by.css('.confirm-button'));
                const modal = element(by.css('.modal'));

                return modal.isPresent().then(isPresent => {
                    if (isPresent) {
                        console.error('Modal dialog is showed, need to click confirm button');

                        return browser.isElementPresent(confirmButton)
                            .then(isPresent => {
                                if (isPresent) {
                                    console.error('clicking on confirm button');
                                    return confirmButton.click();
                                }
                            }, error => {
                                console.log('error');
                                console.log(error);
                            });
                    }
                });
            });
    }

    public createProjectWithTimeInName() {
        const date = new Date();
        const projectName = 'Test ' + date.getTime().toString();

        return this.createProject(projectName)
            .then(() => browser.waitForAngular());
    }
}
