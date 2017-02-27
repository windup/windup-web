import {Component, OnInit} from "@angular/core";
import {Router, ActivatedRoute} from "@angular/router";
import {NotificationService} from "../../../services/notification.service";
import {MigrationIssuesService} from "./migration-issues.service";
import {utils} from '../../../utils';
import {ApplicationGroup} from "windup-services";
import {WINDUP_WEB} from "../../../app.module";

@Component({
    selector: 'wu-migration-issues',
    templateUrl: './migration-issues.component.html',
    styles: [`
        a { cursor: pointer; } /* Has no href, so this would be carret. */
        .panel-primary.wuMigrationIssues { border-color: #e7e7e7; }
        .panel-primary.wuMigrationIssues .panel-heading { background-color: white; padding: 15px 15px; border-bottom: 2px solid #e7e7e7; }
        .panel-primary.wuMigrationIssues .panel-heading .panel-title { color: black; font-size: 20px; font-weight: 500; }
        
        /deep/ table.migration-issues-table { margin-bottom: 0; font-size: 14px; }
        /deep/ table.migration-issues-table table { margin-bottom: 0; font-size: 14px; border: 1px solid #e7e7e7; }
        /deep/ table.migration-issues-table table tbody td { background: #fffff5 !important; } /* A very subtle yellow tint. */
        /deep/ table.migration-issues-table > tbody > tr > th:first-child { text-align: left; }
        /deep/ table.migration-issues-table > tbody > tr > td:first-child { text-align: left; }
        /deep/ table.migration-issues-table > thead > tr.summary-row > th:first-child { text-align: left; }
        /deep/ table.migration-issues-table > thead > tr.summary-row > th             { text-align: right; }
        /deep/ table.migration-issues-table > tbody > tr > th             { text-align: right; }
        /deep/ table.migration-issues-table > tbody > tr > td             { text-align: right; }
    `]
})
export class MigrationIssuesComponent implements OnInit {
    protected categorizedIssues: Dictionary<ProblemSummary[]>;
    protected categories: string[];

    protected group: ApplicationGroup;

    public hideFilter = WINDUP_WEB.config.hideUnfinishedFeatures;

    public constructor(
        private _router: Router,
        private _activatedRoute: ActivatedRoute,
        private _migrationIssuesService: MigrationIssuesService,
        private _notificationService: NotificationService
    ) {
    }

    ngOnInit(): void {
        this._activatedRoute.params.subscribe(params => {
            let executionId = parseInt(params['executionId']);

            this._migrationIssuesService.getAggregatedIssues(executionId).subscribe(
                result => {
                    this.categorizedIssues = result;
                    this.categories = Object.keys(result);
                },
                error => {
                    this._notificationService.error(utils.getErrorMessage(error));
                    this._router.navigate(['']);
                });
        });

        this._activatedRoute.parent.parent.parent.data.subscribe((data: {applicationGroup: ApplicationGroup}) => {
            this.group = data.applicationGroup;
        });
    }
}
