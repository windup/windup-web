import {Injectable} from "@angular/core";
import {Http} from "@angular/http";
import {Observable} from "rxjs";
import {AbstractService} from "../../shared/abtract.service";
import {Constants} from "../../constants";
import {EffortByCategoryDTO, ReportFilter} from "windup-services";
import {StatisticsList} from "windup-services";
import {Cached} from "../../shared/cache.service";

@Injectable()
export class AggregatedStatisticsService extends AbstractService {
    private static AGGREGATED_CATEGORIES_URL = 'aggregatedstats/aggregatedCategories';
    private static AGGREGATED_JAVA_PACKAGES_URL = 'aggregatedstats/aggregatedJavaPackages';
    private static AGGREGATED_COMPONENTS_URL = 'aggregatedstats/aggregatedArchives';

    private static AGGREGATED_DEPENDENCIES_URL = 'aggregatedstats/aggregatedDependencies';
    

    constructor(private _http: Http) {
        super();
    }

    @Cached('aggregatedStatistics', null, true)
    getAggregatedCategories(executionId: number, filter?: ReportFilter): Observable<EffortByCategoryDTO> {
        return this._http.get(`${Constants.GRAPH_REST_BASE}/reports/${executionId}/${AggregatedStatisticsService.AGGREGATED_CATEGORIES_URL}`)
            .map(res => res.json())
            .catch(this.handleError);
    }

    @Cached('aggregatedStatistics', null, true)
    getAggregatedJavaPackages(executionId: number, filter?: ReportFilter): Observable<StatisticsList> {
        return this._http.get(`${Constants.GRAPH_REST_BASE}/reports/${executionId}/${AggregatedStatisticsService.AGGREGATED_JAVA_PACKAGES_URL}`)
            .map(res => res.json())
            .catch(this.handleError);
    }

    @Cached('aggregatedStatistics', null, true)
    getAggregatedArchives(executionId: number, filter?: ReportFilter): Observable<StatisticsList> {
        return this._http.get(`${Constants.GRAPH_REST_BASE}/reports/${executionId}/${AggregatedStatisticsService.AGGREGATED_COMPONENTS_URL}`)
            .map(res => res.json())
            .catch(this.handleError);
    }

    @Cached('aggregatedStatistics', null, true)
    getAggregatedDependencies(executionId: number, filter?: ReportFilter): Observable<StatisticsList> {
        return this._http.get(`${Constants.GRAPH_REST_BASE}/reports/${executionId}/${AggregatedStatisticsService.AGGREGATED_DEPENDENCIES_URL}`)
            .map(res => res.json())
            .catch(this.handleError);
    }
}
