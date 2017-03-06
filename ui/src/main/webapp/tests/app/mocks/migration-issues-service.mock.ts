import {MigrationIssuesService} from "../../../src/app/reports/migration-issues/migration-issues.service";
import {Observable} from "rxjs";

export class MigrationIssuesServiceMock extends  MigrationIssuesService {
    constructor() {
        super(null);
    }

    getAggregatedIssues(executionId: number): Observable<Dictionary<ProblemSummary[]>> {
        return null;
    }

    getIssuesPerFile(executionId: number, problemSummary: ProblemSummary): Observable<any> {
        return new Observable<any>(observer => {
            observer.next([]);
            observer.complete();
        });
    }
}
