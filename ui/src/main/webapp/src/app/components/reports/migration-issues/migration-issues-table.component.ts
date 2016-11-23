import {Component, Input, OnInit} from "@angular/core";
import {Router, ActivatedRoute} from "@angular/router";
import {MigrationIssuesService} from "./migration-issues.service";
import {NotificationService} from "../../../services/notification.service";

@Component({
    selector: 'wu-migration-issues-table',
    templateUrl: '/migration-issues-table.component.html',
    styles: [
        `a { cursor: pointer; }`
    ]
})
export class MigrationIssuesTableComponent implements OnInit {
    @Input()
    migrationIssues: ProblemSummary[] = [];

    problemSummariesFiles: any = new Map<ProblemSummary, any>(); // Map<ProblemSummary, any>
    displayedSummariesFiles = new Map<ProblemSummary, boolean>();

    protected executionId;

    public constructor(
        private _router: Router,
        private _activatedRoute: ActivatedRoute,
        private _migrationIssuesService: MigrationIssuesService,
        private _notificationService: NotificationService
    ) {

    }

    ngOnInit(): void {
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
}
