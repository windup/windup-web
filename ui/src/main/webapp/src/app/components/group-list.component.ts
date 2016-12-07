import {Component, OnDestroy, OnInit} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";

import {MigrationProject} from "../windup-services";
import {ApplicationGroup} from "../windup-services";
import {ApplicationGroupService} from "../services/application-group.service";
import {WindupService} from "../services/windup.service";
import {Constants} from "../constants";
import {RegisteredApplication} from "../windup-services";
import {WindupExecution} from "../windup-services";
import {RegisteredApplicationService} from "../services/registered-application.service";
import {NotificationService} from "../services/notification.service";
import {MigrationProjectService} from "../services/migration-project.service";
import {utils} from "../utils";

@Component({
    selector: 'application-list',
    templateUrl: 'group-list.component.html',
    styles: [
        `a { cursor: pointer; }`
    ]
})
export class GroupListComponent implements OnInit, OnDestroy {
    project: MigrationProject;
    inGroupID: number;
    groupSelected: ApplicationGroup;
    groups: ApplicationGroup[];

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

    ngOnInit():any {
        this._activatedRoute.data.subscribe((data: {project: MigrationProject}) => {
            this.project = data.project;
            this.getGroups();
        });

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
            this.getGroups();
        }, 30000);
    }

    ngOnDestroy():any {
        if (this.processMonitoringInterval)
            clearInterval(this.processMonitoringInterval);
    }

    getGroups() {
        console.log("getGroups()");
        return this._applicationGroupService.getByProjectID(this.project.id).subscribe(
            groups => this.groupsLoaded(groups),
            error => {
                if (error instanceof ProgressEvent) {
                    this.errorMessage = "ERROR: Server disconnected";
                } else {
                    this._notificationService.error(utils.getErrorMessage(error));
                    this._router.navigate(['']);
                }
            }
        );
    }

    groupsLoaded(groups:ApplicationGroup[]) {
        console.log("groupsLoaded()" +         " this.inGroupID: " + this.inGroupID);
        this.errorMessage = "";
        this.groups = groups;

        // On the first run, check for any existing executions
        if (this.processingStatus.size == 0) {
            groups.forEach((group:ApplicationGroup) => {
                group.executions.forEach((execution:WindupExecution) => {
                    console.log("Group #" + group.id + " " + group.title + ", status: " + execution.state);
                    let previousExecution = this.processingStatus.get(group.id);

                    if (group.id == this.inGroupID)
                        this.groupSelected = group;

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

    static reportURL(app:RegisteredApplication):string {
        return Constants.STATIC_REPORTS_BASE + "/" + app.reportIndexPath;
    }

    onClickGroup(group: ApplicationGroup) {
        this.groupSelected = group;
        //this._router.navigate(['/group-list', { projectID: this.inProjectID, groupID: group.id }]);
        console.log('onClickGroup(), navigating to /group/' + +group.id);
        this._router.navigate(['/groups', group.id]);
    }

    createGroup() {
        this._router.navigate([`/projects/${this.project.id}/groups/create`]);
    }

    editGroup(applicationGroup:ApplicationGroup, event:Event) {
        event.preventDefault();
        this._router.navigate([`/projects/${this.project.id}/groups/${applicationGroup.id}/edit`]);
    }

    doDeleteGroup(applicationGroup: ApplicationGroup) {
        this._applicationGroupService.delete(applicationGroup).subscribe(
            success => {
                this._notificationService.success(`Application group '${applicationGroup.title}' was successfully deleted`);
                let index = this.groups.indexOf(applicationGroup);
                this.groups.splice(index, 1);
            },
            error => {
                this._notificationService.error(utils.getErrorMessage(error));
            }
        );
    }

    deleteGroup(applicationGroup: ApplicationGroup) {
        let text =  `Do you really want to delete group ${applicationGroup.title}?`;

        if (window.confirm(text)) {
            this.doDeleteGroup(applicationGroup);
        }
    }
}
