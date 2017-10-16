import {browser} from "protractor";
import {CreateProjectWorkflow} from "../workflows/create-project.wf";
import {ApplicationsListPage} from "../pages/project-level/applications-list.po";
import {ContextMenuPage} from "../pages/project-level/context-menu.po";
import {AnalysisListPage} from "../pages/project-level/analysis-list.po";
import {AnalysisConfigurationPage} from "../pages/project-level/analysis-config.po";

describe('For project without any analysis', () => {
    const project = {
        id: 0,
        name: '',
    };

    const contextMenu = new ContextMenuPage();

    beforeAll(() => {
        /**
         * Create project
         */
        const workflow = new CreateProjectWorkflow();
        workflow.createProjectWithTimeInName()
            .then(() => browser.waitForAngular())
            .then(() => {
                browser.getCurrentUrl().then(() => {

                });
            });
    });

    it('should get redirected to analysis list', () => {
        expect(browser.getCurrentUrl()).toContain('project-detail');
    });

    it('should show context menu', () => {
        contextMenu.getMenuItems().then(menuItems => {
            expect(menuItems[0].label).toEqual('Analysis Results');
            expect(menuItems[1].label).toEqual('Applications');
            expect(menuItems[2].label).toEqual('Analysis Configuration');
        });
    });

    describe('application list page', () => {
        const applicationsList = new ApplicationsListPage();

        beforeAll(() => {
            contextMenu.getMenuItems().then(items => {
                items[1].link.click();
            });
        });

        it('should contain uploaded application', () => {
            applicationsList.getApplications().then(applications => {
                expect(applications.length).toBe(1);
//                expect(applications).toContain('');
            });
        });
    });

    describe('analysis list page', () => {
        const analysisPage = new AnalysisListPage();

        beforeAll(() => {
            contextMenu.getMenuItems().then(items => {
                items[0].link.click();
            })
            .then(() => browser.waitForAngular());
        });

        it('should show empty message', () => {
            expect(analysisPage.emptyDiv.isPresent()).toBeTruthy();
        });
    });

    describe('analysis configuration page', () => {
        const analysisConfig = new AnalysisConfigurationPage();

        beforeAll(() => {
            contextMenu.getMenuItems().then(items => {
                items[2].link.click();
            })
            .then(() => browser.waitForAngular())
            .then(() => {});
        });

        it('should have EAP 7 selected', (done) => {
            analysisConfig.targets.EAP7.isSelected().then(selected => {
                expect(selected).toBeTruthy();
            });
        });

        it('should not have cloud readiness selected', () => {
            analysisConfig.enableCloudReadinessInput.isSelected().then(selected => {
                expect(selected).toBeFalsy();
            });
        });

        it('should have all applications selected', () => {
            analysisConfig.selectedApplications.count().then(count => {
                expect(count).toBe(1);
            });
        });

        it('should not have any packages included', () => {
            analysisConfig.includedPackages.count().then(count => {
                expect(count).toBe(1);
            });
        });

        it('should not show exclude packages', () => {

        });

        it('should not show custom rules', () => {

        });

        it('should not show advanced options', () => {

        });
    });
});
