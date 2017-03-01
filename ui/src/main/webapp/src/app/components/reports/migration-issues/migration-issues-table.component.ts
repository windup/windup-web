import {Component, Input, OnInit} from "@angular/core";
import {Router, ActivatedRoute} from "@angular/router";
import {MigrationIssuesService} from "./migration-issues.service";
import {NotificationService} from "../../../services/notification.service";
import {Http} from "@angular/http";
import {GraphJSONToModelService} from "../../../services/graph/graph-json-to-model.service";
import {FileModel} from "../../../generated/tsModels/FileModel";
import {SortingService, OrderDirection} from "../../../services/sorting.service";

@Component({
    selector: 'wu-migration-issues-table',
    templateUrl: './migration-issues-table.component.html',
    styles: [`
        a { cursor: pointer; }
        
        table.migration-issues-table { margin-bottom: 0; }
        table.migration-issues-table > thead > tr > th:first-child { text-align: left; }
        table.migration-issues-table > thead > tr > th             { text-align: right; }
        table.migration-issues-table > tbody > tr > th:first-child,
        table.migration-issues-table > tbody > tr > td:first-child { text-align: left; }
        table.migration-issues-table > tbody > tr > th,
        table.migration-issues-table > tbody > tr > td             { text-align: right; }

        /* Files subtable */
        table.migration-issues-table table { margin-bottom: 0; border: 1px solid #e7e7e7; }
        table.migration-issues-table table tbody td { background: #fffff5 !important; } /* A very subtle yellow tint. */
        
        table.migration-issues-table table.filesDetails > thead > tr > th.fileName { text-align: left; }
        table.migration-issues-table table.filesDetails > thead > tr > th.hint     { text-align: left; }
        table.migration-issues-table table.filesDetails                th          { text-align: right; }
        table.migration-issues-table table.filesDetails > tbody > tr > td.fileName,
        table.migration-issues-table table.filesDetails > tbody > tr > td.hint     { text-align: left; }
        table.migration-issues-table table.filesDetails > tbody > tr > td          { text-align: right; }
        
        table.migration-issues-table table.filesDetails > tbody > tr > td.hint .panel-title     { font-weight: 600; line-height: 1.66; }
        table.migration-issues-table table.filesDetails > tbody > tr > td.hint .description     { }
        
    `],
    providers: [SortingService]
})
export class MigrationIssuesTableComponent implements OnInit {
    @Input()
    migrationIssues: ProblemSummary[] = [];

    sortedIssues: ProblemSummary[] = [];

    problemSummariesFiles: any = new Map<ProblemSummary, any>(); // Map<ProblemSummary, any>
    displayedSummariesFiles = new Map<ProblemSummary, boolean>();

    protected executionId;

    public constructor(
        private _router: Router,
        private _http: Http,
        private _activatedRoute: ActivatedRoute,
        private _migrationIssuesService: MigrationIssuesService,
        private _notificationService: NotificationService,
        private _sortingService: SortingService<ProblemSummary>,
        private _graphJsonToModelService: GraphJSONToModelService<any>
    ) {

    }

    ngOnInit(): void {
        this.sortedIssues = this.migrationIssues;

        this._activatedRoute.params.subscribe(params => {
            this.executionId = parseInt(params['executionId']);
        });
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

    toggleFiles(summary: ProblemSummary) {
        if (this.displayedSummariesFiles.has(summary)) {
            this.displayedSummariesFiles.set(summary, !this.displayedSummariesFiles.get(summary));
        } else {
            this.loadIssuesPerFile(summary);
        }
    }

    protected loadIssuesPerFile(summary: ProblemSummary) {
        this._migrationIssuesService.getIssuesPerFile(this.executionId, summary).subscribe(fileSummaries => {
            this.problemSummariesFiles.set(summary, fileSummaries);
            this.displayedSummariesFiles.set(summary, true);
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

    navigateToSource(file:any) {
        let fileModel = <FileModel>this._graphJsonToModelService.fromJSON(file, FileModel);
        console.log("File clicked: " + fileModel.vertexId);
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

    sortBy(property: string) {
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
}
