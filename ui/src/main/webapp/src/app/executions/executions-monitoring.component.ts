import {MigrationProject, WindupExecution} from "../generated/windup-services";
import {AbstractComponent} from "../shared/AbstractComponent";
import {WindupExecutionService} from "../services/windup-execution.service";
import {ExecutionEvent} from "../core/events/windup-event";

export abstract class ExecutionsMonitoringComponent extends AbstractComponent {
    protected activeExecutionsMap: Map<number, WindupExecution> = new Map<number, WindupExecution>();
    protected activeExecutions: WindupExecution[];
    protected project: MigrationProject;

    public constructor(protected _windupExecutionService: WindupExecutionService) {
        super();
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
}
