import {Component, ElementRef, EventEmitter, Input, NgZone, OnDestroy, OnInit, Output, ViewChild} from "@angular/core";
import {WindupService} from "../services/windup.service";
import {MigrationProject, WindupExecution} from "../generated/windup-services";
import {NotificationService} from "../core/notification/notification.service";
import {utils} from '../shared/utils';
import {SortingService, OrderDirection} from "../shared/sort/sorting.service";
import {MigrationProjectService} from "../project/migration-project.service";
import {WindupExecutionService} from "../services/windup-execution.service";
import {ConfirmationModalComponent} from "../shared/dialog/confirmation-modal.component";
import {AbstractComponent} from "../shared/AbstractComponent";
import {SchedulerService} from "../shared/scheduler.service";

@Component({
    selector: 'wu-executions-list',
    templateUrl: './executions-list.component.html',
    providers: [SortingService],
    styleUrls: ['../../../css/tables.scss', 'executions-list.component.scss']
})
export class ExecutionsListComponent extends AbstractComponent implements OnInit {
    @Output()
    reloadRequestEvent: EventEmitter<any> = new EventEmitter();

    @Output()
    runExecution: EventEmitter<void> = new EventEmitter<void>();

    @Input()
    showRunAnalysisButton: boolean;

    protected element;

    private _executions: WindupExecution[];
    private _activeExecutions: WindupExecution[];
    protected projectsMap: Map<number, MigrationProject> = new Map<number, MigrationProject>();

    sortedExecutions: WindupExecution[] = [];

    sortByStartDateCallback = (item: WindupExecution) => {
        if (!item.timeStarted)
            return Number.MAX_SAFE_INTEGER;
        else
            return item.timeStarted;
    };

    sortByNumberAnalyzedApplicationsCallback = (item: WindupExecution) => {
        return this.getNumberAnalyzedApplications(item);
    };

    initialSort = {property: this.sortByStartDateCallback, direction: OrderDirection.DESC};
    private currentTimeTimer: number;
    currentTime: number = new Date().getTime();

    @ViewChild('deleteExecutionDialog')
    readonly deleteExecutionDialog: ConfirmationModalComponent;

    @ViewChild('cancelExecutionDialog')
    readonly cancelExecutionDialog: ConfirmationModalComponent;

    searchText: string = '';

    filteredExecutions: WindupExecution[];

    private deletedExecutions: Map<number, WindupExecution> = new Map<number, WindupExecution>();

    constructor(
        private _elementRef: ElementRef,
        private _windupService: WindupService,
        private _notificationService: NotificationService,
        private _sortingService: SortingService<WindupExecution>,
        private _projectService: MigrationProjectService,
        private _schedulerService: SchedulerService,
        private _zone: NgZone
    ) {
        super();
        this.element = _elementRef.nativeElement;
    }

    ngOnInit(): void {
        this._projectService.getAll().subscribe(projects => {
            this.projectsMap.clear();
            projects.forEach(project => this.projectsMap.set(project.id, project));
        });
        this.cancelExecutionDialog.confirmed.subscribe((execution) => {
            this.doCancelExecution(execution);
        });

        this.deleteExecutionDialog.confirmed.subscribe((execution) => {
            this.doDeleteExecution(execution);
        });

        this.currentTimeTimer =  this._schedulerService.setInterval(() => {
            this._zone.run(() => {
                this.currentTime = new Date().getTime();
            });
        }, 5000);
    }

    ngOnDestroy(): void {
        if (this.currentTimeTimer) {
            this._schedulerService.clearInterval(this.currentTimeTimer);
        }
    }

    @Input()
    public set executions(executions: WindupExecution[]) {
        this._executions = this._sortingService.sort(executions || []);
        this.sortedExecutions = this._executions;
        this.filteredExecutions = this._executions;
    }

    public get executions(): WindupExecution[] {
        return this._executions;
    }

    @Input()
    public set activeExecutions(activeExecutions: WindupExecution[]) {
        this._activeExecutions = this._sortingService.sort(activeExecutions || []);
    }

    public get activeExecutions(): WindupExecution[] {
        return this._activeExecutions;
    }

    public getProject(id: number): MigrationProject {
        return this.projectsMap.get(id);
    }

    canCancel(execution: WindupExecution): boolean {
        return execution.state === 'QUEUED' || execution.state === 'STARTED';
    }

    cancelExecution(execution: WindupExecution) {
        this.cancelExecutionDialog.data = execution;
        this.cancelExecutionDialog.title = 'Confirm Analysis Cancellation';
        this.cancelExecutionDialog.body = `Are you sure you want to cancel analysis #${execution.id}?`;

        this.cancelExecutionDialog.show();
    }

    doCancelExecution(execution: WindupExecution) {
        this._windupService.cancelExecution(execution).subscribe(
            success => {
                this._notificationService.success(`Analysis #${execution.id} was cancelled.`);
                this.reloadRequestEvent.emit(true);
            },
            error => this._notificationService.error(utils.getErrorMessage(error))
        );
    }

    confirmDeleteExecution(execution: WindupExecution) {
        this.deleteExecutionDialog.data = execution;
        this.deleteExecutionDialog.title = 'Confirm Analysis Deletion';
        this.deleteExecutionDialog.body = `Are you sure you want to delete analysis #${execution.id}?`;

        this.deleteExecutionDialog.show();
    }

    doDeleteExecution(execution: WindupExecution) {
        this.deletedExecutions.set(execution.id, execution);
        this._windupService.deleteExecution(execution).finally(() => {
            this.deletedExecutions.delete(execution.id);
        }).subscribe(
            success => {
                this._notificationService.success(`Analysis #${execution.id} was deleted.`);
                this.reloadRequestEvent.emit(true);
            },
            error => this._notificationService.error(utils.getErrorMessage(error))
        );

        return false;
    }

    getClass(execution: WindupExecution): string {
        switch (execution.state) {
            default:
            case "QUEUED":
            case "STARTED":
                return 'info';
            case "COMPLETED":
                return 'success';
            case "FAILED":
                return 'danger';
            case "CANCELLED":
                return 'warning';
        }
    }

    sortByProjectCallback = (item: WindupExecution) => {
        let project = this.getProject(item.projectId);

        return project ? project.title : 0;
    };

    sortByDurationCallback = (item: WindupExecution) => {
        return <any>item.timeCompleted - <any>item.timeStarted;
    };

    formatStaticReportUrl(execution: WindupExecution): string {
        return WindupExecutionService.formatStaticReportUrl(execution);
    }

    clearSearch() {
        this.searchText = '';
        this.updateSearch();
    }

    updateSearch() {
        if (this.searchText && this.searchText.length > 0) {
            this.filteredExecutions = this._executions.filter(execution => (
                execution.id.toString().search(new RegExp(this.searchText, 'i')) !== -1 ||
                execution.state.search(new RegExp(this.searchText, 'i')) !== -1
            ));
        } else {
            this.filteredExecutions = this._executions;
        }
    }

    startExecution() {
        this.runExecution.emit();
    }

    getNumberAnalyzedApplications(execution : WindupExecution) : number {
        return execution.analysisContext.applications.length;
    }

    public isDeleting(execution: WindupExecution) {
        return this.deletedExecutions.has(execution.id);
    }
}
