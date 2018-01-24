import {ContextMenuPage} from "../../pages/project-level/context-menu.po";
import {AnalysisListPage, Execution} from "../../pages/project-level/analysis-list.po";
import {AnalysisWorkflow} from "../../workflows/analysis.wf";
import {PROJECT_WITH_ANALYSIS} from "../../utils/data";

describe('For project with finished analysis', () => {
    const contextMenu = new ContextMenuPage();
    const analysisList = new AnalysisListPage();
    const analysisWorkflow = new AnalysisWorkflow();

    let executions: Execution[];

    beforeAll((done) => {
        analysisList.navigateTo(PROJECT_WITH_ANALYSIS.id)
            .then(() => analysisList.getExecutions() as any)
            .then(executionList => {
                executions = executionList;
                done();
            });
    });

    it('should have 1 execution', () => {
        expect(executions.length).toBe(1);
    });

    it('should have completed status', () => {
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
