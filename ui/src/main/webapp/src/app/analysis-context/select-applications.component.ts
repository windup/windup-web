import {Component, Input, EventEmitter, Output} from "@angular/core";
import {RegisteredApplication} from "../generated/windup-services";

@Component({
    selector: 'wu-select-applications',
    templateUrl: './select-applications.component.html'
})
export class SelectApplicationsComponent {
    _availableApps: RegisteredApplication[];

    appsSelectedError: string;

    @Input()
    set availableApps(availableApps: RegisteredApplication[]) {
        this._availableApps = availableApps;
        this.sort();
    }

    get availableApps(): RegisteredApplication[] {
        return this._availableApps;
    }

    availableAppsSorted: RegisteredApplication[];

    _selectedApps: RegisteredApplication[];

    @Output()
    selectedAppsChange: EventEmitter<RegisteredApplication[]> = new EventEmitter<RegisteredApplication[]>();

    @Input()
    set selectedApps(apps: RegisteredApplication[]) {
        this._selectedApps = apps;
        if (!this._selectedApps || this._selectedApps.length === 0){
            this.appsSelectedError = "You must select an application to run the analysis with";
        }
        else{
            this.appsSelectedError = null;
        }
        this.selectedAppsChange.emit(this._selectedApps);
    }

    get selectedApps(): RegisteredApplication[] {
        return this._selectedApps;
    }

    appsLabelCallback = (app: RegisteredApplication) => app.title;
    equalsCallback = (a1: RegisteredApplication, a2: RegisteredApplication) => a1.id === a2.id;

    sort() {
        if (!this._availableApps) {
            this.availableAppsSorted = [];
        } else {
            this.availableAppsSorted = this._availableApps.sort((app1, app2) => app1.inputFilename.localeCompare(app2.inputFilename));
        }
    }

    selectAll() {
        this.selectedApps = this.availableApps;
        return false;
    }

    selectNone() {
        this.selectedApps = [];
        return false;
    }
}
