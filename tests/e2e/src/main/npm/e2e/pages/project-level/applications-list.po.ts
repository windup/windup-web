import {browser, by, element, ElementFinder} from "protractor";

export class ApplicationsListPage {
    searchTextBox = element(by.name('searchValue'));
    searchClearButton = element(by.css('wu-search button.clear'));

    table = element(by.css('table'));
    tableHeaders = this.table.all(by.css('th'));

    public getApplications(): Promise<Application[]> {
        return this.table.isPresent().then(isPresent => {
            if (!isPresent) {
                return [];
            }

            const tableRowsFinder = this.table.element(by.css('tbody')).all(by.css('tr'));

            return tableRowsFinder.then((tableRows: ElementFinder[]): any => Promise.all(tableRows.map(row => {
                const tableColumns = row.all(by.css('td'));

                const application = {
                    name: '',
                    dateAdded: '',
                    deleteButton: tableColumns.get(2)
                };

                return Promise.all([
                    tableColumns.get(0).getText().then(name => application.name = name),
                    tableColumns.get(1).getText().then(dateAdded => application.dateAdded = dateAdded)
                ]).then(() => application);
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

    public navigateTo(aProjectId: number) {
        return browser.get(`projects/${aProjectId}/applications`);
    }
}

export interface Application {
    name: string;
    dateAdded: string;
    deleteButton: ElementFinder;
}
