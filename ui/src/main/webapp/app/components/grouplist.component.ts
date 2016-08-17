import {Component, OnDestroy, OnInit} from "@angular/core";
import {Inject} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";

import {MigrationProject} from "windup-services";
import {ApplicationGroup} from "windup-services";
import {ApplicationGroupService} from "../services/applicationgroup.service";
import {WindupService} from "../services/windup.service";
import {ProgressStatusModel} from "../models/progressstatus.model";
import {Constants} from "../constants";
import {RegisteredApplication} from "windup-services";

@Component({
    selector: 'application-list',
    templateUrl: 'app/components/grouplist.component.html',
    providers: [ ApplicationGroupService, WindupService ]
})
export class GroupListComponent implements OnInit, OnDestroy {
    projectID:number;
    groups:ApplicationGroup[];
    processingStatus:Map<number, ProgressStatusModel> = new Map<number, ProgressStatusModel>();
    errorMessage:string;

    constructor(
        private _constants: Constants,
        private _activatedRoute: ActivatedRoute,
        private _router: Router,
        private _applicationGroupService: ApplicationGroupService,
        private _windupService: WindupService
    ) {}

    ngOnInit():any {
        this._activatedRoute.params.subscribe(params => {
            this.projectID = parseInt(params["projectID"]);
            this.getGroups();
        });
    }

    ngOnDestroy():any {
    }

    getGroups() {
        return this._applicationGroupService.getByProjectID(this.projectID).subscribe(
            groups => this.groupsLoaded(groups),
            error => this.errorMessage = <any>error
        );
    }

    groupsLoaded(groups:ApplicationGroup[]) {
        this.errorMessage = "";

        this.groups = groups;
    }

    status(group:ApplicationGroup):ProgressStatusModel {
        let status:ProgressStatusModel = this.processingStatus.get(group.id);

        if (status == null) {
            status = new ProgressStatusModel();
            status.currentTask = "...";
        }
        return status;
    }

    runWindup(event:Event, group:ApplicationGroup)
    {
        event.preventDefault();

        this._windupService.executeWindupGroup(group.id).subscribe(
            () => {
                console.log("Execution started for group: " + group.title);
                let intervalID = setInterval(() => {
                    this._windupService.getStatusGroup(group.id).subscribe(
                        status => {
                            this.processingStatus.set(group.id, status);
                            this.errorMessage = "";
                            if (status.completed) {
                                clearInterval(intervalID);
                                this.getGroups();
                            }
                        },
                        error => this.errorMessage = <any>error
                    );
                }, 1000);
            },
            error => this.errorMessage = <any>error
        );
    }

    reportURL(app:RegisteredApplication) : string {
        return this._constants.STATIC_REPORTS_BASE + "/" + app.reportIndexPath;
    }

    createGroup() {
        this._router.navigate(['/application-group-form', { projectID: this.projectID }]);
    }

    editGroup(applicationGroup:ApplicationGroup, event:Event) {
        event.preventDefault();
        this._router.navigate(['/application-group-form', { projectID: this.projectID, groupID: applicationGroup.id }]);
    }

    registerApplication(applicationGroup:ApplicationGroup) {
        this._router.navigate(['/register-application', { groupID: applicationGroup.id }]);
    }
}