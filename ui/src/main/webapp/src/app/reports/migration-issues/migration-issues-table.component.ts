import {Component, Input, OnInit} from "@angular/core";
import {Router, ActivatedRoute} from "@angular/router";
import * as showdown from "showdown";
import "../source/prism";

import {MigrationIssuesService} from "./migration-issues.service";
import {NotificationService} from "../../core/notification/notification.service";
import {GraphJSONToModelService} from "../../services/graph/graph-json-to-model.service";
import {FileModel} from "../../generated/tsModels/FileModel";
import {SortingService, OrderDirection} from "../../shared/sort/sorting.service";
import {RouteFlattenerService} from "../../core/routing/route-flattener.service";
import {FilterableReportComponent} from "../filterable-report.component";
import {PaginationService} from "../../shared/pagination.service";

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

    problemSummariesFiles: any = new Map<ProblemSummary, any>(); // Map<ProblemSummary, any>
    displayedSummariesFiles = new Map<ProblemSummary, boolean>();

    summaryFiles = {
        pagination: {
            itemsPerPage: 5,
            page: 1
        }
    };


    public constructor(
        _router: Router,
        _routeFlattener: RouteFlattenerService,
        _activatedRoute: ActivatedRoute,
        private _migrationIssuesService: MigrationIssuesService,
        private _notificationService: NotificationService,
        private _sortingService: SortingService<ProblemSummary>,
        private _graphJsonToModelService: GraphJSONToModelService<any>,
        private _paginationService: PaginationService
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
        if (this.displayedSummariesFiles.has(summary)) {
            this.displayedSummariesFiles.set(summary, !this.displayedSummariesFiles.get(summary));
            this.delayedPrismRender();
        } else {
            this.loadIssuesPerFile(summary);
        }
    }

    protected loadIssuesPerFile(summary: ProblemSummary) {
        this._migrationIssuesService.getIssuesPerFile(this.execution.id, summary, this.reportFilter).subscribe(fileSummaries => {
            this.problemSummariesFiles.set(summary, fileSummaries);
            this.displayedSummariesFiles.set(summary, true);
            this.delayedPrismRender();
        },
        error => {
            this._notificationService.error('Could not load file summaries due to: ' + error);
        });
    }

    filesVisible(summary: ProblemSummary): boolean {
        return this.displayedSummariesFiles.has(summary) && this.displayedSummariesFiles.get(summary);
    }

    getProblemSummaryFiles(issue: ProblemSummary) {
        if (!this.problemSummariesFiles.has(issue)) {
            throw new Error('No file issues for given problem summary');
        }

        return this.problemSummariesFiles.get(issue);
    }

    getProblemSummaryFilesPage(issue: ProblemSummary, page: number, itemsPerPage: number) {
        const allFiles = this.getProblemSummaryFiles(issue);
        return this._paginationService.getPage(allFiles, page, itemsPerPage);
    }

    navigateToSource(file: any) {
        let fileModel = <FileModel>this._graphJsonToModelService.fromJSON(file, FileModel);
        ///projects/32057/groups/32058/reports/32121/source/32121
        let newPath = `source/${fileModel.vertexId}`;
        this._router.navigate([newPath], { relativeTo: this._activatedRoute });
        return false;
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

    showRule(ruleID: string) {
        /*
        This is not working either.
        Why do they even mention relative navigation in documentation if it doesn't work at all?

        this._router.navigate(['../executed-rules', {
            ruleID: ruleID
        }], {
            relativeTo: this._activatedRoute
        });
        */
        let currentUrl = this._activatedRoute.snapshot.pathFromRoot.reduce<string>((accumulator, item) => {
            let currentPart = item.url.reduce((acc, itm) => {
                return acc.concat((itm.path.length > 0 ? ('/'.concat(itm.path)) : ''));
            }, '');

            return accumulator + currentPart;
        }, '');

        let lastSlash = currentUrl.lastIndexOf('/');
        let newPath = currentUrl.substring(0, lastSlash).concat('/executed-rules');

        return this._router.navigate([newPath], {
            queryParams: {
                ruleID: ruleID
            }
        });
    }

    renderMarkdownToHtml(markdownCode: string): string {
        // The class="language-java" is already in <code>
        // <pre><code class="language-{{filetype()}}">

        let html: string;
        if (this.markdownCache.has(markdownCode))
            html = this.markdownCache.get(markdownCode);
        else {
            html = new showdown.Converter().makeHtml(markdownCode);
            this.markdownCache.set(markdownCode, html);
        }

        return html;
    }

    private markdownCache: Map<string, string> = new Map<string, string>();

}
