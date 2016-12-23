import {Component, OnInit} from "@angular/core";
import {WindupExecution, ApplicationGroup} from "windup-services";
import {ActivatedRoute} from "@angular/router";
import {EventBusService} from "../../services/events/event-bus.service";
import {
    ExecutionEvent, ExecutionUpdatedEvent, NewExecutionStartedEvent,
    ApplicationGroupEvent
} from "../../services/events/windup-event";
import {WindupExecutionService} from "../../services/windup-execution.service";
import {AbstractComponent} from "../AbstractComponent";

@Component({
    template: '<wu-executions-list [executions]="executions" [activeExecutions]="activeExecutions"></wu-executions-list>'
})
export class GroupExecutionsComponent extends AbstractComponent implements OnInit {
    protected group: ApplicationGroup;
    protected executions: WindupExecution[];
    protected activeExecutionsMap: Map<number, WindupExecution> = new Map<number, WindupExecution>();
    protected activeExecutions: WindupExecution[];

    constructor(
        private _activatedRoute: ActivatedRoute,
        private _windupExecutionService: WindupExecutionService,
        private _eventBus: EventBusService
    ) {
        super();
    }

    ngOnInit(): void {
        this._activatedRoute.parent.data.subscribe((data: {applicationGroup: ApplicationGroup}) => {
            this.group = data.applicationGroup;
            this.loadExecutions(this.group.executions);
        });

        this.addSubscription(this._eventBus.onEvent.filter(event => event.isTypeOf(ApplicationGroupEvent))
            .filter((event: ApplicationGroupEvent) => event.group.id === this.group.id)
            .subscribe((event: ApplicationGroupEvent) => {
                this.group = event.group;
                this.loadExecutions(this.group.executions);
            })
        );

        this.addSubscription(this._eventBus.onEvent.filter(event => event.isTypeOf(ExecutionUpdatedEvent))
            .filter((event: ExecutionEvent) => event.group.id === this.group.id)
            .subscribe((event: ExecutionEvent) => {
                if (this.isExecutionActive(event.execution)) {
                    this.activeExecutionsMap.set(event.execution.id, event.execution);
                    this.updateActiveExecutions();
                } else if (this.activeExecutionsMap.has(event.execution.id)) {
                    this.activeExecutionsMap.delete(event.execution.id);
                    this.updateActiveExecutions();
                }
            }));
    }

    protected loadExecutions(executions: WindupExecution[]) {
        this.executions = executions;

        this.executions.filter(execution => this.isExecutionActive(execution))
            .forEach(execution => {
                this.activeExecutionsMap.set(execution.id, execution);
                this._windupExecutionService.watchExecutionUpdates(execution, this.group);
            });
        this.updateActiveExecutions();
    }

    protected isExecutionActive(execution: WindupExecution) {
        return execution.state === 'STARTED' || execution.state === 'QUEUED';
    }

    protected updateActiveExecutions() {
        this.activeExecutions = Array.from(this.activeExecutionsMap.values());
    }
}
