import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { utils } from "../../../shared/utils";
import { NotificationService } from "../../../core/notification/notification.service";
import { ApplicationGroup } from "windup-services";
import { AggregatedStatisticsService } from "./aggregated-statistics.service";
import { calculateColorScheme } from "../../../shared/color-schemes";
import { StatisticsList } from "windup-services";
import { EffortByCategoryDTO } from "windup-services";
import { EffortCategoryDTO } from "windup-services";
import { WINDUP_WEB } from "../../../app.module";

@Component({
    templateUrl: '/application-index.component.html',
    styleUrls: ['/application-index.component.css']
})
export class ApplicationIndexComponent implements OnInit {

    public hideFilter = WINDUP_WEB.config.hideUnfinishedFeatures;

    // used for showing/hiding details in tables
    showDetails: boolean = false;

    domain: any;

    // both are used for getting graph and for report filter DTO
    private execID: number;
    private group: ApplicationGroup;

    // aggregated statistics variables
    globalPackageUseData: ChartStatistic[] = [];
    categoriesMultiStats: any[] = [];
    mandatoryMultiStats: any[] = [];

    componentsStats: StatisticsList = <StatisticsList>{};
    dependenciesStats: StatisticsList = <StatisticsList>{};

    constructor(
        private _router: Router,
        private _activatedRoute: ActivatedRoute,
        private _notificationService: NotificationService,
        private _aggregatedStatsService: AggregatedStatisticsService
    ) { }


    ngOnInit(): void {
        this._activatedRoute.params.subscribe(params => {
            let executionId = parseInt(params['executionId']);
            this.execID = executionId;

            this._aggregatedStatsService.getAggregatedCategories(executionId).subscribe(
                result => {
                    this.categoriesMultiStats = this.getCategoriesStats(this.calculateCategoryIncidents(result), this.calculateStoryPointsInCategories(result));
                    this.mandatoryMultiStats = this.getMandatoryMultiStats(result.categories.find(category => category.categoryID == "mandatory"));
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
        
    }

    sumStatsList(statsList:StatisticsList):number {
        if (!statsList || !statsList.entries)
            return 0;

        return statsList.entries.reduce((previousNumber, nextEntry) => previousNumber + nextEntry.value, 0);
    }

    getDependencyCountByType(type:string):number {
        let result = 0;
        if (!this.dependenciesStats || !this.dependenciesStats.entries)
            return result;

        this.dependenciesStats.entries.forEach(entry => {
            if (entry.name == type)
                result += entry.value;
        });
        return result;
    }

    getColorScheme(len) {
        return calculateColorScheme(len);
    }

    /**
     * Array of package statistics converted into ChartStatistic array for table and chart rendering
     */
    private convertPackagesToChartStatistic(statistics: StatisticsList): ChartStatistic[] {
        if (!statistics)
            return;

        let result: ChartStatistic[] = [];

        statistics.entries.forEach(entry => {
            result.push(new ChartStatistic(entry.name, entry.value));
        });
        return result;
    }

    private calculateCategoryIncidents(statistics: EffortByCategoryDTO): ChartStatistic[] {
        if (!statistics)
            return;

        let result: ChartStatistic[] = [];

        statistics.categories.forEach(category => {
            let categoryIncidentsSum = category.entries.reduce((previousValue, nextEntry) => previousValue + nextEntry.value, 0);
            let chartStat: ChartStatistic = new ChartStatistic(category.categoryID, categoryIncidentsSum);
            result.push(chartStat);
        });

        return result;
    }

    private calculateStoryPointsInCategories(statistics: EffortByCategoryDTO): ChartStatistic[] {
        if (!statistics)
            return;
        let result: ChartStatistic[] = [];

        statistics.categories.forEach(category => {
            let sum: number = 0;
            category.entries.forEach(entry => {
                let storyPointPerIncident: number = EffortLevel[entry.name];
                let incidents: number = entry.value;
                sum += storyPointPerIncident * incidents;
            });
            let chartStat: ChartStatistic = new ChartStatistic(category.categoryID, sum);
            result.push(chartStat);
        });
        return result;
    }

    private getMandatoryMultiStats (mandatoryCategory: EffortCategoryDTO): any[] {
        let result: any[] = [];

        mandatoryCategory.entries.forEach(incidentStat => {
            let series: ChartStatistic[] = [];
            let incidentsNumber: number = incidentStat.value;
            let storyPointPerIncident: number = EffortLevel[incidentStat.name];

            series.push(new ChartStatistic("incidents", incidentsNumber));
            series.push(new ChartStatistic("points", incidentsNumber * storyPointPerIncident));
            result.push({ "name": incidentStat.name, "series": series });
        });

        result = result.sort((obj1:{name:string, series:any[]}, obj2:{name:string, series:any[]}) => {
            let pointsPerIncident1 = EffortLevel[obj1.name];
            let pointsPerIncident2 = EffortLevel[obj2.name];
            return pointsPerIncident1 - pointsPerIncident2;
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

        result = result.sort((obj1:{name:string, series:any[]}, obj2:{name:string, series:any[]}) => {
            let pointsPerIncident1 = EffortLevel[obj1.name];
            let pointsPerIncident2 = EffortLevel[obj2.name];
            return pointsPerIncident1 - pointsPerIncident2;
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

export enum EffortLevel {
    Info = 0,
    Trivial = 1,
    Complex = 3,
    Redesign = 5,
    Architectural = 7,
    Unknown = 13
}
