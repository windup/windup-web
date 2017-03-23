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

    get notAllSelected():boolean {
        if (!this.availableApps)
            return false;
        if (!this._selectedApps)
            return false;

        return this._selectedApps.length != this.availableApps.length;
    }

    get someSelected():boolean {
        return this._selectedApps ? this._selectedApps.length > 0 : false;
    }

    appsLabelCallback = (app: RegisteredApplication) => app.title;
    equalsCallback = (a1: RegisteredApplication, a2: RegisteredApplication) => a1.id === a2.id;

    selectAll() {
        this.selectedApps = this.availableApps;
        return false;
    }

    selectNone() {
        this.selectedApps = [];
        return false;
    }
}