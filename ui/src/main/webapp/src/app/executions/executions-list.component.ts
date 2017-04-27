import {Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild} from "@angular/core";
import {WindupService} from "../services/windup.service";
import {WindupExecution, AnalysisContext} from "windup-services";
import {NotificationService} from "../core/notification/notification.service";
import {utils} from '../shared/utils';
import {SortingService, OrderDirection} from "../shared/sort/sorting.service";
import {MigrationProjectService} from "../project/migration-project.service";
import {MigrationProject} from "windup-services";
import {WindupExecutionService} from "../services/windup-execution.service";
import {ConfirmationModalComponent} from "../shared/dialog/confirmation-modal.component";
import {AnalysisContextService} from "../analysis-context/analysis-context.service";
import {Subscription} from "rxjs";
import {ActivatedRoute, Router, NavigationEnd} from "@angular/router";
import {RouteFlattenerService} from "../core/routing/route-flattener.service";
import {AnalysisContextFormComponent} from "../analysis-context/analysis-context-form.component";

@Component({
    selector: 'wu-executions-list',
    templateUrl: './executions-list.component.html',
    providers: [SortingService],
    styleUrls: ['../../../css/tables.scss', 'executions-list.component.scss']
})
export class ExecutionsListComponent implements OnInit, OnDestroy {
    @Output()
    reloadRequestEvent:EventEmitter<any> = new EventEmitter();

    protected element;

    private _executions: WindupExecution[];
    private _activeExecutions: WindupExecution[];
    protected projectsMap: Map<number, MigrationProject> = new Map<number, MigrationProject>();

    sortedExecutions: WindupExecution[] = [];
    initialSort = {property: 'timeStarted', direction: OrderDirection.DESC};
    private currentTimeTimer:number;
    currentTime:number = new Date().getTime();

    @ViewChild('deleteExecutionDialog')
    readonly deleteExecutionDialog: ConfirmationModalComponent;

    @ViewChild('cancelExecutionDialog')
    readonly cancelExecutionDialog: ConfirmationModalComponent;

    searchText: string = '';

    private filteredExecutions: WindupExecution[];

    analysisContext: AnalysisContext;
    private routerSubscription: Subscription;
    project: MigrationProject;

    constructor(
        private _elementRef: ElementRef,
        private _windupService: WindupService,
        private _notificationService: NotificationService,
        private _sortingService: SortingService<WindupExecution>,
        private _projectService: MigrationProjectService,
        private _windupExecutionService: WindupExecutionService,
        private _analysisContextService: AnalysisContextService,
        private _migrationProjectService: MigrationProjectService,
        private _router: Router,
        private _routeFlattener: RouteFlattenerService,
        private _activatedRoute: ActivatedRoute
    ) {
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

        this.currentTimeTimer = <any> setInterval(() => {
            this.currentTime = new Date().getTime();
        }, 5000);


        this.routerSubscription = this._router.events.filter(event => event instanceof NavigationEnd).subscribe(_ => {
            let flatRouteData = this._routeFlattener.getFlattenedRouteData(this._activatedRoute.snapshot);
            if (flatRouteData.data['project']) {
                let project = flatRouteData.data['project'];

                this._analysisContextService.get(project.defaultAnalysisContextId)
                    .subscribe(context => {
                        this.analysisContext = context;
                        if (this.analysisContext.migrationPath == null)
                            this.analysisContext.migrationPath = AnalysisContextFormComponent.DEFAULT_MIGRATION_PATH;
                    });

                // Reload the App from the service to ensure fresh data
                this._migrationProjectService.get(project.id).subscribe(loadedProject => {
                    this.project = loadedProject;
                });
            }
        });


    }

    ngOnDestroy(): void {
        if (this.currentTimeTimer)
            clearInterval(this.currentTimeTimer);
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
        this.cancelExecutionDialog.title = 'Confirm cancel analysis';
        this.cancelExecutionDialog.body = `Do you really want to cancel the analysis #${execution.id}?`;

        this.cancelExecutionDialog.show();
    }

    doCancelExecution(execution: WindupExecution) {
        this._windupService.cancelExecution(execution).subscribe(
            success => {
                this._notificationService.success(`The analysis #${execution.id} was cancelled.`);
                this.reloadRequestEvent.emit(true);
            },
            error => this._notificationService.error(utils.getErrorMessage(error))
        );
    }

    confirmDeleteExecution(execution: WindupExecution) {
        this.deleteExecutionDialog.data = execution;
        this.deleteExecutionDialog.title = 'Confirm analysis deletion';
        this.deleteExecutionDialog.body = `Do you really want to delete the analysis #${execution.id}?`;

        this.deleteExecutionDialog.show();
    }

    doDeleteExecution(execution:WindupExecution) {
        this._windupService.deleteExecution(execution).subscribe(
            success => {
                this._notificationService.success(`The analysis #${execution.id} was deleted.`);
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

    runExecution() {
        this._windupExecutionService.execute(this.analysisContext, this.project)
            .subscribe(() => {},
                error => {
                    this._notificationService.error(utils.getErrorMessage(error));
                }
            );
    }
}
