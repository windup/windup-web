import {$, $$, browser, by, element, ElementFinder} from "protractor";

export class AnalysisListPage {
    searchTextBox = element(by.name('searchValue'));
    searchClearButton = $('wu-search button.clear');

    table = $('table.executions-list-table');
    tableHeaders = this.table.$$('th');

    emptyDiv = $('.blank-slate-pf-main-action');

    configureAnalysisButton = $('.btn.btn-primary');

    progressbar = $('.progress-container');

    noActiveAnalysisText = $$('.progressbar-no-active-analysis');

    public getExecutions(): Promise<Execution[]> {
        return this.table.isPresent().then(isPresent => {
            if (!isPresent) {
                return [];
            }

            return this.table.$('tbody').$$('tr').then((tableRows: ElementFinder[]): any => Promise.all(tableRows.map(row => {
                const tableColumns = row.$$('td');

                return tableColumns.count().then(count => {
                    if (count == 0) {
                        return [];
                    }

                    const execution = {
                        id: '',
                        status: '',
                        applications: '',
                        dateStarted: '',
                        actions: {
                            showAnalysisDetail: tableColumns.get(0),
                            showReport: tableColumns.get(4).$$('a').get(0),
                            delete: tableColumns.get(4).$$('a').get(1)
                        },
                        row: row
                    };

                    return Promise.all([
                        tableColumns.get(0).getText().then(id => execution.id = id),
                        tableColumns.get(1).getText().then(status => execution.status = status),
                        tableColumns.get(2).getText().then(countApplications => execution.applications = countApplications),
                        tableColumns.get(3).getText().then(dateStarted => execution.dateStarted = dateStarted)
                    ]).then(() => execution) as any;
                });
            })));
        });
    }

    public sortByName() {
        this.tableHeaders.get(0).click();
    }

    public sortByDateAdded() {
        this.tableHeaders.get(1).click();
    }

    public search(text: string) {
        return this.searchTextBox.sendKeys(text);
    }

    public cancelSearch() {
        return this.searchClearButton.click();
    }

    public navigateTo(projectId: number) {
        return browser.get(`projects/${projectId}/project-detail`);
    }
}

export interface ExecutionActions {
    showAnalysisDetail: ElementFinder;
    showReport: ElementFinder;
    delete: ElementFinder;
}

export interface Execution {
    id: string;
    status: string;
    applications: string;
    dateStarted: string;
    actions:  ExecutionActions;
    row: ElementFinder;
}
