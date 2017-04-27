import {Component, OnInit} from "@angular/core";
import {AnalysisContext, WindupExecution} from "windup-services";
import {ActivatedRoute} from "@angular/router";
import {EventBusService} from "../core/events/event-bus.service";
import {WindupExecutionService} from "../services/windup-execution.service";
import {ExecutionsMonitoringComponent} from "./executions-monitoring.component";
import {MigrationProject} from "windup-services";
import {WindupService} from "../services/windup.service";
import {ExecutionEvent} from "../core/events/windup-event";
import {AnalysisContextService} from "../analysis-context/analysis-context.service";
import {NotificationService} from "../core/notification/notification.service";
import {utils} from "../shared/utils";

@Component({
    template: `<wu-executions-list 
            (reloadRequestEvent)="refreshExecutionList()" 
            (runExecution)="startExecution()"
            [executions]="executions" 
            [activeExecutions]="activeExecutions">
    </wu-executions-list>`
})
export class ProjectExecutionsComponent extends ExecutionsMonitoringComponent implements OnInit {
    protected executions: WindupExecution[];
    private doNotRefreshList: boolean;
    private analysisContext: AnalysisContext;

    constructor(
        private _activatedRoute: ActivatedRoute,
        _windupExecutionService: WindupExecutionService,
        private _eventBus: EventBusService,
        private _windupService: WindupService,
        private _analysisContextService: AnalysisContextService,
        private _notificationService: NotificationService
    ) {
        super(_windupExecutionService);
    }

    ngOnInit(): void {
        this._activatedRoute.parent.data.subscribe((data: {project: MigrationProject}) => {
            this.project = data.project;

            this._analysisContextService.get(this.project.defaultAnalysisContextId)
                .subscribe(context => this.analysisContext = context);

            this.refreshExecutionList();
        });

        this.addSubscription(this._eventBus.onEvent
            .filter(event => event.isTypeOf(ExecutionEvent))
            .filter((event: ExecutionEvent) => event.migrationProject.id === this.project.id)
            .subscribe((event: ExecutionEvent) => this.onExecutionEvent(event)));

        this.doNotRefreshList = false;
    }

    refreshExecutionList() {
        this._windupService.getProjectExecutions(this.project.id).subscribe(executions => {
            this.executions = executions;
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
                    this.loadActiveExecutions([execution]);
                },
                error => {
                    this._notificationService.error(utils.getErrorMessage(error));
                });
        }
    }
}
