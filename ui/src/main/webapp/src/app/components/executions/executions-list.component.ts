import {Component, ElementRef, Input} from "@angular/core";
import {WindupService} from "../../services/windup.service";
import {WindupExecution} from "windup-services";
import {NotificationService} from "../../services/notification.service";
import {utils} from '../../utils';
import {SortingService, OrderDirection} from "../../services/sorting.service";

@Component({
    selector: 'wu-executions-list',
    templateUrl: './executions-list.component.html',
    providers: [SortingService]
})
export class ExecutionsListComponent {
    protected element;

    private _executions: WindupExecution[];
    private _activeExecutions: WindupExecution[];

    constructor(
        private _elementRef: ElementRef,
        private _windupService: WindupService,
        private _notificationService: NotificationService,
        private _sortingService: SortingService<WindupExecution>
    ) {
        this.element = _elementRef.nativeElement;
        this._sortingService.orderBy('timeStarted', OrderDirection.DESC);
    }

    @Input()
    public set executions(executions: WindupExecution[]) {
        this._executions = this._sortingService.sort(executions || []);
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
}
