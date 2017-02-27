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
