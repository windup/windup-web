import {Component, NgZone, OnDestroy, OnInit} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import {WindupService} from "../services/windup.service";
import {WindupExecution, RegisteredApplication} from "../generated/windup-services";
import {WINDUP_WEB} from "../app.module";

import {WindupExecutionService} from "../services/windup-execution.service";
import {EventBusService} from "../core/events/event-bus.service";
import {ExecutionEvent} from "../core/events/windup-event";
import {Observable} from "rxjs";
import {RuleProviderExecutionsService} from "./rule-provider-executions/rule-provider-executions.service";
import {ExecutionPhaseModel} from "../generated/tsModels/ExecutionPhaseModel";
import {RoutedComponent} from "../shared/routed.component";
import {RouteFlattenerService} from "../core/routing/route-flattener.service";
import {SchedulerService} from "../shared/scheduler.service";

@Component({
    templateUrl: './execution-detail.component.html',
    styleUrls: ['./execution-detail.component.scss']
})
export class ExecutionDetailComponent extends RoutedComponent implements OnInit, OnDestroy {

    execution: WindupExecution;
    logLines: string[];
    phases: ExecutionPhaseModel[];
    private currentTimeTimer: number;
    currentTime: number = new Date().getTime();

    hideUnfinishedFeatures: boolean = WINDUP_WEB.config.hideUnfinishedFeatures;

    constructor(
        _router: Router,
        _activatedRoute: ActivatedRoute,
        _routeFlattener: RouteFlattenerService,
        private _eventBus: EventBusService,
        private _windupService: WindupService,
        private _ruleProviderExecutionsService: RuleProviderExecutionsService,
        private _schedulerService: SchedulerService,
        private _zone: NgZone
    ) {
        super(_router, _activatedRoute, _routeFlattener);
    }

    ngOnInit(): void {
        this.subscriptions.push(this.flatRouteLoaded.subscribe(flatRouteData => {
            let executionId = +flatRouteData.params.executionId;

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
                this._ruleProviderExecutionsService.getPhases(executionId)
                    .subscribe(phases => {
                        this.phases = phases;
                    }, error => {
                        this.phases = [];
                    });
            });
        }));

        this.currentTimeTimer = this._schedulerService.setInterval(this._zone.run(() => {
            this.currentTime = new Date().getTime();
            console.log("Updating the current time field");
        }), 5000);
    }

    ngOnDestroy(): void {
        super.ngOnDestroy();
        if (this.currentTimeTimer != null) {
            this._schedulerService.clearInterval(this.currentTimeTimer);
        }
    }

    get loglines(): Observable<string[]> {
        return this._windupService.getLogData(this.execution.id);
    }

    get displayReportLinks(): boolean {
        return this.execution && this.execution.state === "COMPLETED";
    }

    formatStaticReportUrl(execution: WindupExecution): string {
        return WindupExecutionService.formatStaticReportUrl(execution);
    }

    formatStaticRuleProviderReportUrl(execution: WindupExecution): string {
        return WindupExecutionService.formatStaticRuleProviderReportUrl(execution);
    }

    private loadLogData() {
        this._windupService.getLogData(this.execution.id).subscribe(logLines => this.logLines = logLines);
    }

    getAnalyzedApplications(execution : WindupExecution) : RegisteredApplication[] {
        return execution.analysisContext.applications;
    }
}
