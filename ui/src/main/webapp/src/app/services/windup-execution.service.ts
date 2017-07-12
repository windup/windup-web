import {Injectable} from "@angular/core";
import {AnalysisContext, MigrationProject, WindupExecution} from "../generated/windup-services";
import {AbstractService} from "../shared/abtract.service";
import {Observable} from "rxjs/Observable";
import {WindupService} from "./windup.service";
import {EventBusService} from "../core/events/event-bus.service";
import {
    ExecutionUpdatedEvent,
    ExecutionCompletedEvent, NewExecutionStartedEvent, DeleteMigrationProjectEvent
} from "../core/events/windup-event";
import {SchedulerService} from "../shared/scheduler.service";
import {Constants} from "../constants";
import {WebSocketSubject} from "rxjs/observable/dom/WebSocketSubject";

@Injectable()
export class WindupExecutionService extends AbstractService {
    static EXECUTION_PROGRESS_URL = Constants.REST_BASE + "/websocket/execution-progress/{executionId}";

    static CHECK_EXECUTIONS_INTERVAL = 3 * 1000; // 30 s

    protected activeExecutions: Map<number, WindupExecution> = new Map<number, WindupExecution>();
    protected executionProjects: Map<number, MigrationProject> = new Map<number, MigrationProject>();

    constructor(private _windupService: WindupService, private _eventBus: EventBusService, private _scheduler: SchedulerService) {
        super();
        // this._scheduler.setInterval(() => this.checkExecutions(),  WindupExecutionService.CHECK_EXECUTIONS_INTERVAL);

        this._eventBus.onEvent.filter(event => event.source !== this)
            .filter(event => event.isTypeOf(DeleteMigrationProjectEvent))
            .subscribe((event: DeleteMigrationProjectEvent) => this.stopWatchingExecutions(event));
    }

    private stopWatchingExecutions(event: DeleteMigrationProjectEvent) {
        this.activeExecutions.forEach((execution, executionId) => {
            if (execution.projectId == event.migrationProject.id)
                this.activeExecutions.delete(executionId);
        });

        this.executionProjects.forEach((project, executionId) => {
            if (project.id == event.migrationProject.id)
                this.executionProjects.delete(executionId);
        });
    }

    public execute(analysisContext: AnalysisContext, project: MigrationProject): Observable<WindupExecution> {
        return this._windupService.executeWindupWithAnalysisContext(analysisContext, project)
            .do(execution => {
                this._eventBus.fireEvent(new NewExecutionStartedEvent(execution, project, this));
                this.watchExecutionUpdates(execution, project)
            });
    }

    public watchExecutionUpdates(execution: WindupExecution, project: MigrationProject) {
        const url = WindupExecutionService.EXECUTION_PROGRESS_URL
            .replace('https', 'wss')
            .replace('http', 'ws')
            .replace('{executionId}', execution.id.toString());

        const socket = new WebSocketSubject(url);
        socket.subscribe((execution: WindupExecution) => this.onExecutionUpdate(execution));

        const previousExecution = this.activeExecutions.get(execution.id);

        if (previousExecution == null && this.keepWatchingExecution(execution)) {
            this.activeExecutions.set(execution.id, execution);

            if (!this.executionProjects.has(execution.id)) {
                this.executionProjects.set(execution.id, project);
            }
        }
    }

    protected hasExecutionChanged(oldExecution: WindupExecution, newExecution: WindupExecution) {
        return oldExecution.id === newExecution.id && oldExecution.lastModified !== newExecution.lastModified;
    }

    protected keepWatchingExecution(execution: WindupExecution) {
        return execution.state === "STARTED" || execution.state === "QUEUED";
    }

    protected onExecutionUpdate(execution: WindupExecution) {
        const previousExecution = this.activeExecutions.get(execution.id);
        const project = this.executionProjects.get(execution.id);

        if (this.hasExecutionChanged(previousExecution, execution)) {
            this._eventBus.fireEvent(new ExecutionUpdatedEvent(execution, project, this));
            this.activeExecutions.set(execution.id, execution);
        }

        if (execution.state === "COMPLETED") {
            this._eventBus.fireEvent(new ExecutionCompletedEvent(execution, project, this));
        }

        if (!this.keepWatchingExecution(execution)) {
            this.activeExecutions.delete(execution.id);
            this.executionProjects.delete(execution.id);
        }
    }

    // TODO: It would be great to switch from pull model to push notifications
    protected checkExecutions() {
        this.activeExecutions.forEach((previousExecution: WindupExecution) => {
            this._windupService.getExecution(previousExecution.id).subscribe(execution => this.onExecutionUpdate(execution));
        });
    }

    /**
     * @returns {string} An URL to the static reports of the given execution.
     */
    public static formatStaticReportUrl(execution: WindupExecution): string {
        return Constants.STATIC_REPORTS_BASE + "/" + execution.applicationListRelativePath;
    }
}
