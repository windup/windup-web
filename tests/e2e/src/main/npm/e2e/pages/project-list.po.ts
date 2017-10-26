import {$, $$, browser, ElementFinder} from "protractor";

export class ProjectListPage {
    newProjectButton = $('.btn.btn-primary');
    projectList = $$('.list-group-item.project-info.tile-click');

    projectListDiv = $('.projects-list');

    emptyStateDiv = $('.blank-slate-pf');
    emptyStateRemoveFilter = $('.no-matches a');

    searchInput = $('.search-pf-input-group input');
    searchRemoveButton = $('.pficon-close');

    public navigateTo() {
        return browser.get('./');
    }

    public search(text: string) {
        return this.searchInput.sendKeys(text);
    }

    public sort() {}

    public sortOrder() {

    }

    public newProject() {
        return this.newProjectButton.click();
    }

    public editProject() {
    }

    public deleteProject() {
    }

    public getProjectList(): Promise<Project[]> {
        return (this.projectList.then((elements: ElementFinder[]): any => {
            return Promise.all(elements.map((element, index, array) => {
                const project = {
                    name: '',
                    description: '',
                    countApplications: '',
                    lastUpdated: '',
                    editButton: element.$('.action-edit-project'),
                    deleteButton: element.$('.action-delete-project'),
                    projectDiv: element.$('.project-info')
                };

                return Promise.all([
                    element.$('.project-title').getText().then(title => project.name = title),
                    element.$('.count-applications').getText().then(count => project.countApplications = count),
                    element.$('.last-updated').getText().then(lastUpdated => project.lastUpdated = lastUpdated),
                    element.$('.description').getText().then(description => project.description = description),
                ]).then(() => project);
            }));
        }));
    }
}

export interface Project {
    name: string;
    description: string;
    countApplications: string;
    lastUpdated: string;
    editButton;
    deleteButton;
    projectDiv?: any;
}
