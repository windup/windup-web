import {Component, OnDestroy, OnInit} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";

import {ApplicationGroup} from "windup-services";
import {ApplicationGroupService} from "../services/application-group.service";
import {RegisteredApplication} from "windup-services";
import {RegisteredApplicationService} from "../services/registered-application.service";
import {NotificationService} from "../core/notification/notification.service";
import {utils} from "../utils";
import {WindupExecutionService} from "../services/windup-execution.service";
import {EventBusService} from "../core/events/event-bus.service";
import {ExecutionEvent} from "../core/events/windup-event";
import {ExecutionsMonitoringComponent} from "./executions/executions-monitoring.component";
import {MigrationProject} from "windup-services";

@Component({
    templateUrl: './application-list.component.html'
})
export class ApplicationListComponent extends ExecutionsMonitoringComponent implements OnInit, OnDestroy
{
    group: ApplicationGroup;
    project: MigrationProject;

    constructor(
        private _activatedRoute: ActivatedRoute,
        private _router: Router,
        private _applicationGroupService: ApplicationGroupService,
        private _registeredApplicationsService: RegisteredApplicationService,
        private _notificationService: NotificationService,
        _windupExecutionService: WindupExecutionService,
        private _eventBus: EventBusService
    ) {
        super(_windupExecutionService);
    }

    ngOnInit(): any {
        this._eventBus.onEvent
            .filter(event => event.isTypeOf(ExecutionEvent))
            .filter((event: ExecutionEvent) => event.group.id === this.group.id)
            .subscribe((event: ExecutionEvent) => {
                this.onExecutionEvent(event);
            });

        // Get groupID from params.
        this._activatedRoute.parent.parent.data.subscribe((data: {project: MigrationProject}) => {
            this.project = data.project;
        });
    }

    loadGroup(inGroupID?: number): void {
        this._applicationGroupService.get(inGroupID).subscribe(
            group => {
                this.group = group;
                this.project = group.migrationProject;
                this.loadActiveExecutions(this.group.executions);
                console.log('Group loaded: ', inGroupID);
            },
            error => {
                this._notificationService.error(utils.getErrorMessage(error));
                this._router.navigate(['']);
            }
        );
    }

    ngOnDestroy() {
    }

    registerApplication() {
        this._router.navigate([`/projects/${this.project.id}/applications/register`]);
    }

    editApplication(application: RegisteredApplication) {
        this._router.navigate([`/projects/${this.project.id}/applications/${application.id}/edit`]);
    }

    deleteApplication(application: RegisteredApplication) {
        this._registeredApplicationsService.deleteApplication(this.project, application).subscribe(
            () => {}, // reload project
            error => this._notificationService.error(utils.getErrorMessage(error))
        );
    }
}
