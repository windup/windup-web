import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {AbstractService} from "../../shared/abtract.service";
import {Constants} from "../../constants";
import {Cached} from "../../shared/cache.service";
import {ReportFilter} from "../../generated/windup-services";
import { map, catchError } from 'rxjs/operators';

@Injectable()
export class MigrationIssuesService extends AbstractService {
    private static MIGRATION_ISSUES_BASE = Constants.GRAPH_REST_BASE + '/reports/{executionId}/migrationIssues';
    private static AGGREGATED_ISSUES_URL = MigrationIssuesService.MIGRATION_ISSUES_BASE + '/aggregatedIssues';
    private static FILE_ISSUES_URL = MigrationIssuesService.MIGRATION_ISSUES_BASE + '/{summaryId}/files';

    constructor(private _http: HttpClient) {
        super();
    }

    @Cached('migrationIssues', null, true)
    getAggregatedIssues(executionId: number, filter?: ReportFilter): Observable<Dictionary<ProblemSummary[]>> {
        let url = MigrationIssuesService.AGGREGATED_ISSUES_URL.replace('{executionId}', executionId.toString());

        let serializedFilter = this.serializeFilter(filter);

        return this._http.post<Dictionary<ProblemSummary[]>>(url, serializedFilter, this.JSON_OPTIONS);
    }

    @Cached('migrationIssues', null, true)
    getIssuesPerFile(executionId: number, problemSummary: ProblemSummary, filter?: ReportFilter): Observable<any> {
        let url = MigrationIssuesService.FILE_ISSUES_URL
            .replace('{executionId}', executionId.toString())
            .replace('{summaryId}', problemSummary.ruleID + problemSummary.issueName);

        let serializedFilter = this.serializeFilter(filter);

        return this._http.post(url, serializedFilter, this.JSON_OPTIONS);
    }
}
