import {Component, OnInit} from "@angular/core";
import {Router, ActivatedRoute} from "@angular/router";
import {utils} from '../../shared/utils';

import {NotificationService} from "../../core/notification/notification.service";
import {MigrationIssuesService} from "./migration-issues.service";
import {WINDUP_WEB} from "../../app.module";
import {WindupService} from "../../services/windup.service";
import {MigrationProject, ReportFilter, WindupExecution} from "windup-services";
import {RouteFlattenerService} from "../../core/routing/route-flattener.service";
import {RoutedComponent} from "../../shared/routed.component";
import {Observable} from "rxjs";


@Component({
    selector: 'wu-migration-issues',
    templateUrl: './migration-issues.component.html',
    styles: [`
        .panel-primary.wuMigrationIssues { border-color: #e7e7e7; }
        .panel-primary.wuMigrationIssues .panel-heading { background-color: white; padding: 15px 15px; border-bottom: 2px solid #e7e7e7; }
        .panel-primary.wuMigrationIssues .panel-heading .panel-title { color: black; font-size: 20px; font-weight: 500; }
    `]
})
export class MigrationIssuesComponent extends RoutedComponent implements OnInit {
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
            let executionId = parseInt(flatRouteData.params['executionId']);
            this._windupService.getExecution(executionId).subscribe(execution => {
                this.execution = execution;


                let dataSource: Observable<any>;

                if (flatRouteData.data.oldMode) {
                    dataSource = this._migrationIssuesService.getAggregatedIssues(executionId);
                } else {
                    let reportFilter = null;

                    if (flatRouteData.data.level === 'application') {
                        let selectedApplications = this.execution.filterApplications.filter(app => app.id === +flatRouteData.params.applicationId);

                        reportFilter = {
                            id: 0,
                            selectedApplications: selectedApplications,
                            includeTags: [],
                            excludeTags: [],
                            includeCategories: [],
                            excludeCategories: [],
                            enabled: true
                        };
                    }

                    dataSource = this._migrationIssuesService.getNewAggregatedIssues(executionId, reportFilter);
                }

                dataSource.subscribe(
                    result => {
                        this.categorizedIssues = result;
                        this.categories = Object.keys(result).sort();
                    },
                    error => {
                        this._notificationService.error(utils.getErrorMessage(error));
                        this._router.navigate(['']);
                    });
            });
        }));
    }
}
