import {ChangeDetectionStrategy, Component, Input, NgZone, OnInit} from "@angular/core";
import {Router, ActivatedRoute} from "@angular/router";
import * as Prism from "../source/prism";

import {MigrationIssuesService} from "./migration-issues.service";
import {NotificationService} from "../../core/notification/notification.service";
import {SortingService, OrderDirection} from "../../shared/sort/sorting.service";
import {RouteFlattenerService} from "../../core/routing/route-flattener.service";
import {FilterableReportComponent} from "../filterable-report.component";
import {SchedulerService} from "../../shared/scheduler.service";

@Component({
    selector: 'wu-migration-issues-table',
    templateUrl: './migration-issues-table.component.html',
    styleUrls: ['./migration-issues-table.component.scss'],
    providers: [SortingService],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class MigrationIssuesTableComponent extends FilterableReportComponent implements OnInit
{
    _migrationIssues: ProblemSummary[] = [];

    sortedIssues: ProblemSummary[] = [];

    problemSummariesFiles = new Map<ProblemSummary, ProblemSummaryFiles>();

    orderDirection: OrderDirection = OrderDirection.ASC;
    orderBy: any;

    public constructor(
        _router: Router,
        _routeFlattener: RouteFlattenerService,
        _activatedRoute: ActivatedRoute,
        private _migrationIssuesService: MigrationIssuesService,
        private _notificationService: NotificationService,
        private _sortingService: SortingService<ProblemSummary>,
        private _schedulerService: SchedulerService
    ) {
        super(_router, _activatedRoute, _routeFlattener);

        this.sortedIssues = this.migrationIssues;

        let flatRouteData = this._routeFlattener.getFlattenedRouteData(this._activatedRoute.snapshot);
        this.loadFilterFromRouteData(flatRouteData);

        this.addSubscription(this._routeFlattener.OnFlatRouteLoaded.subscribe(
            flatRouteData => this.loadFilterFromRouteData(flatRouteData)
        ));
    }

    @Input()
    public set migrationIssues(issues: ProblemSummary[]) {
        this._migrationIssues = issues || [];
        this.sortedIssues = this._sortingService.sort(this._migrationIssues);
    }

    public get migrationIssues() {
        return this._migrationIssues;
    }

    ngOnInit(): void {
        
    }

    public getSum(field: string|Function): number {
        return this.migrationIssues.map(issue => {
            if (typeof field === 'function') {
                return field(issue);
            } else if (typeof issue[field] === 'function') {
                return issue[field]();
            } else {
                return issue[field];
            }
        }).reduce((a, b) => a + b, 0);
    }

    public getIssuesStoryPoints(): number {
        return this.getSum((issue: ProblemSummary) => issue.numberFound * issue.effortPerIncident);
    }

    private delayedPrismRender() {
        // Colorize the included code snippets on the first displaying.
        this._schedulerService.setTimeout(() => Prism.highlightAll(false), 1000);
    }

    toggleFiles(summary: ProblemSummary) {
        if (this.problemSummariesFiles.has(summary)) {
            const fileSummaries = this.problemSummariesFiles.get(summary);
            fileSummaries.visible = !fileSummaries.visible;
            //this.delayedPrismRender();
        } else {
            this.loadIssuesPerFile(summary);
        }
    }

    protected loadIssuesPerFile(summary: ProblemSummary) {
        this._migrationIssuesService.getIssuesPerFile(this.execution.id, summary, this.reportFilter).subscribe(fileSummaries => {
            this.problemSummariesFiles.set(summary, {
                files: fileSummaries,
                visible: true
            });
        },
        error => {
            this._notificationService.error('Could not load file summaries due to: ' + error);
        });
    }

    filesVisible(summary: ProblemSummary): boolean {
        return this.problemSummariesFiles.has(summary) && this.problemSummariesFiles.get(summary).visible;
    }

    getProblemSummaryFiles(issue: ProblemSummary) {
        if (!this.problemSummariesFiles.has(issue)) {
            throw new Error('No file issues for given problem summary');
        }

        return this.problemSummariesFiles.get(issue).files;
    }

    getTotalStoryPoints(summary: ProblemSummary) {
        return (summary.effortPerIncident * summary.numberFound);
    }

    sortBy(property: string|any) {
        if (property === this.orderBy) {
            this.orderDirection = (this.orderDirection === OrderDirection.ASC) ? OrderDirection.DESC : OrderDirection.ASC;
            this._sortingService.setOrderDirection(this.orderDirection);
        } else {
            this._sortingService.orderBy(property);
            this.orderBy = property;
        }

        this.sortedIssues = this._sortingService.sort(this.migrationIssues);
    }
}

interface ProblemSummaryFiles {
    files: any[];
    visible: boolean;
}
