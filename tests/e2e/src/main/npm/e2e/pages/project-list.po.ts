import {browser, by, element, ElementFinder} from "protractor";
import {PageObject} from "./page-object";

export class ProjectListPage implements PageObject {
    newProjectButton = element(by.css('.btn.btn-primary'));
    projectList = element.all(by.css('.list-group-item.project-info.tile-click'));

    projectListDiv = element(by.css('.projects-list'));

    emptyStateDiv = element(by.css('.blank-slate-pf'));

    public navigateTo() {
        return browser.get('./');
    }

    public search(text: string) {
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

    public getProjectList(): Promise<any[]> {
        return (this.projectList.then((elements: ElementFinder[]): any => {
            return Promise.all(elements.map((element, index, array) => {
                const project = {
                    name: '',
                    description: '',
                    countApplications: '',
                    lastUpdated: '',
                    editButton: element.element(by.css('.action-edit-project')),
                    deleteButton: element.element(by.css('.action-delete-project'))
                };

                return Promise.all([
                    element.element(by.css('.project-title')).getText().then(title => project.name = title),
                    element.element(by.css('.count-applications')).getText().then(count => project.countApplications = count),
                    element.element(by.css('.last-updated')).getText().then(lastUpdated => project.lastUpdated = lastUpdated),
                    element.element(by.css('.description')).getText().then(description => project.description = description),
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
}
