import {Component, OnDestroy, OnInit} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";

import {MigrationProject} from "../windup-services";
import {ApplicationGroup} from "../windup-services";
import {ApplicationGroupService} from "../services/applicationgroup.service";
import {WindupService} from "../services/windup.service";
import {Constants} from "../constants";
import {RegisteredApplication} from "../windup-services";
import {WindupExecution} from "../windup-services";
import {RegisteredApplicationService} from "../services/registeredapplication.service";
import {NotificationService} from "../notification/notification.service";
import {MigrationProjectService} from "../project/migrationproject.service";

@Component({
    selector: 'application-list',
    templateUrl: 'grouplist.component.html'
})
export class GroupListComponent implements OnInit, OnDestroy {
    projectID:number;
    project:MigrationProject;
    groups:ApplicationGroup[];

    processingStatus:Map<number, WindupExecution> = new Map<number, WindupExecution>();
    processMonitoringInterval;

    errorMessage:string;

    constructor(
        private _activatedRoute: ActivatedRoute,
        private _router: Router,
        private _applicationGroupService: ApplicationGroupService,
        private _windupService: WindupService,
        private _registeredApplicationsService: RegisteredApplicationService,
        private _notificationService: NotificationService,
        private _migrationProjectService: MigrationProjectService
    ) {}

    ngOnInit():any {
        this._activatedRoute.params.subscribe(params => {
            this.projectID = parseInt(params["projectID"]);

            this._migrationProjectService.get(this.projectID)
                .subscribe(
                    project => {
                        this.project = project;
                        console.log('success');
                    },
                    error => {
                        this._notificationService.error(this.getErrorMessage(error.error));
                        this._router.navigate(['']);
                    }
                );

            this.getGroups();
        });

        this.processMonitoringInterval = setInterval(() => {
            this.processingStatus.forEach( (previousExecution:WindupExecution, groupID:number, map:Map<number, WindupExecution>) => {
                if (previousExecution.state == "STARTED" || previousExecution.state == "QUEUED") {
                    this._windupService.getStatusGroup(previousExecution.id).subscribe(
                        execution => {
                            this.processingStatus.set(groupID, execution);
                            this.errorMessage = "";
                        },
                        error => this.errorMessage = <any>error
                    );
                }
            });
            this.getGroups();
        }, 30000);
    }

    getErrorMessage(error: any): string {
        if (error instanceof ProgressEvent) {
            return "ERROR: Server disconnected";
        } else if (typeof error == 'string') {
            return error;
        } else if (typeof error == 'object' && error.hasOwnProperty('message')) {
            return error.message;
        } else {
            return 'Unknown error'
        }
    }

    ngOnDestroy():any {
        if (this.processMonitoringInterval)
            clearInterval(this.processMonitoringInterval);
    }

    getGroups() {
        return this._applicationGroupService.getByProjectID(this.projectID).subscribe(
            groups => this.groupsLoaded(groups),
            error => {
                if (error instanceof ProgressEvent) {
                    this.errorMessage = "ERROR: Server disconnected";
                } else {
                    this._notificationService.error(this.getErrorMessage(error));
                    this._router.navigate(['']);
                }
            }
        );
    }

    groupsLoaded(groups:ApplicationGroup[]) {
        this.errorMessage = "";

        this.groups = groups;

        // On the first run, check for any existing executions
        if (this.processingStatus.size == 0) {
            groups.forEach((group:ApplicationGroup) => {
                group.executions.forEach((execution:WindupExecution) => {
                    console.log("group and status == " + group.title + " id: " + group.title + " status: " + execution.state);
                    let previousExecution = this.processingStatus.get(group.id);

                    if (previousExecution == null || execution.state == "STARTED" || execution.timeStarted > previousExecution.timeStarted)
                        this.processingStatus.set(group.id, execution);
                });
            });
        }
    }

    status(group:ApplicationGroup):WindupExecution {
        let status:WindupExecution = this.processingStatus.get(group.id);

        if (status == null)
        {
            status = <WindupExecution>{};
            status.currentTask = "...";
        }
        return status;
    }

    runWindup(event:Event, group:ApplicationGroup)
    {
        event.preventDefault();

        this._windupService.executeWindupGroup(group.id).subscribe(
            (execution:WindupExecution) => {
                console.log("Execution started for group: " + JSON.stringify(execution));
                this.processingStatus.set(group.id, execution);
            },
            error => this.errorMessage = <any>error
        );
    }

    groupReportURL(group:ApplicationGroup):string {
        let execution:WindupExecution = this.processingStatus.get(group.id);

        if (execution == null || execution.applicationListRelativePath == null || execution.state != "COMPLETED")
            return null;

        return Constants.STATIC_REPORTS_BASE + "/" + execution.applicationListRelativePath;
    }

    reportURL(app:RegisteredApplication):string {
        return Constants.STATIC_REPORTS_BASE + "/" + app.reportIndexPath;
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

    editApplication(application: RegisteredApplication) {
        this._router.navigate(['/edit-application', application.id]);
    }

    deleteApplication(application: RegisteredApplication) {
        if (application.registrationType == "PATH") {
            this._registeredApplicationsService.unregister(application)
                .subscribe(result => {
                    console.log(result);
                    this.getGroups();
                });
        } else {
            this._registeredApplicationsService.deleteApplication(application)
                .subscribe(result => {
                    console.log(result);
                    this.getGroups();
                });
        }
    }
}
