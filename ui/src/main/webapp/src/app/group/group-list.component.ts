import {Component, OnDestroy, OnInit} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";

import {MigrationProject} from "windup-services";
import {ApplicationGroup} from "windup-services";
import {ApplicationGroupService} from "./application-group.service";
import {WindupService} from "../services/windup.service";
import {Constants} from "../constants";
import {RegisteredApplication} from "windup-services";
import {WindupExecution} from "windup-services";
import {RegisteredApplicationService} from "../registered-application/registered-application.service";
import {NotificationService} from "../core/notification/notification.service";
import {MigrationProjectService} from "../project/migration-project.service";
import {utils} from "../shared/utils";
import {WindupExecutionService} from "../services/windup-execution.service";
import {EventBusService} from "../core/events/event-bus.service";
import {ApplicationGroupEvent, ExecutionEvent} from "../core/events/windup-event";
import {Subscription} from "rxjs";

@Component({
    templateUrl: './group-list.component.html',
    styles: [
        `a { cursor: pointer; }`
    ]
})
export class GroupListComponent implements OnInit, OnDestroy {
    project: MigrationProject;
    groups: ApplicationGroup[];

    processingStatus: Map<number, WindupExecution> = new Map<number, WindupExecution>();
    processMonitoringInterval;

    errorMessage: string;

    protected eventSubscriptions: Subscription[] = [];


    constructor(
        private _activatedRoute: ActivatedRoute,
        private _router: Router,
        private _applicationGroupService: ApplicationGroupService,
        private _windupService: WindupService,
        private _registeredApplicationsService: RegisteredApplicationService,
        private _notificationService: NotificationService,
        private _migrationProjectService: MigrationProjectService,
        private _windupExecutionService: WindupExecutionService,
        private _eventBus: EventBusService
    ) {}

    // TODO: Execution progress: Group List must be updated when execution state changes

    ngOnInit():any {
        this._activatedRoute.data.subscribe((data: {project: MigrationProject}) => {
            this.project = data.project;
            this.getGroups();
        });

        this.eventSubscriptions.push(
            this._eventBus.onEvent.filter(event => event.isTypeOf(ExecutionEvent))
                .subscribe((event: ExecutionEvent) => this.onExecutionUpdate(event))
        );

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

    onExecutionUpdate(event: ExecutionEvent) {

    }

    ngOnDestroy():any {
        if (this.processMonitoringInterval)
            clearInterval(this.processMonitoringInterval);

        this.eventSubscriptions.forEach(subscription => subscription.unsubscribe());
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
        this.errorMessage = "";
        this.groups = groups;

        // On the first run, check for any existing executions
        if (this.processingStatus.size == 0) {
            groups.forEach((group:ApplicationGroup) => {
                group.executions.forEach((execution:WindupExecution) => {
                    console.log("Group #" + group.id + " " + group.title + ", status: " + execution.state);
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

        this._windupExecutionService.execute(group).subscribe(
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
