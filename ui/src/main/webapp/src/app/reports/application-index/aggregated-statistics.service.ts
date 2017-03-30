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
    private static BASE_PATH = Constants.GRAPH_REST_BASE + '/reports/{executionId}/aggregatedstats';

    private static AGGREGATED_CATEGORIES_URL = AggregatedStatisticsService.BASE_PATH + '/aggregatedCategories';
    private static AGGREGATED_JAVA_PACKAGES_URL = AggregatedStatisticsService.BASE_PATH + '/aggregatedJavaPackages';
    private static AGGREGATED_COMPONENTS_URL = AggregatedStatisticsService.BASE_PATH + '/aggregatedArchives';
    private static AGGREGATED_DEPENDENCIES_URL = AggregatedStatisticsService.BASE_PATH + '/aggregatedDependencies';

    constructor(private _http: Http) {
        super();
    }

    @Cached('aggregatedStatistics', null, true)
    getAggregatedCategories(executionId: number, filter?: ReportFilter): Observable<EffortByCategoryDTO> {
        let url = AggregatedStatisticsService.AGGREGATED_CATEGORIES_URL
            .replace('{executionId}', executionId.toString());

        return this._http.get(url)
            .map(res => res.json())
            .catch(this.handleError);
    }

    @Cached('aggregatedStatistics', null, true)
    getAggregatedJavaPackages(executionId: number, filter?: ReportFilter): Observable<StatisticsList> {
        let url = AggregatedStatisticsService.AGGREGATED_JAVA_PACKAGES_URL
            .replace('{executionId}', executionId.toString());

        return this._http.get(url)
            .map(res => res.json())
            .catch(this.handleError);
    }

    @Cached('aggregatedStatistics', null, true)
    getAggregatedArchives(executionId: number, filter?: ReportFilter): Observable<StatisticsList> {
        let url = AggregatedStatisticsService.AGGREGATED_COMPONENTS_URL
            .replace('{executionId}', executionId.toString());

        return this._http.get(url)
            .map(res => res.json())
            .catch(this.handleError);
    }

    @Cached('aggregatedStatistics', null, true)
    getAggregatedDependencies(executionId: number, filter?: ReportFilter): Observable<StatisticsList> {
        let url = AggregatedStatisticsService.AGGREGATED_DEPENDENCIES_URL
            .replace('{executionId}', executionId.toString());

        return this._http.get(url)
            .map(res => res.json())
            .catch(this.handleError);
    }
}
