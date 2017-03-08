import {Injectable} from "@angular/core";
import {WindupExecution} from "windup-services";
import {AbstractService} from "../shared/abtract.service";
import {Observable} from "rxjs/Observable";
import {WindupService} from "./windup.service";
import {EventBusService} from "../core/events/event-bus.service";
import {
    ExecutionUpdatedEvent,
    ExecutionCompletedEvent, NewExecutionStartedEvent
} from "../core/events/windup-event";
import {SchedulerService} from "../shared/scheduler.service";
import {AnalysisContext} from "windup-services";
import {MigrationProject} from "windup-services";
import {Constants} from "../constants";

@Injectable()
export class WindupExecutionService extends AbstractService {
    static CHECK_EXECUTIONS_INTERVAL = 3 * 1000; // 30 s

    protected activeExecutions: Map<number, WindupExecution> = new Map<number, WindupExecution>();
    protected executionProjects: Map<number, MigrationProject> = new Map<number, MigrationProject>();

    constructor(private _windupService: WindupService, private _eventBus: EventBusService, private _scheduler: SchedulerService) {
        super();
        this._scheduler.setInterval(() => this.checkExecutions(),  WindupExecutionService.CHECK_EXECUTIONS_INTERVAL);
    }

    public execute(analysisContext: AnalysisContext, project: MigrationProject): Observable<WindupExecution> {
        return this._windupService.executeWindupWithAnalysisContext(analysisContext.id)
            .do(execution => {
                this._eventBus.fireEvent(new NewExecutionStartedEvent(execution, project, this));
                this.watchExecutionUpdates(execution, project)
            });
    }

    public watchExecutionUpdates(execution: WindupExecution, project: MigrationProject) {
        let previousExecution = this.activeExecutions.get(execution.id);

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

    // TODO: It would be great to switch from pull model to push notifications
    protected checkExecutions() {
        this.activeExecutions.forEach((previousExecution: WindupExecution) => {
            this._windupService.getExecution(previousExecution.id).subscribe(
                execution => {
                    let project = this.executionProjects.get(execution.id);

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
            );
        });
    }

    /**
     * @returns {string} An URL to the static reports of the given execution.
     */
    public static formatStaticReportUrl(execution: WindupExecution): string {
        return Constants.STATIC_REPORTS_BASE + "/" + execution.applicationListRelativePath;
    }
}
