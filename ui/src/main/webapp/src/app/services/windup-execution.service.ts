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
import {Constants} from "../constants";
import {Subject} from "rxjs";
import {WebSocketSubjectFactory} from "../shared/websocket.factory";
import {KeycloakService} from "../core/authentication/keycloak.service";

@Injectable()
export class WindupExecutionService extends AbstractService {
    static EXECUTION_PROGRESS_URL = Constants.REST_BASE + "/websocket/execution-progress/{executionId}";

    protected executionSocket: Map<number, Subject<WindupExecution>> = new Map<number, Subject<WindupExecution>>();
    protected activeExecutions: Map<number, WindupExecution> = new Map<number, WindupExecution>();
    protected executionProjects: Map<number, MigrationProject> = new Map<number, MigrationProject>();

    constructor(
        private _windupService: WindupService,
        private _eventBus: EventBusService,
        private _websocketFactory: WebSocketSubjectFactory<WindupExecution>,
        private _keycloakService: KeycloakService
    ) {
        super();
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
            .replace(/^http/, 'ws')
            .replace('{executionId}', execution.id.toString());

        if (!this.executionSocket.has(execution.id)) {
            const socket = this._websocketFactory.createWebSocketSubject(url);
            socket.subscribe((execution: WindupExecution) => this.onExecutionUpdate(execution));

            this.executionSocket.set(execution.id, socket);

            this._keycloakService.getToken().subscribe(token => {
                socket.next(JSON.stringify({
                    authentication: {
                        token: token
                    }
                }) as any);
            });
        }

        const previousExecution = this.activeExecutions.get(execution.id);

        if (previousExecution == null && this.keepWatchingExecution(execution)) {
            this.activeExecutions.set(execution.id, execution);

            if (!this.executionProjects.has(execution.id)) {
                this.executionProjects.set(execution.id, project);
            }
        }
    }

    protected hasExecutionChanged(oldExecution: WindupExecution, newExecution: WindupExecution) {
        return oldExecution.id === newExecution.id && (
            oldExecution.lastModified !== newExecution.lastModified || oldExecution.workCompleted !== newExecution.workCompleted
        );
    }

    protected keepWatchingExecution(execution: WindupExecution) {
        return execution.state === "STARTED" || execution.state === "QUEUED";
    }

    onExecutionUpdate(execution: WindupExecution) {
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
            if (this.executionSocket.has(execution.id)) {
                const socket = this.executionSocket.get(execution.id);
                socket.unsubscribe();
            }

            this.activeExecutions.delete(execution.id);
            this.executionProjects.delete(execution.id);
            this.executionSocket.delete(execution.id);
        }
    }

    /**
     * @returns {string} An URL to the static reports of the given execution.
     */
    public static formatStaticReportUrl(execution: WindupExecution): string {
        return Constants.STATIC_REPORTS_BASE + "/" + execution.applicationListRelativePath;
    }

    /**
     * @returns {string} An URL to the static rule provider report of the given execution.
     */
    public static formatStaticRuleProviderReportUrl(execution: WindupExecution): string {
        return Constants.STATIC_REPORTS_BASE + "/" + execution.ruleProvidersExecutionOverviewRelativePath;
    }
}
