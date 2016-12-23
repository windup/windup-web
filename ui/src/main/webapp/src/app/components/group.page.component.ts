import {Component, OnDestroy, OnInit} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";

import {ApplicationGroup} from "windup-services";
import {ApplicationGroupService} from "../services/application-group.service";
import {RegisteredApplication} from "windup-services";
import {RegisteredApplicationService} from "../services/registered-application.service";
import {NotificationService} from "../services/notification.service";
import {utils} from "../utils";
import {WindupExecutionService} from "../services/windup-execution.service";
import {EventBusService} from "../services/events/event-bus.service";
import {ExecutionEvent} from "../services/events/windup-event";

@Component({
    templateUrl: 'group.page.component.html'
})
export class GroupPageComponent implements OnInit, OnDestroy
{
    inGroupID: number;
    group: ApplicationGroup;

    processMonitoringInterval;

    activeExecutions: WindupExecution[] = [];

    errorMessage: string;

    constructor(
        private _activatedRoute: ActivatedRoute,
        private _router: Router,
        private _applicationGroupService: ApplicationGroupService,
        private _registeredApplicationsService: RegisteredApplicationService,
        private _notificationService: NotificationService,
        private _windupExecutionService: WindupExecutionService,
        private _eventBus: EventBusService
    ) {}

    ngOnInit(): any {
        this._eventBus.onEvent
            .filter(event => event.isTypeOf(ExecutionEvent))
            .filter((event: ExecutionEvent) => event.group.id === this.group.id)
            .subscribe((event: ExecutionEvent) => {
                if (event.execution.state === "QUEUED" || event.execution.state === "STARTED") {
                    this.activeExecutions = [ event.execution ];
                } else {
                    this.activeExecutions = [];
                }
            });

        // Get groupID from params.
        this._activatedRoute.params.subscribe(params => {
            this.inGroupID = parseInt(params["groupId"]);
            console.log("ngOnInit(), groupID: ", this.inGroupID);
            this.loadGroup(this.inGroupID);
        });

        // Watch for new data of the group.
        this.processMonitoringInterval = setInterval(() => {
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
                this._notificationService.error(utils.getErrorMessage(error));
                this._router.navigate(['']);
            }
        );
    }

    ngOnDestroy(): any {
        if (this.processMonitoringInterval)
            clearInterval(this.processMonitoringInterval);
    }

    registerApplication(applicationGroup:ApplicationGroup) {
        this._router.navigate([`/projects/${this.group.migrationProject.id}/groups/${applicationGroup.id}/applications/register`]);
    }

    editApplication(application: RegisteredApplication) {
        this._router.navigate([`/projects/${this.group.migrationProject.id}/groups/${this.inGroupID}/applications/${application.id}/edit`]);
    }

    deleteApplication(application: RegisteredApplication) {
        if (application.registrationType == "PATH") {
            this._registeredApplicationsService.unregister(application)
                .subscribe(result => {
                    console.log(result);
                    this.loadGroup(this.inGroupID);
                });
        } else {
            this._registeredApplicationsService.deleteApplication(application)
                .subscribe(result => {
                    console.log(result);
                    this.loadGroup(this.inGroupID);
                });
        }
    }
}
