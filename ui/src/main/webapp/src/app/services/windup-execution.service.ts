import {Injectable} from "@angular/core";
import {ApplicationGroup, WindupExecution} from "windup-services";
import {AbstractService} from "../shared/abtract.service";
import {Observable} from "rxjs/Observable";
import {WindupService} from "./windup.service";
import {EventBusService} from "../core/events/event-bus.service";
import {
    ExecutionEvent, NewExecutionStartedEvent, ExecutionUpdatedEvent,
    ExecutionCompletedEvent
} from "../core/events/windup-event";
import {SchedulerService} from "../shared/scheduler.service";
import {Constants} from "../constants";

@Injectable()
export class WindupExecutionService extends AbstractService {
    static CHECK_EXECUTIONS_INTERVAL = 3 * 1000; // 30 s

    protected activeExecutions: Map<number, WindupExecution> = new Map<number, WindupExecution>();
    protected executionGroups: Map<number, ApplicationGroup> = new Map<number, ApplicationGroup>();

    constructor(private _windupService: WindupService, private _eventBus: EventBusService, private _scheduler: SchedulerService) {
        super();
        this._scheduler.setInterval(() => this.checkExecutions(),  WindupExecutionService.CHECK_EXECUTIONS_INTERVAL);
    }

    public execute(group: ApplicationGroup): Observable<WindupExecution> {
        return this._windupService.executeWindupGroup(group.id)
            .do(execution => {
                this._eventBus.fireEvent(new NewExecutionStartedEvent(execution, group, this));
                this.watchExecutionUpdates(execution, group)
            });
    }

    public watchExecutionUpdates(execution: WindupExecution, group: ApplicationGroup) {
        let previousExecution = this.activeExecutions.get(execution.id);

        if (previousExecution == null && this.keepWatchingExecution(execution)) {
            this.activeExecutions.set(execution.id, execution);

            if (!this.executionGroups.has(execution.id)) {
                this.executionGroups.set(execution.id, group);
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
            this._windupService.getStatusGroup(previousExecution.id).subscribe(
                execution => {
                    let group = this.executionGroups.get(execution.id);

                    if (this.hasExecutionChanged(previousExecution, execution)) {
                        this._eventBus.fireEvent(new ExecutionUpdatedEvent(execution, group, this));
                        this.activeExecutions.set(execution.id, execution);
                    }

                    if (execution.state === "COMPLETED") {
                        this._eventBus.fireEvent(new ExecutionCompletedEvent(execution, group, this));
                    }

                    if (!this.keepWatchingExecution(execution)) {
                        this.activeExecutions.delete(execution.id);
                        this.executionGroups.delete(execution.id);
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
