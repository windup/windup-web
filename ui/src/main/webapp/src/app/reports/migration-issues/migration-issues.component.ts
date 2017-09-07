import {Component, OnInit} from "@angular/core";
import {Router, ActivatedRoute} from "@angular/router";
import {utils} from '../../shared/utils';

import {NotificationService} from "../../core/notification/notification.service";
import {MigrationIssuesService} from "./migration-issues.service";
import {WINDUP_WEB} from "../../app.module";
import {WindupService} from "../../services/windup.service";
import {WindupExecution} from "../../generated/windup-services";
import {RouteFlattenerService} from "../../core/routing/route-flattener.service";
import {FilterableReportComponent} from "../filterable-report.component";
import {EffortLevelPipe} from "../effort-level.enum";


@Component({
    selector: 'wu-migration-issues',
    templateUrl: './migration-issues.component.html',
    styleUrls: ['../../../../css/report-tables.scss']
})
export class MigrationIssuesComponent extends FilterableReportComponent implements OnInit {
    protected categorizedIssues: Dictionary<ProblemSummary[]>;
    filteredIssues: Dictionary<ProblemSummary[]>;
    categories: string[];

    public hideFilter = WINDUP_WEB.config.hideUnfinishedFeatures;
    public execution: WindupExecution;

    searchValue: string;

    public constructor(
        _router: Router,
        _activatedRoute: ActivatedRoute,
        private _migrationIssuesService: MigrationIssuesService,
        private _notificationService: NotificationService,
        private _windupService: WindupService,
        _routeFlattener: RouteFlattenerService,
        private _effortLevelPipe: EffortLevelPipe
    ) {
        super(_router, _activatedRoute, _routeFlattener);
    }

    ngOnInit(): void {
        this.flatRouteLoaded.takeUntil(this.destroy).subscribe(flatRouteData => {
            this.loadFilterFromRouteData(flatRouteData);

            this._migrationIssuesService.getAggregatedIssues(this.execution.id, this.reportFilter).takeUntil(this.destroy).subscribe(
                result => {
                    this.categorizedIssues = result;
                    this.categories = Object.keys(result);
                    this.filteredIssues = Object.assign({}, result);
                    this.reloadData();
                },
                error => {
                    this._notificationService.error(utils.getErrorMessage(error));
                    this._router.navigate(['']);
                });
        });
    }

    reloadData() {
        if (!this.searchValue || this.searchValue.length === 0) {
            this.filteredIssues = Object.assign({}, this.categorizedIssues);
            return;
        }

        const regex = new RegExp(this.searchValue, 'i');

        this.categories.forEach(category => {
            this.filteredIssues[category] = this.categorizedIssues[category].filter(issue => {
                return issue.issueName.search(regex) !== -1
                    || this._effortLevelPipe.transform(issue.effortPerIncident).search(regex) !== -1;
            });
        });
    }

    clearFilter() {
        this.searchValue = '';
        this.reloadData();
    }
}
