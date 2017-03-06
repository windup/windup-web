import {Component, OnInit} from "@angular/core";
import {WindupExecution, ApplicationGroup} from "windup-services";
import {ActivatedRoute} from "@angular/router";
import {EventBusService} from "../core/events/event-bus.service";
import {
    ExecutionEvent, ExecutionUpdatedEvent, NewExecutionStartedEvent,
    ApplicationGroupEvent
} from "../core/events/windup-event";
import {WindupExecutionService} from "../services/windup-execution.service";
import {ExecutionsMonitoringComponent} from "./executions-monitoring.component";

@Component({
    template: '<wu-executions-list [executions]="executions" [activeExecutions]="activeExecutions"></wu-executions-list>'
})
export class GroupExecutionsComponent extends ExecutionsMonitoringComponent implements OnInit {
    protected group: ApplicationGroup;
    protected executions: WindupExecution[];

    constructor(
        private _activatedRoute: ActivatedRoute,
        _windupExecutionService: WindupExecutionService,
        private _eventBus: EventBusService
    ) {
        super(_windupExecutionService);
    }

    ngOnInit(): void {
        this._activatedRoute.parent.data.subscribe((data: {applicationGroup: ApplicationGroup}) => {
            this.group = data.applicationGroup;
            this.executions = this.group.executions;
            this.loadActiveExecutions(this.group.executions);
        });

        this.addSubscription(this._eventBus.onEvent.filter(event => event.isTypeOf(ApplicationGroupEvent))
            .filter((event: ApplicationGroupEvent) => event.group.id === this.group.id)
            .subscribe((event: ApplicationGroupEvent) => {
                this.group = event.group;
                this.executions = this.group.executions;
                this.loadActiveExecutions(this.executions);
            })
        );

        this.addSubscription(this._eventBus.onEvent.filter(event => event.isTypeOf(ExecutionUpdatedEvent))
            .filter((event: ExecutionEvent) => event.group.id === this.group.id)
            .subscribe((event: ExecutionEvent) => this.onExecutionEvent(event)));
    }
}
