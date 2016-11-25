import {Component, OnInit, Input} from "@angular/core";
import {WindupService} from "../../services/windup.service";
import {WindupExecution} from "windup-services";
import {NotificationService} from "../../services/notification.service";
import {utils} from '../../utils';

@Component({
    template: '<wu-executions-list [executions]="executions"></wu-executions-list>'
})
export class AllExecutionsComponent implements OnInit {
    protected executions: WindupExecution[];

    constructor(
        private _windupService: WindupService,
        private _notificationService: NotificationService
    ) {
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
}
