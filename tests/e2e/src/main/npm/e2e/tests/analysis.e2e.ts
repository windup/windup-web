import {browser} from "protractor";
import {CreateProjectWorkflow} from "../workflows/create-project.wf";
import {ContextMenuPage} from "../pages/project-level/context-menu.po";
import {AnalysisListPage} from "../pages/project-level/analysis-list.po";
import {AnalysisWorkflow} from "../workflows/analysis.wf";

describe('For project with analysis', () => {
    const project = {
        id: 0,
        name: '',
    };

    const contextMenu = new ContextMenuPage();
    const analysisList = new AnalysisListPage();
    const analysisWorkflow = new AnalysisWorkflow();

    beforeAll(() => {
        console.error('Creating project with analysis.....');
        browser.waitForAngular();
        /**
         * Create project
         */
        const workflow = new CreateProjectWorkflow();
        workflow.createProjectWithTimeInName()
            .then(() => browser.waitForAngular())
            .then(() => console.error('Starting analysis....'))
            .then(() => analysisWorkflow.startAnalysisFromProjectPage());
        //  .then(result => console.log(result), error => console.error(error));
    });

    describe('running analysis', () => {
        describe('analysis list page', () => {
            it('should contain active analysis in table', () => {

            });

            it('should have analysis progress bar', () => {

            });
        });
    });

    describe('finished analysis', () => {
        beforeAll((done) => {
            /**
             * TODO: Wait until analysis finishes
             */
            let isAnalysisRunning = true;

            browser.waitForAngularEnabled(false);

            const waitForExecutionToFinish = (timeout: number, maxTimeout?: number, currentTimeout: number = 0): Promise<any> => {
                console.error('WaitForExecutionToFinish looping: ' + `timeout: ${timeout}, maxTimeout: ${maxTimeout}, current: ${currentTimeout}`);

                if (maxTimeout != 0 && currentTimeout >= maxTimeout) {
                    console.error('Max wait time exceeded, exiting');

                    return new Promise((resolve, reject) => {
                        reject('Max wait time exceeded');
                    });
                }

                return browser.driver.sleep(timeout).then(() => analysisList.getExecutions() as any).then(executions => {
                    if (executions.length === 1 && executions[0].status.search('Completed') !== -1) {
                        isAnalysisRunning = false;
                    } else {
                        return waitForExecutionToFinish(timeout, maxTimeout, currentTimeout + timeout);
                    }
                });
            };

            console.error('Wait until analysis finishes.......');
            waitForExecutionToFinish(5 * 1000, 5 * 1000 * 60).then(() => {
                done();
                console.error('Analysis is finished, continuing.......');
                browser.waitForAngularEnabled(true);
            });
        });

        it('should have report link', () => {

        });

        it('should be green in table', () => {});


    });
});
