import {Injectable} from "@angular/core";
import {Http} from "@angular/http";
import {Observable} from "rxjs";
import {AbstractService} from "../../shared/abtract.service";
import {Constants} from "../../constants";
import {Cached} from "../../shared/cache.service";
import {FilterApplication, RegisteredApplication, ReportFilter} from "windup-services";
import {ProjectModel} from "../../generated/tsModels/ProjectModel";

@Injectable()
export class MigrationIssuesService extends AbstractService {
    private static AGGREGATED_ISSUES_URL = 'migrationIssues/aggregatedIssues';
    private static NEW_AGGREGATED_ISSUES_URL = Constants.GRAPH_REST_BASE + '/reports/{executionId}/migrationIssues/new-aggregated-issues';

    constructor(private _http: Http) {
        super();
    }

    @Cached('migrationIssues', null, true)
    getAggregatedIssues(executionId: number): Observable<Dictionary<ProblemSummary[]>> {
        return this._http.get(`${Constants.GRAPH_REST_BASE}/reports/${executionId}/${MigrationIssuesService.AGGREGATED_ISSUES_URL}`)
            .map(res => res.json())
            .catch(this.handleError);
    }

    @Cached({section: 'migrationIssues', immutable: true})
    getDataFromServer(executionId: number) {
        let url = MigrationIssuesService.NEW_AGGREGATED_ISSUES_URL.replace('{executionId}', executionId.toString());

        return this._http.get(url)
            .map(res => res.json())
            .catch(this.handleError);
    }

    getNewAggregatedIssues(executionId: number, filter?: ReportFilter): Observable<Dictionary<ProblemSummary[]>> {
        return this.getDataFromServer(executionId)
            .map((serverResponse: MigrationIssuesResponse[]) => {
                let result: Dictionary<ProblemSummary[]> = {};

                let data  = serverResponse;


                if (filter) {
                    data = serverResponse.filter(item => {
                        return filter.selectedApplications.some(filterApp => {
                            let rootFileName =  (<any>item.projectModel).vertices_out.rootFileModel.vertices[0].fileName;

                            if ((<FilterApplication>filterApp).fileName) {
                                return rootFileName === (<FilterApplication>filterApp).fileName;
                            } else {
                                return rootFileName === (<Partial<RegisteredApplication>>filterApp).inputFilename;
                            }
                        });
                    });
                }

                data.map(item => item.problemSummaries).forEach((problemSummary) => {
                    Object.keys(problemSummary).forEach(category => {
                        if (!result.hasOwnProperty(category)) {
                            result[category] = [];
                        }

                        result[category] = [].concat(result[category]).concat(problemSummary[category]);
                    });
                });

                Object.keys(result).forEach(category => {
                    result[category] = this.groupSummariesByRule(result[category]);
                });

                return result;
            });
    }

    protected groupSummariesByRule(summaries: ProblemSummary[]): ProblemSummary[] {
        let map: Map<string, ProblemSummary> = new Map<string, ProblemSummary>();

        summaries.forEach(summary => {
            if (!map.has(summary.ruleID)) {
                map.set(summary.ruleID, summary);
            } else {
                let existingSummary = map.get(summary.ruleID);
                existingSummary.numberFound += summary.numberFound;
            }
        });


        return Array.from(map.values());
    }

    @Cached('migrationIssues', null, true)
    getIssuesPerFile(executionId: number, problemSummary: ProblemSummary): Observable<any> {
        return this._http.get(`${Constants.GRAPH_REST_BASE}/reports/${executionId}/migrationIssues/${problemSummary.ruleID}${problemSummary.issueName}/files`)
            .map(res => res.json())
            .catch(this.handleError);
    }
}
export interface MigrationIssuesResponse {
    projectModel: ProjectModel;
    problemSummaries: ProblemSummaryMap;
}
