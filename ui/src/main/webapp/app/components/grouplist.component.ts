import {Component, OnDestroy, OnInit} from "@angular/core";
import {Inject} from '@angular/core';
import {Router, RouteParams} from "@angular/router-deprecated";

import {MigrationProject} from "windup-services";
import {ApplicationGroup} from "windup-services";
import {ApplicationGroupService} from "../services/applicationgroup.service";

@Component({
    selector: 'application-list',
    templateUrl: 'app/components/grouplist.component.html',
    providers: [ ApplicationGroupService ]
})
export class GroupListComponent implements OnInit, OnDestroy {
    projectID:number;
    groups:ApplicationGroup[];

    errorMessage:string;
    private _refreshIntervalID:number;

    constructor(
        private _routeParams: RouteParams,
        private _router: Router,
        private _applicationGroupService: ApplicationGroupService
    ) {}

    ngOnInit():any {
        this.projectID = parseInt(this._routeParams.get("projectID"));
        this.getGroups();
        this._refreshIntervalID = setInterval(() => this.getGroups(), 3000);
    }

    ngOnDestroy():any {
        if (this._refreshIntervalID)
            clearInterval(this._refreshIntervalID);
    }

    getGroups() {
        return this._applicationGroupService.getByProjectID(this.projectID).subscribe(
        //return this._applicationGroupService.getAll().subscribe(
            groups => this.groupsLoaded(groups),
            error => this.errorMessage = <any>error
        );
    }

    groupsLoaded(groups:ApplicationGroup[]) {
        this.errorMessage = "";

        this.groups = groups;
    }

    createGroup() {
        this._router.navigate(['ApplicationGroupForm', { projectID: this.projectID }]);
    }

    editGroup(applicationGroup:ApplicationGroup, event:Event) {
        event.preventDefault();
        this._router.navigate(['ApplicationGroupForm', { projectID: this.projectID, groupID: applicationGroup.id }]);
    }

    registerApplication(applicationGroup:ApplicationGroup) {
        this._router.navigate(['RegisterApplicationForm', { groupID: applicationGroup.id }]);
    }
}