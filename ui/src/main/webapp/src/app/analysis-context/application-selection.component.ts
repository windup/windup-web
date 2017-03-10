import {Component, Input, Output, EventEmitter} from "@angular/core";
import {RegisteredApplication} from "windup-services";

@Component({
    selector: 'wu-application-selection',
    templateUrl: './application-selection.component.html',
    styles: [`
        .application-selection {
            
        }
    `]
})
export class ApplicationSelectionComponent {
    private _originalApplications:RegisteredApplication[];

    _applications:RegisteredApplication[] = [];

    @Input()
    set applications(applications:RegisteredApplication[]) {
        this._originalApplications = this._applications = applications;
    }

    get applications():RegisteredApplication[] {
        return this._applications;
    }

    @Input()
    selectedApplications:RegisteredApplication[] = [];

    @Output()
    selectedApplicationsChange = new EventEmitter<RegisteredApplication[]>();

    get empty():boolean {
        return this._originalApplications == null || this._originalApplications.length == 0;
    }

    updateFilter(title:string) {
        console.log("Filtering by: " + title);
        this._applications = this._originalApplications.filter(originalApplication => originalApplication.title.toUpperCase().indexOf(title.toUpperCase()) != -1);
    }

    shouldBeChecked(app:RegisteredApplication):boolean {
        return this.getSelectedAppByID(app.id) != null;
    }

    handleCheckboxChange(app:RegisteredApplication, newState:boolean) {
        let existingSelectedAppIndex = this.getSelectedAppIndexByID(app.id);
        if (!newState) {
            if (existingSelectedAppIndex != -1)
                this.selectedApplications.splice(existingSelectedAppIndex, 1);
        } else {
            if (existingSelectedAppIndex == -1)
                this.selectedApplications.push(app);
        }
        this.selectedApplicationsChange.emit(this.selectedApplications);
    }

    private getSelectedAppByID(id:number) {
        return this.selectedApplications.find((selectedApp) => selectedApp.id == id);
    }

    private getSelectedAppIndexByID(id:number) {
        return this.selectedApplications.findIndex((selectedApp) => selectedApp.id == id);
    }
}