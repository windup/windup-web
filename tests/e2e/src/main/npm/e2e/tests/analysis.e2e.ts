import {browser} from "protractor";
import {CreateProjectWorkflow} from "../workflows/create-project.wf";
import {ContextMenuPage} from "../pages/project-level/context-menu.po";
import {AnalysisListPage, Execution} from "../pages/project-level/analysis-list.po";
import {AnalysisWorkflow} from "../workflows/analysis.wf";
import {waitUntilCondition} from "../utils/async";

describe('For project with analysis', () => {
    const project = {
        id: 0,
        name: '',
    };

    const contextMenu = new ContextMenuPage();
    const analysisList = new AnalysisListPage();
    const analysisWorkflow = new AnalysisWorkflow();

    let executions: Execution[];

    beforeAll((done) => {
        console.error('Creating project with analysis.....');
        browser.waitForAngular();
        /**
         * Create project
         */
        const workflow = new CreateProjectWorkflow();
        workflow.createProjectWithTimeInName()
            .then(() => browser.waitForAngular())
            .then(() => console.error('Starting analysis....'))
            .then(() => analysisWorkflow.startAnalysisFromProjectPage())
            .then(() => done());
        //  .then(result => console.log(result), error => console.error(error));
    });

    describe('running analysis', () => {
        describe('analysis list page', () => {
            beforeAll((done) => {
                analysisList.getExecutions()
                    .then(executionList => executions = executionList)
                    .then(() => done());
            });

            it('should contain active analysis in table', () => {
                console.error(executions);

                const isQueued = executions[0].status.search('Queued') !== -1;
                const isInProgress = executions[0].status.search('progress') !== -1;

                expect(executions.length).toBe(1);
                expect(isQueued || isInProgress).toBeTruthy();
            });

            it('should have blue table row for active analysis', (done) => {
                executions[0].row.getAttribute('class').then(cssClass => {
                    expect(cssClass.search('info') !== -1).toBeTruthy();
                    done();
                });
            });

            it('should have analysis progress bar', (done) => {
                console.error('Wait until analysis is queued.......');
                waitUntilCondition(200,() => {
                        return analysisList.getExecutions().then(executionList => {
                            return executionList.length == 1 && executionList[0].status.search('progress') !== -1;
                        });
                    }, 3000)
                .then(() => {
                    browser.waitForAngularEnabled(true);
                    return analysisList.getExecutions();
                }).then(executionList => {
                    executions = executionList;
                }).then(() => analysisList.progressbar.isPresent())
                  .then(isProgressbarPresent => {
                    expect(isProgressbarPresent).toBeTruthy();
                    done();
                });
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

                return browser.driver.sleep(timeout).then(() => analysisList.getExecutions() as any).then(executionsList => {
                    if (executionsList.length === 1 && executionsList[0].status.search('Completed') !== -1) {
                        isAnalysisRunning = false;
                    } else {
                        return waitForExecutionToFinish(timeout, maxTimeout, currentTimeout + timeout);
                    }
                });
            };

            console.error('Wait until analysis finishes.......');
            waitForExecutionToFinish(5 * 1000, 5 * 1000 * 60).then(() => {
                console.error('Analysis is finished, continuing.......');
                browser.waitForAngularEnabled(true);
                return analysisList.getExecutions();
            }).then(executionList => {
                executions = executionList;
                done();
            });
        });

        it('should have completed status', () => {
            expect(executions.length).toBe(1);
            expect(executions[0].status.search('Completed') !== -1).toBeTruthy();
        });

        it('should have report link', (done) => {
            executions[0].actions.showReport.isPresent().then(hasReportLink => {
                expect(hasReportLink).toBeTruthy();
                done();
            });
        });

        it('should be green in table', (done) => {
            executions[0].row.getAttribute('class').then(cssClass => {
                expect(cssClass.search('success') !== -1).toBeTruthy();
                done();
            });
        });
    });
});
