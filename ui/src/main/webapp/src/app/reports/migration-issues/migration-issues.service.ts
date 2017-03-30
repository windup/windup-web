import {Injectable} from "@angular/core";
import {Http} from "@angular/http";
import {Observable} from "rxjs";
import {AbstractService} from "../../shared/abtract.service";
import {Constants} from "../../constants";
import {Cached} from "../../shared/cache.service";
import {ReportFilter} from "windup-services";

@Injectable()
export class MigrationIssuesService extends AbstractService {
    private static MIGRATION_ISSUES_BASE = Constants.GRAPH_REST_BASE + '/reports/{executionId}/migrationIssues';
    private static AGGREGATED_ISSUES_URL = MigrationIssuesService.MIGRATION_ISSUES_BASE + '/aggregatedIssues';
    private static FILE_ISSUES_URL = MigrationIssuesService.MIGRATION_ISSUES_BASE + '/{summaryId}/files';

    constructor(private _http: Http) {
        super();
    }

    @Cached('migrationIssues', null, true)
    getAggregatedIssues(executionId: number, filter?: ReportFilter): Observable<Dictionary<ProblemSummary[]>> {
        let url = MigrationIssuesService.AGGREGATED_ISSUES_URL.replace('{executionId}', executionId.toString());

        let serializedFilter = this.serializeFilter(filter);

        return this._http.post(url, serializedFilter, this.JSON_OPTIONS)
            .map(res => res.json())
            .catch(this.handleError);
    }

    @Cached('migrationIssues', null, true)
    getIssuesPerFile(executionId: number, problemSummary: ProblemSummary, filter?: ReportFilter): Observable<any> {
        let url = MigrationIssuesService.FILE_ISSUES_URL
            .replace('{executionId}', executionId.toString())
            .replace('{summaryId}', problemSummary.ruleID + problemSummary.issueName);

        let serializedFilter = this.serializeFilter(filter);

        return this._http.post(url, serializedFilter, this.JSON_OPTIONS)
            .map(res => res.json())
            .catch(this.handleError);
    }
}
