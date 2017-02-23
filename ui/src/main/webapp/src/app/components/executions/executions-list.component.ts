import {Component, ElementRef, Input, OnInit} from "@angular/core";
import {WindupService} from "../../services/windup.service";
import {WindupExecution} from "windup-services";
import {NotificationService} from "../../services/notification.service";
import {utils} from '../../utils';
import {SortingService, OrderDirection} from "../../services/sorting.service";
import {MigrationProjectService} from "../../services/migration-project.service";
import {MigrationProject} from "windup-services";

@Component({
    selector: 'wu-executions-list',
    templateUrl: './executions-list.component.html',
    providers: [SortingService],
    styleUrls: ['../../../../css/tables.scss']
})
export class ExecutionsListComponent implements OnInit {
    protected element;

    private _executions: WindupExecution[];
    private _activeExecutions: WindupExecution[];
    protected projectsMap: Map<number, MigrationProject> = new Map<number, MigrationProject>();

    public sortedExecutions: WindupExecution[] = [];

    constructor(
        private _elementRef: ElementRef,
        private _windupService: WindupService,
        private _notificationService: NotificationService,
        private _sortingService: SortingService<WindupExecution>,
        private _projectService: MigrationProjectService
    ) {
        this.element = _elementRef.nativeElement;
        this._sortingService.orderBy('timeStarted', OrderDirection.DESC);
    }

    ngOnInit(): void {
        this._projectService.getAll().subscribe(projects => {
            this.projectsMap.clear();
            projects.forEach(project => this.projectsMap.set(project.id, project));
        });
    }

    @Input()
    public set executions(executions: WindupExecution[]) {
        this._executions = this._sortingService.sort(executions || []);
        this.sortedExecutions = this._executions;
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
        return execution.state === 'QUEUED'; // || execution.state === 'STARTED';
    }

    cancelExecution(execution: WindupExecution) {
        this._windupService.cancelExecution(execution).subscribe(
            success => this._notificationService.success('Execution was successfully cancelled.'),
            error => this._notificationService.error(utils.getErrorMessage(error))
        );
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
}
