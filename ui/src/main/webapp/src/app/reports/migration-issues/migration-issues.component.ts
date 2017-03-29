import {Component, OnInit} from "@angular/core";
import {Router, ActivatedRoute} from "@angular/router";
import {utils} from '../../shared/utils';

import {NotificationService} from "../../core/notification/notification.service";
import {MigrationIssuesService} from "./migration-issues.service";
import {WINDUP_WEB} from "../../app.module";
import {WindupService} from "../../services/windup.service";
import {WindupExecution} from "windup-services";
import {RouteFlattenerService} from "../../core/routing/route-flattener.service";
import {RoutedComponent} from "../../shared/routed.component";
import {FilterableReportComponent} from "../filterable-report.component";


@Component({
    selector: 'wu-migration-issues',
    templateUrl: './migration-issues.component.html',
    styles: [`
        .panel-primary.wuMigrationIssues { border-color: #e7e7e7; }
        .panel-primary.wuMigrationIssues .panel-heading { background-color: white; padding: 15px 15px; border-bottom: 2px solid #e7e7e7; }
        .panel-primary.wuMigrationIssues .panel-heading .panel-title { color: black; font-size: 20px; font-weight: 500; }
    `]
})
export class MigrationIssuesComponent extends FilterableReportComponent implements OnInit {
    protected categorizedIssues: Dictionary<ProblemSummary[]>;
    protected categories: string[];

    public hideFilter = WINDUP_WEB.config.hideUnfinishedFeatures;
    public execution: WindupExecution;

    public constructor(
        _router: Router,
        _activatedRoute: ActivatedRoute,
        private _migrationIssuesService: MigrationIssuesService,
        private _notificationService: NotificationService,
        private _windupService: WindupService,
        _routeFlattener: RouteFlattenerService
    ) {
        super(_router, _activatedRoute, _routeFlattener);
    }

    ngOnInit(): void {
        this.addSubscription(this.flatRouteLoaded.subscribe(flatRouteData => {
            this.loadFilterFromRouteData(flatRouteData);

            this._migrationIssuesService.getAggregatedIssues(this.execution.id, this.reportFilter).subscribe(
                result => {
                    this.categorizedIssues = result;
                    this.categories = Object.keys(result);
                },
                error => {
                    this._notificationService.error(utils.getErrorMessage(error));
                    this._router.navigate(['']);
                });
        }));
    }
}
