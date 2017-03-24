import {Injectable} from "@angular/core";
import {Http} from "@angular/http";
import {Observable} from "rxjs";
import {AbstractService} from "../../shared/abtract.service";
import {Constants} from "../../constants";
import {Cached} from "../../shared/cache.service";

@Injectable()
export class MigrationIssuesService extends AbstractService {
    private static AGGREGATED_ISSUES_URL = 'migrationIssues/aggregatedIssues';

    constructor(private _http: Http) {
        super();
    }

    @Cached('migrationIssues', null, true)
    getAggregatedIssues(executionId: number): Observable<Dictionary<ProblemSummary[]>> {
        return this._http.get(`${Constants.GRAPH_REST_BASE}/reports/${executionId}/${MigrationIssuesService.AGGREGATED_ISSUES_URL}`)
            .map(res => res.json())
            .catch(this.handleError);
    }

    @Cached('migrationIssues', null, true)
    getIssuesPerFile(executionId: number, problemSummary: ProblemSummary): Observable<any> {
        return this._http.get(`${Constants.GRAPH_REST_BASE}/reports/${executionId}/migrationIssues/${problemSummary.ruleID}${problemSummary.issueName}/files`)
            .map(res => res.json())
            .catch(this.handleError);
    }
}
