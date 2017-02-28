import { Component, OnInit, ChangeDetectorRef, ElementRef } from "@angular/core";
import { Http } from "@angular/http";
import { Params, ActivatedRoute, Router } from "@angular/router";
import { utils } from "../../../utils";
import { NotificationService } from "../../../services/notification.service";
import { ApplicationGroup } from "windup-services";
import { AggregatedStatisticsService } from "./aggregated-statistics.service";
import { ColorHelper } from '@swimlane/ngx-charts';

@Component({
    templateUrl: '/application-index.component.html',
    styleUrls: ['/application-index.component.css']
})
export class ApplicationIndexComponent implements OnInit {

    // used for showing/hiding details in tables
    showDetails: boolean = false;

    domain: any;
    colors: ColorHelper;
    // color scheme for graphs on template
    colorScheme: any = 'cool';

    // both are used for getting graph and for report filter DTO
    private execID: number;
    private group: ApplicationGroup;

    // aggregated statistics variables
    globalPackageUseData: ChartStatistic[] = [];
    categoriesMultiStats: any[] = [];
    categoriesStats: ChartStatistic[] = [];
    mandatoryMultiStats: any[] = [];
    mandatoryStats: ChartStatistic[] = [];

    componentsStats: any[] = [];
    dependenciesStats: any[] = [];

    constructor(
        private _router: Router,
        private _activatedRoute: ActivatedRoute,
        private _notificationService: NotificationService,
        private _aggregatedStatsService: AggregatedStatisticsService,
        private _http: Http
    ) { }


    ngOnInit(): void {
   

        this._activatedRoute.params.subscribe(params => {
            let executionId = parseInt(params['executionId']);
            this.execID = executionId;

            this._aggregatedStatsService.getAggregatedCategories(executionId).subscribe(
                result => {
                    this.categoriesMultiStats = this.getCategoriesStats(this.calculateCategoryIncidents(result), this.calculateStoryPointsInCategories(result));
                    this.categoriesStats = this.convertToChartStatistic(result);
                },
                error => {
                    this._notificationService.error(utils.getErrorMessage(error));
                    this._router.navigate(['']);
                }
            );
            this._aggregatedStatsService.getMandatoryIncidents(executionId).subscribe(
                result => {
                    this.mandatoryMultiStats = this.getCategoryDetailsStats(this.convertToChartStatistic(result));
                    this.mandatoryStats = this.convertToChartStatistic(result);
                },
                error => {
                    this._notificationService.error(utils.getErrorMessage(error));
                    this._router.navigate(['']);
                }
            );
            this._aggregatedStatsService.getAggregatedJavaPackages(executionId).subscribe(
                result => this.globalPackageUseData = this.convertPackagesToChartStatistic(result),
                error => {
                    this._notificationService.error(utils.getErrorMessage(error))
                    this._router.navigate(['']);
                }
            );

            this._aggregatedStatsService.getAggregatedArchives(executionId).subscribe(
                result => this.componentsStats = result,
                error => {
                    this._notificationService.error(utils.getErrorMessage(error));
                    this._router.navigate(['']);
                }
            );

            this._aggregatedStatsService.getAggregatedDependencies(executionId).subscribe(
                result => this.dependenciesStats = result,
                error => {
                    this._notificationService.error(utils.getErrorMessage(error));
                    this._router.navigate(['']);
                }
            );
        });

        this._activatedRoute.parent.parent.parent.data.subscribe((data: { applicationGroup: ApplicationGroup }) => {
            this.group = data.applicationGroup;
        });
        
        // setting colors according colorTheme and count of max/min items in data sets
        this.setColors();
    }

    setColors() {
        this.colors = new ColorHelper(this.colorScheme, 'ordinal', this.getDomain());
    }

    getDomain():any {
        let minDomain:number = Math.min(this.categoriesMultiStats.keys.length, this.mandatoryMultiStats.length, this.globalPackageUseData.length);
        let maxDomain:number = Math.max(this.categoriesMultiStats.keys.length, this.mandatoryMultiStats.length, this.globalPackageUseData.length);
        console.log('Domain values: ' + [minDomain, maxDomain]);
        return [minDomain, maxDomain];
    }

    /**
     * Array of package statistics converted into ChartStatistic array for table and chart rendering
     */
    private convertPackagesToChartStatistic(statistics: PackageStatistics[]): ChartStatistic[] {
        if (!statistics)
            return;

        let result: ChartStatistic[] = [];

        Object.keys(statistics).forEach(key => {
            let chartStat: ChartStatistic = new ChartStatistic(key, statistics[key]);
            result.push(chartStat);
        });
        result = result.sort(chartStatisticComparator);
        return result;
    }

    /**
     * Converting array of categories statistics into ChartStatistic array for table and chart rendering
     */
    private convertToChartStatistic(statistics: Statistics): ChartStatistic[] {
        if (!statistics)
            return;

        let result: ChartStatistic[] = [];

        Object.keys(statistics).forEach(category => {
            let incidents: any[] = statistics[category];
            Object.keys(incidents).forEach(effort => {
                let chartStat: ChartStatistic = new ChartStatistic(effort, incidents[effort]);
                result.push(chartStat);
            });
        });
        result = result.sort(chartStatisticComparator);
        return result;
    }

    private calculateCategoryIncidents(statistics: Statistics): ChartStatistic[] {
        if (!statistics)
            return;
        let result: ChartStatistic[] = [];

        Object.keys(statistics).forEach(key => {
            let categoryIncidentsSum = Object.values(statistics[key]).reduce(function (item1, item2) { return item1 + item2; }, 0);
            let chartStat: ChartStatistic = new ChartStatistic(key, categoryIncidentsSum);
            result.push(chartStat);
        });
        result = result.sort(chartStatisticComparator);
        return result;
    }

    private calculateStoryPointsInCategories(statistics: Statistics): ChartStatistic[] {
        if (!statistics)
            return;
        let result: ChartStatistic[] = [];

        Object.keys(statistics).forEach(category => {
            let effortIncidents = statistics[category];
            let sum: number = 0;
            Object.keys(effortIncidents).forEach(issueEffort => {
                let storyPointPerIncident: number = EffortLevel[issueEffort];
                let incidents: number = effortIncidents[issueEffort];
                sum += storyPointPerIncident * incidents;
            });
            let chartStat: ChartStatistic = new ChartStatistic(category, sum);
            result.push(chartStat);
        });
        result = result.sort(chartStatisticComparator);
        return result;
    }

    private getCategoryDetailsStats(incidents: ChartStatistic[]): any[] {
        let result: any[] = [];

        Object.keys(incidents).forEach(effort => {
            let series: ChartStatistic[] = [];
            let effortIncidents: ChartStatistic = incidents[effort];
            let incidentsNumber: number = effortIncidents.value;
            let storyPointPerIncident: number = EffortLevel[effortIncidents.name];

            series.push(new ChartStatistic("incidents", incidentsNumber));
            series.push(new ChartStatistic("points", incidentsNumber * storyPointPerIncident));
            result.push({ "name": effortIncidents.name, "series": series });
        });

        return result;
    }
    private getCategoriesStats(incidents: ChartStatistic[], points: ChartStatistic[]): any[] {

        let result: any[] = [];

        Object.keys(incidents).forEach(category => {
            let categoryStr: string = incidents[category].name;
            let series: ChartStatistic[] = [];
            series.push(new ChartStatistic("incidents", incidents[category].value));
            series.push(new ChartStatistic("points", points[category].value));
            result.push({ "name": categoryStr, "series": series });
        });
        return result;
    }
}

class ChartStatistic {
    name: string;
    value: number;

    constructor(name: string, value: number) {
        this.name = name;
        this.value = value;
    }

    public getValue(): number {
        return this.value;
    }
}

//export function getSumOfArray(array: ChartStatistic[]): number {
//    let sum: number = 0;
//    let i = array.length;
//
//    while (i--) {
//        let stat: ChartStatistic = array[i];
//        sum = sum + stat.value;
//    }
//    return sum;
//}

function chartStatisticComparator(stat1: ChartStatistic, stat2: ChartStatistic): number {
    return stat1.value - stat2.value;
}

export enum EffortLevel {
    Info = 0,
    Trivial = 1,
    Complex = 3,
    Redesign = 5,
    Architectural = 7,
    Unknown = 13
}