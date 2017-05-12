import {ProjectPage} from "../pages/project.po";
import {CreateProjectPage} from "../pages/wizard/create-project.po";
import {AddApplicationsPage} from "../pages/wizard/add-applications.po";
import {AnalysisConfigurationPage} from "../pages/wizard/analysis-configuration.po";
import {browser, by, element} from "protractor";


// TODO: Parametrize this - maybe use ENV variable?
const UPLOAD_FILE_PATH = '/home/dklingen/Downloads/mariadb-java-client-1.5.5.jar';

export class CreateProjectWorkflow {
    public createProject(name: string) {
        const projectPage = new ProjectPage();
        return projectPage.navigateTo()
            .then(() => projectPage.newProject())
            .then(() => {
                const createProjectPage = new CreateProjectPage();
                createProjectPage.setTitle(name);
                return createProjectPage.clickNext();
            })
            .then(() => {
                const addApplications = new AddApplicationsPage();
                return addApplications.registerFileByServerPath(UPLOAD_FILE_PATH);
            })
            .then(() => {
                console.error('On analysis cofig page');
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
}
