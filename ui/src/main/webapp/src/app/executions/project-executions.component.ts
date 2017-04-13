import {Component, OnInit} from "@angular/core";
import {WindupExecution} from "windup-services";
import {ActivatedRoute} from "@angular/router";
import {EventBusService} from "../core/events/event-bus.service";
import {WindupExecutionService} from "../services/windup-execution.service";
import {ExecutionsMonitoringComponent} from "./executions-monitoring.component";
import {MigrationProject} from "windup-services";
import {WindupService} from "../services/windup.service";
import {ExecutionUpdatedEvent, ExecutionEvent, NewExecutionStartedEvent} from "../core/events/windup-event";

@Component({
    template: '<wu-executions-list [executions]="executions" [activeExecutions]="activeExecutions"></wu-executions-list>'
})
export class ProjectExecutionsComponent extends ExecutionsMonitoringComponent implements OnInit {
    protected executions: WindupExecution[];
    private runUpdate: boolean;

    constructor(
        private _activatedRoute: ActivatedRoute,
        _windupExecutionService: WindupExecutionService,
        private _eventBus: EventBusService,
        private _windupService: WindupService
    ) {
        super(_windupExecutionService);
    }

    ngOnInit(): void {
        this._activatedRoute.parent.data.subscribe((data: {project: MigrationProject}) => {
            this.project = data.project;
            this.refreshExecutionList();
        });

        this.addSubscription(this._eventBus.onEvent
            .filter(event => event.isTypeOf(ExecutionEvent))
            .filter((event: ExecutionEvent) => event.migrationProject.id === this.project.id)
            .subscribe((event: ExecutionEvent) => this.onExecutionEvent(event)));

        this.runUpdate = Boolean(false);
    }

    private refreshExecutionList() {
        this._windupService.getProjectExecutions(this.project.id).subscribe(executions => {
            this.executions = executions;
            this.loadActiveExecutions(this.executions);
        });
    }

    protected onExecutionEvent(event: ExecutionEvent) {
        super.onExecutionEvent(event);
        if (!this.runUpdate || !(event.execution.state === 'STARTED')) {
            this.refreshExecutionList();
            this.runUpdate = Boolean(true);
        }
    }
}
