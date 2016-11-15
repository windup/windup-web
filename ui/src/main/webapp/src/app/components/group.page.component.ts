import {Component, OnDestroy, OnInit, Input} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";

import {MigrationProject} from "../windup-services";
import {ApplicationGroup} from "../windup-services";
import {ApplicationGroupService} from "../services/application-group.service";
import {WindupService} from "../services/windup.service";
import {RegisteredApplication} from "../windup-services";
import {WindupExecution} from "../windup-services";
import {RegisteredApplicationService} from "../services/registered-application.service";
import {NotificationService} from "../services/notification.service";
import {MigrationProjectService} from "../services/migration-project.service";
import {utils} from "../utils";

@Component({
    templateUrl: 'group.page.component.html'
})
export class GroupPageComponent implements OnInit, OnDestroy
{
    projectID: number;
    inGroupID: number;
    project: MigrationProject;
    group: ApplicationGroup;
    apps: RegisteredApplication[];

    processingStatus: Map<number, WindupExecution> = new Map<number, WindupExecution>();
    processMonitoringInterval;

    errorMessage: string;

    constructor(
        private _activatedRoute: ActivatedRoute,
        private _router: Router,
        private _applicationGroupService: ApplicationGroupService,
        private _windupService: WindupService,
        private _registeredApplicationsService: RegisteredApplicationService,
        private _notificationService: NotificationService,
        private _migrationProjectService: MigrationProjectService
    ) {}

    ngOnInit(): any {
        // Get groupID from params.
        this._activatedRoute.params.subscribe(params => {
            this.inGroupID = parseInt(params["groupID"]);
            console.log("ngOnInit(), groupID: ", this.inGroupID);
            this.loadGroup(this.inGroupID);
        });

        // Watch for new data of the group.
        this.processMonitoringInterval = setInterval(() => {
            this.processingStatus.forEach( (previousExecution:WindupExecution, groupID:number, map:Map<number, WindupExecution>) => {
                if (["STARTED", "QUEUED"].includes(previousExecution.state)) {
                    this._windupService.getStatusGroup(previousExecution.id).subscribe(
                        execution => {
                            this.processingStatus.set(groupID, execution);
                            this.errorMessage = "";
                        },
                        error => this.errorMessage = <any>error
                    );
                }
            });
            this.loadGroup();
        }, 30000);
    }

    loadGroup(inGroupID?: number): void {
        if (!inGroupID)
            inGroupID = this.inGroupID;
        if (!inGroupID)
            throw new Error("Group to load not specified.");

        this._applicationGroupService.get(inGroupID).subscribe(
            group => {
                this.group = group;
                console.log('Group loaded: ', inGroupID);
            },
            error => {
                this._notificationService.error(utils.getErrorMessage(error.error));
                this._router.navigate(['']);
            }
        );
    }

    ngOnDestroy(): any {
        if (this.processMonitoringInterval)
            clearInterval(this.processMonitoringInterval);
    }

    appsLoaded(apps: RegisteredApplication[]) {
        this.errorMessage = "";
        this.apps = apps;

        // On the first run, check for any existing executions
        if (this.processingStatus.size == 0) {
            this.group.executions.forEach((execution:WindupExecution) => {
                console.log("group and status == " + this.group.title + " id: " + this.group.id + " status: " + execution.state);
                let previousExecution = this.processingStatus.get(this.group.id);

                if (previousExecution == null || execution.state == "STARTED" || execution.timeStarted > previousExecution.timeStarted)
                    this.processingStatus.set(this.group.id, execution);
            });
        }
    }

    registerApplication(applicationGroup:ApplicationGroup) {
        this._router.navigate(['/register-application', { groupID: applicationGroup.id }]);
    }

    editApplication(application: RegisteredApplication) {
        this._router.navigate(['/edit-application', application.id]);
    }

    deleteApplication(application: RegisteredApplication) {
        if (application.registrationType == "PATH") {
            this._registeredApplicationsService.unregister(application)
                .subscribe(result => {
                    console.log(result);
                    //this.loadGroup();
                });
        } else {
            this._registeredApplicationsService.deleteApplication(application)
                .subscribe(result => {
                    console.log(result);
                    //this.loadGroup();
                });
        }
    }

}