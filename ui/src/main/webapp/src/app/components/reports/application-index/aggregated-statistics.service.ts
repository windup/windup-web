import {Injectable} from "@angular/core";
import {Http} from "@angular/http";
import {Observable} from "rxjs";
import {AbstractService} from "../../../services/abtract.service";
import {Constants} from "../../../constants";
import {IssueCategoryModel} from "../../../generated/tsModels/IssueCategoryModel";

@Injectable()
export class AggregatedStatisticsService extends AbstractService {
    private static AGGREGATED_MANDATORY_INCIDENTS_URL = 'aggregatedstats/aggregatedMandatoryIncidents';
    private static AGGREGATED_CATEGORIES_URL = 'aggregatedstats/aggregatedCategories';
    private static AGGREGATED_JAVA_PACKAGES_URL = 'aggregatedstats/aggregatedJavaPackages';

    private static AGGREGATED_COMPONENTS_URL = 'aggregatedstats/aggregatedArchives';

    private static AGGREGATED_DEPENDENCIES_URL = 'aggregatedstats/aggregatedDependencies';
    

    constructor(private _http: Http) {
        super();
    }

    getAggregatedCategories(executionId: number): Observable<Statistics> {
        return this._http.get(`${Constants.GRAPH_REST_BASE}/reports/${executionId}/${AggregatedStatisticsService.AGGREGATED_CATEGORIES_URL}`)
            .map(res => res.json())
            .catch(this.handleError);
    }
 
    getMandatoryIncidents(executionId: number): Observable<Statistics> {
        return this._http.get(`${Constants.GRAPH_REST_BASE}/reports/${executionId}/${AggregatedStatisticsService.AGGREGATED_MANDATORY_INCIDENTS_URL}`)
            .map(res => res.json())
            .catch(this.handleError);
    }

    getAggregatedJavaPackages(executionId: number): Observable<PackageStatistics[]> {
        return this._http.get(`${Constants.GRAPH_REST_BASE}/reports/${executionId}/${AggregatedStatisticsService.AGGREGATED_JAVA_PACKAGES_URL}`)
            .map(res => res.json())
            .catch(this.handleError);
    }

    getAggregatedArchives(executionId: number): Observable<PackageStatistics[]> {
        return this._http.get(`${Constants.GRAPH_REST_BASE}/reports/${executionId}/${AggregatedStatisticsService.AGGREGATED_COMPONENTS_URL}`)
            .map(res => res.json())
            .catch(this.handleError);
    }

    getAggregatedDependencies(executionId: number): Observable<PackageStatistics[]> {
        return this._http.get(`${Constants.GRAPH_REST_BASE}/reports/${executionId}/${AggregatedStatisticsService.AGGREGATED_DEPENDENCIES_URL}`)
            .map(res => res.json())
            .catch(this.handleError);
    }
}
