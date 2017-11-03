import {browser, by, element, ElementFinder} from "protractor";

export class AnalysisListPage {
    searchTextBox = element(by.name('searchValue'));
    searchClearButton = element(by.css('wu-search button.clear'));

    table = element(by.css('table.executions-list-table'));
    tableHeaders = this.table.all(by.css('th'));

    emptyDiv = element(by.css('.blank-slate-pf-main-action'));

    configureAnalysisButton = element(by.css('.btn.btn-primary'));

    public getExecutions(): Promise<Execution[]> {
        return this.table.isPresent().then(isPresent => {
            if (!isPresent) {
                return [];
            }

            return this.table.element(by.css('tbody')).all(by.css('tr')).then((tableRows: ElementFinder[]): any => Promise.all(tableRows.map(row => {
                const tableColumns = row.all(by.css('td'));

                return tableColumns.count().then(count => {
                    if (count === 0) {
                        return [];
                    }

                    const execution = {
                        id: '',
                        status: '',
                        applications: '',
                        dateStarted: '',
                        actions: {
                            showAnalysisDetail: tableColumns.get(0),
                            showReport: tableColumns.get(4).all(by.css('a')).get(0),
                            delete: tableColumns.get(4).all(by.css('a')).get(1)
                        }
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

    /**
     * Navigates to project analysis-list page
     *
     * @param {number} aProjectId - Project id. Beware - maven processes these files and replaces ${} occurrences!
     * @returns {Promise<any>}
     */
    public navigateTo(aProjectId: number) {
        let projectId = 0;
        return browser.get(`projects/${aProjectId}/project-detail`);
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
}
