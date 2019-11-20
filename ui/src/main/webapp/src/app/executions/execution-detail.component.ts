import {Component, NgZone, OnDestroy, OnInit} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import {WindupService} from "../services/windup.service";
import {WindupExecution, RegisteredApplication, RulesPath, Package} from "../generated/windup-services";
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
import { filter } from 'rxjs/operators';

export function sortPackages(packages: Package[]): Package[] {
    return packages.sort((a: Package, b: Package) => {
        return a.fullName.localeCompare(b.fullName);
    });
}

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

        this.subscriptions.push(this.flatRouteLoaded.subscribe(flatRouteData => {
            let executionId = +flatRouteData.params.executionId;

            this._eventBus.onEvent
                .pipe(
                    filter(event => event.isTypeOf(ExecutionEvent)),
                    filter((event: ExecutionEvent) => event.execution.id === executionId)
                )                
                .subscribe((event: ExecutionEvent) => {
                    event.execution.analysisContext.rulesPaths = this.getSortedRulesPaths(event.execution.analysisContext.rulesPaths);
                    this.execution = event.execution;
                    this.loadLogData();
                });

            this._windupService.getExecution(executionId).subscribe(execution => {
                execution.analysisContext.rulesPaths = this.getSortedRulesPaths(execution.analysisContext.rulesPaths);
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
    }

    ngOnInit(): void {
        this.currentTimeTimer = this._schedulerService.setInterval(() => {
            this._zone.run(() => {
                this.currentTime = new Date().getTime();
                console.log("Updating the current time field");
            })
        }, 5000);
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

    formatStaticCsvReportUrl(execution: WindupExecution): string {        
        return WindupExecutionService.formatStaticCsvReportUrl(execution);
    }    

    containsAdvancedOption(execution: WindupExecution, optionName: string, optionValue: any): boolean {
        return WindupExecutionService.containsAdvancedOption(execution, optionName, optionValue);
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

    shouldTransformationPathBeShown(): boolean {
        if (this.execution) {
            if (this.execution.analysisContext.migrationPath ||
                this.execution.analysisContext.cloudTargetsIncluded ||
                this.execution.analysisContext.linuxTargetsIncluded ||
                this.execution.analysisContext.openJdkTargetsIncluded) {
                return true;
            }
        }
        return false;
    }

    getSortedRulesPaths(rulesPath: RulesPath[]): RulesPath[] {
        return rulesPath.sort((a: RulesPath, b: RulesPath) => {
            const aPathType = a.rulesPathType == 'SYSTEM_PROVIDED' ? 20 : 0;
            const aScopeType = a.scopeType == 'GLOBAL' ? 10 : 0;
            const aRegistrationType = a.registrationType == 'PATH' ? 5 : 0;

            const bPathType = b.rulesPathType == 'SYSTEM_PROVIDED' ? 20 : 0;
            const bScopeType = b.scopeType == 'GLOBAL' ? 10 : 0;
            const bRegistrationType = b.registrationType == 'PATH' ? 5 : 0;

            const result = (aPathType + aScopeType + aRegistrationType) - (bPathType + bScopeType + bRegistrationType);
            if (result == 0) {
                return a.path.localeCompare(b.path);
            }

            return result;
        });
    }

    getSortedPackages(packages: Package[]) {
        return sortPackages(packages);
    }

    idTrackFn(index: number, item: any): number {
        return item.id;
    }
}
