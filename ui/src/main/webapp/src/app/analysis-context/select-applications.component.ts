import {Component, Input, EventEmitter, Output} from "@angular/core";
import {RegisteredApplication} from "windup-services";

@Component({
    selector: 'wu-select-applications',
    templateUrl: './select-applications.component.html'
})
export class SelectApplicationsComponent {
    @Input()
    availableApps:RegisteredApplication[];
    _selectedApps:RegisteredApplication[];

    @Output()
    selectedAppsChange:EventEmitter<RegisteredApplication[]> = new EventEmitter<RegisteredApplication[]>();

    @Input()
    set selectedApps(apps:RegisteredApplication[]) {
        this._selectedApps = apps;
        this.selectedAppsChange.emit(this._selectedApps);
    }

    get selectedApps():RegisteredApplication[] {
        return this._selectedApps;
    }

    appsLabelCallback = (app: RegisteredApplication) => {
        console.log("Title is: " + app.title + ", for " , app);
        return app.title;
    };
    equalsCallback = (a1: RegisteredApplication, a2: RegisteredApplication) => a1.id === a2.id;
}