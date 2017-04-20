import {Component, OnInit} from "@angular/core";
import {ActivatedRoute} from "@angular/router";
import {WindupService} from "../services/windup.service";
import {WindupExecution} from "windup-services";
import {WINDUP_WEB} from "../app.module";

import {WindupExecutionService} from "../services/windup-execution.service";
import {EventBusService} from "../core/events/event-bus.service";
import {ExecutionEvent} from "../core/events/windup-event";
import {Observable} from "rxjs";

@Component({
    templateUrl: './execution-detail.component.html',
    styleUrls: ['./execution-detail.component.scss']
})
export class ExecutionDetailComponent implements OnInit {

    execution: WindupExecution;
    logLines:string[];
    includedPkgsShow: boolean = false;
    excludedPkgsShow: boolean = false;

    hideUnfinishedFeatures: boolean = WINDUP_WEB.config.hideUnfinishedFeatures;

    constructor(private _activatedRoute: ActivatedRoute, private _eventBus: EventBusService, private _windupService: WindupService) {
    }

    ngOnInit(): void {
        this._activatedRoute.params.subscribe((params: {executionId: number}) => {
            let executionId = +params.executionId;

            this._eventBus.onEvent
                .filter(event => event.isTypeOf(ExecutionEvent))
                .filter((event: ExecutionEvent) => event.execution.id === executionId)
                .subscribe((event: ExecutionEvent) => {
                    this.execution = event.execution;
                    this.loadLogData();
                });

            this._windupService.getExecution(executionId).subscribe(execution => {
                this.execution = execution;
                this.loadLogData();
            });
        });
    }

    get loglines(): Observable<string[]> {
        return this._windupService.getLogData(this.execution.id);
    }

    get displayReportLinks():boolean {
        return this.execution && this.execution.state === "COMPLETED";
    }

    formatStaticReportUrl(execution: WindupExecution): string {
        return WindupExecutionService.formatStaticReportUrl(execution);
    }

    private loadLogData() {
        this._windupService.getLogData(this.execution.id).subscribe(logLines => this.logLines = logLines);
    }
}
