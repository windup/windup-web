import {Component, OnInit} from "@angular/core";
import {WindupExecution, ApplicationGroup} from "windup-services";
import {ActivatedRoute} from "@angular/router";

@Component({
    template: '<wu-executions-list [executions]="executions"></wu-executions-list>'
})
export class GroupExecutionsComponent implements OnInit {
    protected executions: WindupExecution[];

    constructor(private _activatedRoute: ActivatedRoute) {
    }

    ngOnInit(): void {
        this._activatedRoute.parent.data.subscribe((data: {applicationGroup: ApplicationGroup}) => {
            this.executions = data.applicationGroup.executions;
        });
    }
}
