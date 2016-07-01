import {Component, OnDestroy, OnInit} from "@angular/core";
import {Inject} from '@angular/core';
import {Router} from "@angular/router-deprecated";

import {WindupService} from "../services/windup.service";
import {RegisteredApplicationService} from "../services/registeredapplication.service";
import {ProgressStatusModel} from "../models/progressstatus.model";
import {Constants} from "../constants";
import {ProgressBarComponent} from "./progressbar.component";
import {RegisteredApplication} from "windup-services";

@Component({
    selector: 'application-list',
    templateUrl: 'app/templates/applicationlist.component.html',
    directives: [ ProgressBarComponent ],
    providers: [ RegisteredApplicationService, WindupService ]
})
export class ApplicationListComponent implements OnInit, OnDestroy {
    applications:RegisteredApplication[];
    processingStatus:Map<string, ProgressStatusModel> = new Map<string, ProgressStatusModel>();
    errorMessage:string;
    private _refreshIntervalID:number;

    constructor(
        private _router:Router,
        private _registeredApplicationService:RegisteredApplicationService,
        private _windupService:WindupService,
        private _constants:Constants
    ) {}

    ngOnInit():any {
        this.getApplications();
        this._refreshIntervalID = setInterval(() => this.getApplications(), 3000);
    }

    ngOnDestroy():any {
        if (this._refreshIntervalID)
            clearInterval(this._refreshIntervalID);
    }

    status(application:RegisteredApplication):ProgressStatusModel {
        let status:ProgressStatusModel = this.processingStatus.get(application.inputPath);

        if (status == null) {
            status = new ProgressStatusModel();
            status.currentTask = "...";
        }
        return status;
    }

    getApplications() {
        return this._registeredApplicationService.getApplications().subscribe(
            applications => this.applicationsLoaded(applications),
            error => this.errorMessage = <any>error
        );
    }

    applicationsLoaded(applications:RegisteredApplication[]) {
        this.errorMessage = "";

        applications.forEach(application => {
            this._windupService.getStatus(application).subscribe(
                status => {
                    this.processingStatus.set(application.inputPath, status);
                    this.errorMessage = "";
                },
                error => this.errorMessage = <any>error
            );
        });
        this.applications = applications;
    }

    executeAnalysis(application:RegisteredApplication) {
        this._windupService.executeWindup(application).subscribe(
            () => console.log("Execution started"),
            error => this.errorMessage = <any>error
        );
    }

    registerApplication() {
        this._router.navigate(['RegisterApplicationForm'])
    }

    createMigrationProject() {
        this._router.navigate(['MigrationProjectForm'])
    }

    reportURL(path:string) : string {
        return this._constants.STATIC_REPORTS_BASE + "/" + path.substr(path.lastIndexOf('/') + 1) + "/index.html";
    }
}