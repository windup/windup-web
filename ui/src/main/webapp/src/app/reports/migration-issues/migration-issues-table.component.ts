import {Component, Input, OnInit} from "@angular/core";
import {Router, ActivatedRoute} from "@angular/router";
import "../source/prism";

import {MigrationIssuesService} from "./migration-issues.service";
import {NotificationService} from "../../core/notification/notification.service";
import {SortingService, OrderDirection} from "../../shared/sort/sorting.service";
import {RouteFlattenerService} from "../../core/routing/route-flattener.service";
import {FilterableReportComponent} from "../filterable-report.component";

@Component({
    selector: 'wu-migration-issues-table',
    templateUrl: './migration-issues-table.component.html',
    styleUrls: ['./migration-issues-table.component.scss'],
    providers: [SortingService]
})
export class MigrationIssuesTableComponent extends FilterableReportComponent implements OnInit
{
    @Input()
    migrationIssues: ProblemSummary[] = [];

    sortedIssues: ProblemSummary[] = [];

    problemSummariesFiles = new Map<ProblemSummary, ProblemSummaryFiles>();

    public constructor(
        _router: Router,
        _routeFlattener: RouteFlattenerService,
        _activatedRoute: ActivatedRoute,
        private _migrationIssuesService: MigrationIssuesService,
        private _notificationService: NotificationService,
        private _sortingService: SortingService<ProblemSummary>
    ) {
        super(_router, _activatedRoute, _routeFlattener);
    }

    ngOnInit(): void {
        this.sortedIssues = this.migrationIssues;

        let flatRouteData = this._routeFlattener.getFlattenedRouteData(this._activatedRoute.snapshot);
        this.loadFilterFromRouteData(flatRouteData);

        this.addSubscription(this._routeFlattener.OnFlatRouteLoaded.subscribe(
            flatRouteData => this.loadFilterFromRouteData(flatRouteData)
        ));
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
        setTimeout(() => Prism.highlightAll(false), 1000);
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

    orderDirection: OrderDirection = OrderDirection.ASC;
    orderBy: any;

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
