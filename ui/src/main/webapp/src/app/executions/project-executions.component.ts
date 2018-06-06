import {Component, NgZone, OnDestroy, OnInit} from "@angular/core";
import {AnalysisContext, MigrationProject, WindupExecution} from "../generated/windup-services";
import {RegisteredApplication} from "../generated/windup-services";
import {ActivatedRoute} from "@angular/router";
import {EventBusService} from "../core/events/event-bus.service";
import {WindupExecutionService} from "../services/windup-execution.service";
import {ExecutionsMonitoringComponent} from "./executions-monitoring.component";
import {WindupService} from "../services/windup.service";
import {ExecutionEvent} from "../core/events/windup-event";
import {AnalysisContextService} from "../analysis-context/analysis-context.service";
import {NotificationService} from "../core/notification/notification.service";
import {utils} from "../shared/utils";
import {SchedulerService} from "../shared/scheduler.service";

@Component({
    templateUrl: './project-executions.component.html'
})
export class ProjectExecutionsComponent extends ExecutionsMonitoringComponent implements OnInit, OnDestroy {
    executions: WindupExecution[];
    private doNotRefreshList: boolean;
    private analysisContext: AnalysisContext;

    protected showRunAnalysisButton: boolean;
    protected refreshTimeout: any;

    constructor(
        private _activatedRoute: ActivatedRoute,
        _windupExecutionService: WindupExecutionService,
        private _eventBus: EventBusService,
        private _windupService: WindupService,
        private _analysisContextService: AnalysisContextService,
        private _notificationService: NotificationService,
        private _schedulerService: SchedulerService,
        private _ngZone: NgZone
    ) {
        super(_windupExecutionService);
    }

    ngOnInit(): void {
        this._activatedRoute.parent.data.subscribe((data: {project: MigrationProject}) => {
            this.project = data.project;

            this._analysisContextService.get(this.project.defaultAnalysisContextId)
                .subscribe(context => {
                    this.analysisContext = context;
                    this.analysisContext.applications = context.applications.filter(function( app: RegisteredApplication ) {
                        return !app.deleted ;
                    });
                    this.showRunAnalysisButton = (this.analysisContext.applications.length > 0);
                });

            this.refreshExecutionList();
        });

        this.addSubscription(this._eventBus.onEvent
            .filter(event => event.isTypeOf(ExecutionEvent))
            .filter((event: ExecutionEvent) => event.migrationProject.id === this.project.id)
            .subscribe((event: ExecutionEvent) => this.onExecutionEvent(event)));

        this.doNotRefreshList = false;
    }

    ngOnDestroy(): void {
        super.ngOnDestroy();

        if (this.refreshTimeout) {
            this._schedulerService.clearTimeout(this.refreshTimeout);
            this.refreshTimeout = null;
        }
    }

    refreshExecutionList() {
        this._windupService.getProjectExecutions(this.project.id).subscribe(executions => {
            this.executions = executions;

            // If there are cancelled jobs that have not yet had a cancelled date added, then refresh the list
            if (this.executions.find(execution => execution.state == "CANCELLED" && execution.timeCompleted == null) != null) {
                this.refreshTimeout = this._schedulerService.setTimeout(() => this._ngZone.run(() => this.refreshExecutionList()), 1000);
            }

            this.loadActiveExecutions(this.executions);
        });
    }

    protected onExecutionEvent(event: ExecutionEvent) {
        super.onExecutionEvent(event);

        if (!this.doNotRefreshList || event.execution.state !== 'STARTED') {
            this.refreshExecutionList();

            /**
             * Do not refresh list if we are already observing active execution
             * (it would flood server with requests)
             */
            if (event.execution.state === 'STARTED') {
                this.doNotRefreshList = true;
            }
        }

        /**
         * When execution finished for some reason (success or failure, we don't care), start refreshing list again
         */
        if (event.execution.state !== 'QUEUED' && event.execution.state !== 'STARTED') {
            this.doNotRefreshList = false;
        }
    }

    public startExecution() {
        if (this.analysisContext && this.project) {
            this._windupExecutionService.execute(this.analysisContext, this.project).subscribe(
                execution => {
                    this.refreshExecutionList();
                    console.log('load active executions');
                },
                error => {
                    this._notificationService.error(utils.getErrorMessage(error));
                });
        }
    }
}
