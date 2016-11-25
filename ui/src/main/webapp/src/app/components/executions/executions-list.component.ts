import {Component, OnInit, ElementRef} from "@angular/core";
import {WindupService} from "../../services/windup.service";
import {WindupExecution} from "windup-services";
import {NotificationService} from "../../services/notification.service";
import {utils} from '../../utils';

@Component({
    selector: 'wu-executions-list',
    templateUrl: './executions-list.component.html'
})
export class ExecutionsListComponent implements OnInit {
    protected executions: WindupExecution[];
    protected element;

    constructor(
        private _elementRef: ElementRef,
        private _windupService: WindupService,
        private _notificationService: NotificationService
    ) {
        this.element = _elementRef.nativeElement;
    }

    ngOnInit(): void {
        this._windupService.getAllExecutions().subscribe(
            executions => {
                this.executions = executions;
            },
            error => {
                this._notificationService.error(utils.getErrorMessage(error))
            }
        );
    }

    canCancel(execution: WindupExecution): boolean {
        return execution.state === 'QUEUED' || execution.state === 'STARTED';
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
