import {MigrationProject, WindupExecution} from "../generated/windup-services";
import {AbstractComponent} from "../shared/AbstractComponent";
import {WindupExecutionService} from "../services/windup-execution.service";
import {ExecutionEvent} from "../core/events/windup-event";
import {OnDestroy, OnInit} from "@angular/core";

export abstract class ExecutionsMonitoringComponent extends AbstractComponent implements OnDestroy, OnInit {
    protected activeExecutionsMap: Map<number, WindupExecution> = new Map<number, WindupExecution>();
    activeExecutions: WindupExecution[];
    public project: MigrationProject;

    public constructor(protected _windupExecutionService: WindupExecutionService) {
        super();
    }

    ngOnInit(): void {
        this._windupExecutionService.startMonitoring();
    }

    protected loadActiveExecutions(executions: WindupExecution[]) {
        this.activeExecutionsMap.clear();
        executions.filter(execution => this.isExecutionActive(execution))
            .forEach(execution => {
                this.activeExecutionsMap.set(execution.id, execution);
                this._windupExecutionService.watchExecutionUpdates(execution, this.project);
            });
        this.updateActiveExecutions();
    }

    protected isExecutionActive(execution: WindupExecution) {
        return execution.state === 'STARTED' || execution.state === 'QUEUED';
    }

    protected updateActiveExecutions() {
        this.activeExecutions = Array.from(this.activeExecutionsMap.values());
    }

    protected onExecutionEvent(event: ExecutionEvent) {
        if (this.isExecutionActive(event.execution)) {
            this.activeExecutionsMap.set(event.execution.id, event.execution);
            this.updateActiveExecutions();
        } else if (this.activeExecutionsMap.has(event.execution.id)) {
            this.activeExecutionsMap.delete(event.execution.id);
            this.updateActiveExecutions();
        }
    }

    ngOnDestroy(): void {
        super.ngOnDestroy();
        this._windupExecutionService.stopMonitoring();
    }
}
