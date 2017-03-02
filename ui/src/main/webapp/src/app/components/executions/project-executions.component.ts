import {Component, OnInit} from "@angular/core";
import {WindupExecution, ApplicationGroup} from "windup-services";
import {ActivatedRoute} from "@angular/router";
import {EventBusService} from "../../services/events/event-bus.service";
import {WindupExecutionService} from "../../services/windup-execution.service";
import {ExecutionsMonitoringComponent} from "./executions-monitoring.component";
import {MigrationProject} from "windup-services";
import {WindupService} from "../../services/windup.service";

@Component({
    template: '<wu-executions-list [executions]="executions" [activeExecutions]="activeExecutions"></wu-executions-list>'
})
export class ProjectExecutionsComponent extends ExecutionsMonitoringComponent implements OnInit {
    protected project: MigrationProject;
    protected group: ApplicationGroup;
    protected executions: WindupExecution[];

    constructor(
        private _activatedRoute: ActivatedRoute,
        _windupExecutionService: WindupExecutionService,
        private _eventBus: EventBusService,
        private _windupService: WindupService
    ) {
        super(_windupExecutionService);
    }

    ngOnInit(): void {
        this._activatedRoute.parent.data.subscribe((data: {project: MigrationProject}) => {
            this.project = data.project;
            this._windupService.getProjectExecutions(this.project.id).subscribe(executions => {
                this.executions = executions;
                this.loadActiveExecutions(this.executions);
            });
        });
    }
}
