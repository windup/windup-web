import {browser} from "protractor";
import {PageObject} from "../pages/page-object";
import {assertScreenshotIsCorrectInAllResolutions, clearScreenshots, waitForPageToLoad} from "../utils/utils";
import {AboutPage} from "../pages/about.po";
import {RulesConfigurationPage} from "../pages/rules-configuration.po";
import {ContextMenuPage} from "../pages/project-level/context-menu.po";
import {AnalysisListPage} from "../pages/project-level/analysis-list.po";
import {PROJECT_WITH_ANALYSIS, PROJECT_WITHOUT_ANALYSIS} from "../utils/data";
import {ProjectListPage} from "../pages/project-list.po";

describe('Visual Regression Testing', () => {
    beforeAll(() => {
        clearScreenshots();
    });

    beforeEach((done) => {
        browser.manage().window().setSize(1920, 1080).then(() => done());
    });

    const testScreenshots = (fileName: string) => {
        return (done) => {
            return waitForPageToLoad()
                .then(() => assertScreenshotIsCorrectInAllResolutions(fileName, done));
        };
    };

    const loadAndTestScreenshots = (testName: string, pageObject: PageObject, fileName: string) => {
        return it(testName, (done) => {
            return pageObject.navigateTo()
                .then(() => waitForPageToLoad())
                .then(() => assertScreenshotIsCorrectInAllResolutions(fileName, done));
        });
    };

    loadAndTestScreenshots('About Page should look consistently', new AboutPage(), 'about-page');
    loadAndTestScreenshots('Rules Configuration Page should look consistently', new RulesConfigurationPage(), 'rules-configuration');
    loadAndTestScreenshots('Project List should look consistently', new ProjectListPage(), 'project-list');

    /**
     * TODO: What to do with this one?
     * Delete all projects?
     */
    xdescribe('Empty project list ', () => {
        beforeAll(() => {

        });

        it('should look consistently', () => {

        });
    });

    describe('Project without analysis', () => {
        const contextMenu = new ContextMenuPage();

        beforeAll((done) => {
            const analysisListPage = new AnalysisListPage();

            analysisListPage.navigateTo(PROJECT_WITHOUT_ANALYSIS.id)
                .then(() => browser.waitForAngular())
                .then(() => done());
        });

        describe('Analysis list page', () => {
            it('Should look consistent in all resolutions', testScreenshots('project/analysis-list-empty'));
        });

        describe('Application list page', () => {
            beforeAll((done) => {
                contextMenu.getMenuItems().then(items => {
                    items[1].link.click();
                })
                    .then(() => done());
            });

            it('Should look consistent in all resolutions', testScreenshots('project/applications-list'));
        });

        describe('Analysis configuration page', () => {
            beforeAll((done) => {
                contextMenu.getMenuItems().then(items => {
                    items[2].link.click();
                })
                    .then(() => done());
            });

            it('Should look consistent in all resolutions', testScreenshots('project/analysis-configuration'));
        });
    });

    describe('Project with analysis', () => {
        const projectId = PROJECT_WITH_ANALYSIS.id;
        const analysisId = PROJECT_WITH_ANALYSIS.executions[0].id;
        const contextMenu = new ContextMenuPage();

        beforeAll((done) => {
            const analysisList = new AnalysisListPage();
            analysisList.navigateTo(projectId)
                .then(() => done());
        });

        describe('Analysis list page', () => {
            it('Should look consistent in all resolutions', testScreenshots('project/analysis-list-with-analysis'));
        });

        describe('Dynamic reports', () => {
            const navigateByUrlAndMakeScreenshot = (description: string, aProjectId: number, analysisId: number, reportUrl: string, filename: string) => {
                return describe(description, () => {
                    beforeAll((done) => {
                        if (reportUrl && reportUrl.length > 0) {
                            reportUrl = '/' + reportUrl;
                        }

                        browser.get(`./projects/${aProjectId}/reports/${analysisId}${reportUrl}`)
                            .then(() => waitForPageToLoad())
                            .then(() => done());
                    });

                    it('Should look consistent in all resolutions', testScreenshots(filename));
                });
            };

            navigateByUrlAndMakeScreenshot('Application List', projectId, analysisId, '', 'reports/application-list');
            navigateByUrlAndMakeScreenshot('Dashboard', projectId, analysisId, 'application-index', 'reports/dashboard');
            navigateByUrlAndMakeScreenshot('Technologies - EJB', projectId, analysisId, 'technology-report-ejb', 'reports/tech-report-ejb');
            navigateByUrlAndMakeScreenshot('Technologies - Remote Services', projectId, analysisId, 'technology-report-remote-services', 'reports/tech-report-remote-services');
            navigateByUrlAndMakeScreenshot('Technologies - Hibernate', projectId, analysisId, 'technology-report-hibernate', 'reports/tech-report-hibernate');
            navigateByUrlAndMakeScreenshot('Technologies - Migration Issues', projectId, analysisId, 'migration-issues', 'reports/migration-issues');
            navigateByUrlAndMakeScreenshot('Execution details', projectId, analysisId, 'execution-details', 'reports/execution-details');
//                navigateByUrlAndMakeScreenshot('Technologies (overall)', projectId, analysisId, 'technology-report', 'reports/tech-report');
        });

        xdescribe('Dynamic Reports navigate by menu', () => {
            /*
            const navigateByMenuAndMakeScreenshot = (description: string, menuItem: ReportLevelMenuItems, filename: string) => {
                return describe(description, () => {
                    beforeAll((done) => {
                        contextMenu.openMenuItem(menuItem).then(() => done())
                            .then(() => waitForPageToLoad())
                            .then(() => done());
                    });

                    it('Should look consistent in all resolutions', testScreenshots(filename));
                });
            };
            */
            /*
            navigateByMenuAndMakeScreenshot('2 Application List', ReportLevelMenuItems.APPLICATION_LIST, 'reports/application-list-2');
            navigateByMenuAndMakeScreenshot('2 Dashboard', ReportLevelMenuItems.DASHBOARD, 'reports/dashboard');
            // navigateByMenuAndMakeScreenshot('Technologies - EJB', projectId, analysisId, 'technology-report-ejb', 'reports/tech-report-ejb');
            // navigateByMenuAndMakeScreenshot('Technologies - Remote Services', projectId, analysisId, 'technology-report-remote-services', 'reports/tech-report-remote-services');
            // navigateByMenuAndMakeScreenshot('Technologies - Hibernate', projectId, analysisId, 'technology-report-hibernate', 'reports/tech-report-hibernate');
            navigateByMenuAndMakeScreenshot('2 Technologies - Migration Issues', ReportLevelMenuItems.MIGRATION_ISSUES, 'reports/migration-issues-2');
            navigateByMenuAndMakeScreenshot('2 Execution details', ReportLevelMenuItems.EXECUTION_DETAILS, 'reports/execution-details-2');
            // navigateByMenuAndMakeScreenshot('2 Technologies (overall)', ReportLevelMenuItems.TECHNOLOGIES_OVERALL, 'reports/tech-report-2');
            */
        });
    });
});
