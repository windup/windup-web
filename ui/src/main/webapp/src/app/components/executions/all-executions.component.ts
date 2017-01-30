import {Component, OnInit} from "@angular/core";
import {WindupService} from "../../services/windup.service";
import {NotificationService} from "../../core/notification/notification.service";
import {utils} from "../../shared/utils";
import {WindupExecution} from "windup-services";
import {WindupExecutionService} from "../../services/windup-execution.service";
import {EventBusService} from "../../core/events/event-bus.service";
import {ExecutionEvent, NewExecutionStartedEvent} from "../../core/events/windup-event";
import {ExecutionsMonitoringComponent} from "./executions-monitoring.component";

@Component({
    template: '<wu-executions-list [executions]="executions" [activeExecutions]="activeExecutions"></wu-executions-list>'
})
export class AllExecutionsComponent extends ExecutionsMonitoringComponent implements OnInit {
    protected executions: WindupExecution[];

    constructor(
        private _windupService: WindupService,
        private _notificationService: NotificationService,
        _windupExecutionService: WindupExecutionService,
        private _eventBus: EventBusService
    ) {
        super(_windupExecutionService);
    }

    ngOnInit(): void {
        this.loadExecutions();

        this.addSubscription(this._eventBus.onEvent.filter(event => event.isTypeOf(ExecutionEvent))
            .subscribe((event: ExecutionEvent) => this.onExecutionEvent(event)));

        this.addSubscription(this._eventBus.onEvent.filter(event => event.isTypeOf(NewExecutionStartedEvent))
            .subscribe((event: NewExecutionStartedEvent) => {
                this.loadExecutions();
            }));
    }

    protected loadExecutions() {
        this._windupService.getAllExecutions().subscribe(
            executions => {
                this.executions = executions;
                super.loadActiveExecutions(executions);
            },
            error => {
                this._notificationService.error(utils.getErrorMessage(error))
            }
        );
    }
}
