import {Component, OnInit} from "@angular/core";
import {WindupService} from "../../services/windup.service";
import {NotificationService} from "../../services/notification.service";
import {utils} from "../../utils";
import {WindupExecution} from "windup-services";
import {WindupExecutionService} from "../../services/windup-execution.service";
import {EventBusService} from "../../services/events/event-bus.service";
import {ExecutionEvent, NewExecutionStartedEvent} from "../../services/events/windup-event";
import {AbstractComponent} from "../AbstractComponent";

@Component({
    template: '<wu-executions-list [executions]="executions" [activeExecutions]="activeExecutions"></wu-executions-list>'
})
export class AllExecutionsComponent extends AbstractComponent implements OnInit {
    protected executions: WindupExecution[];
    protected activeExecutionsMap: Map<number, WindupExecution> = new Map<number, WindupExecution>();
    protected activeExecutions: WindupExecution[];

    constructor(
        private _windupService: WindupService,
        private _notificationService: NotificationService,
        private _windupExecutionService: WindupExecutionService,
        private _eventBus: EventBusService
    ) {
        super();
    }

    ngOnInit(): void {
        this.loadExecutions();

        this.addSubscription(this._eventBus.onEvent.filter(event => event.isTypeOf(ExecutionEvent))
            .subscribe((event: ExecutionEvent) => {
                if (this.isExecutionActive(event.execution)) {
                    this.activeExecutionsMap.set(event.execution.id, event.execution);
                    this.updateActiveExecutions();
                } else if (this.activeExecutionsMap.has(event.execution.id)) {
                    this.activeExecutionsMap.delete(event.execution.id);
                    this.updateActiveExecutions();
                }
            }));

        this.addSubscription(this._eventBus.onEvent.filter(event => event.isTypeOf(NewExecutionStartedEvent))
            .subscribe((event: NewExecutionStartedEvent) => {
                this.loadExecutions();
            }));
    }

    protected loadExecutions() {
        this._windupService.getAllExecutions().subscribe(
            executions => {
                this.executions = executions;
                this.executions.filter(execution => this.isExecutionActive(execution))
                    .forEach(execution => {
                        this.activeExecutionsMap.set(execution.id, execution);
                        this._windupExecutionService.watchExecutionUpdates(execution, null);
                        this.updateActiveExecutions();
                    });
            },
            error => {
                this._notificationService.error(utils.getErrorMessage(error))
            }
        );
    }

    protected isExecutionActive(execution: WindupExecution) {
        return execution.state === 'STARTED' || execution.state === 'QUEUED';
    }

    protected updateActiveExecutions() {
        this.activeExecutions = Array.from(this.activeExecutionsMap.values());
    }
}
