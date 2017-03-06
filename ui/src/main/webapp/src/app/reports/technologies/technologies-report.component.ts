import {Component, OnInit} from "@angular/core";
import {ActivatedRoute, Params, Router}   from '@angular/router';

import {TechReportService, StatsItem} from "./tech-report.service";

import {ApplicationGroup} from "windup-services";
import {ApplicationGroupService} from '../../group/application-group.service';
import {NotificationService} from "../../core/notification/notification.service";
import {utils} from '../../shared/utils';
import {ProjectTechnologiesStatsModel} from "../../generated/tsModels/ProjectTechnologiesStatsModel";
import {forkJoin} from "rxjs/observable/forkJoin";
import {ProjectModel} from "../../generated/tsModels/ProjectModel";
import {FileModel} from "../../generated/tsModels/FileModel";
import {TechnologyKeyValuePairModel} from "../../generated/tsModels/TechnologyKeyValuePairModel";
import {RegisteredApplication} from "windup-services";
import {FilterApplication} from "windup-services";

@Component({
    selector: 'wu-technologies-report',
    templateUrl: 'technologies-report.component.html'
})
export class TechnologiesReportComponent implements OnInit {

    private execID: number;
    private technologiesStats: ProjectTechnologiesStatsModel[] = [];
    private filteredTechnologiesStats: TechnologiesStats;
    private appGroups : ApplicationGroup[];
    private currentGroup: ApplicationGroup;

    constructor(
        private route: ActivatedRoute,
        private techReportService: TechReportService,
        private appGrpService: ApplicationGroupService,
        private _notificationService: NotificationService,
        private _router: Router
    ){}

    ngOnInit(): void {
        this.route.params.forEach((params: Params) => {
            this.execID = +params['executionId'];
            this.fetchTechnologiesStats();
        });

        this.appGrpService.getAll().toPromise().then(appGroups => this.appGroups = appGroups);
        this.route.parent.parent.data.subscribe((data: {applicationGroup: ApplicationGroup}) => {
            this.currentGroup = data.applicationGroup;
        });
    }

    fetchTechnologiesStats(): void {
        this.techReportService.getStats(this.execID).subscribe(
            stats => {
                this.technologiesStats = stats;
                let filteredStats = this.filterTechnologiesStats(stats);
                let mergedStats = this.mergeTechnologyStats(filteredStats);
                mergedStats.fileTypes = this.mergeFileTypesToOne(<any>mergedStats.fileTypes, ['class', 'java'], 'Java');
                mergedStats.fileTypes = this.calculateFileTypeUsagePercentage(mergedStats.fileTypes);
                this.filteredTechnologiesStats = mergedStats;
                console.log(this.filteredTechnologiesStats);
            },
            error => {
                this._notificationService.error(utils.getErrorMessage(error));
                this._router.navigate(['']);
            }
        );
    }

    /**
     * This is workaround for RESTeasy returning sometimes ID and sometimes full entity
     */
    getFilterSelectedApplications(): (RegisteredApplication | FilterApplication)[] {
        let filterData = this.currentGroup.reportFilter.selectedApplications;

        return filterData.map(appOrId => {
            if (typeof appOrId !== 'object') {
                return this.currentGroup.applications.find((item) => item.id === appOrId);
            }

            return appOrId;
        });
    }

    filterTechnologiesStats(techReports: ProjectTechnologiesStatsModel[]): ProjectTechnologiesStatsModel[] {
        let filter = this.currentGroup.reportFilter;

        if (!filter.enabled || filter.selectedApplications.length === 0) {
            return techReports;
        }

        let indices = [];

        let rootFileModelObservable = techReports.map((item: ProjectTechnologiesStatsModel) => {
            return item.projectModel.flatMap((projectModel: ProjectModel) => projectModel.rootFileModel);
        });

        let filteredStats = [];

        forkJoin(rootFileModelObservable).subscribe((rootFileModelArray: FileModel[]) => {
            indices = rootFileModelArray.map((fileModel, index) => {
                let isApplicationSelected = this.getFilterSelectedApplications()
                    .some(selectedApp => {
                        if ((<FilterApplication>selectedApp).fileName)
                            return fileModel.fileName === (<FilterApplication>selectedApp).fileName;
                        else
                            return fileModel.fileName === (<RegisteredApplication>selectedApp).inputFilename;
                    });

                if (isApplicationSelected) {
                    return index;
                } else {
                    return -1;
                }
            });

            indices = indices.filter(index => index >= 0);

            filteredStats = indices.map(index => techReports[index]);
        });

        return filteredStats;
    }

    protected mergeArray(stats: ProjectTechnologiesStatsModel[], result: any, property: string) {
        let propertiesArray = stats.map(item => {
            return item.technologiesStatsModel.flatMap(technologiesStats => {
                return technologiesStats[property];
            });
        });

        console.log(propertiesArray);

        forkJoin(propertiesArray)
            .subscribe((projectTechnologiesArray: TechnologyKeyValuePairModel[][]) => {
                projectTechnologiesArray.forEach(technologiesArray => {
                    technologiesArray.forEach(technology => {
                        if (!result[property].hasOwnProperty(technology.name)) {
                            result[property][technology.name] = 0;
                        }

                        result[property][technology.name] += technology.value;
                    });
                });
            });
    }

    mergeTechnologyStats(stats: ProjectTechnologiesStatsModel[]) {
        let result = {
            technologies: {},
            fileTypes: {}
        };

        this.mergeArray(stats, result, 'technologies');
        this.mergeArray(stats, result, 'fileTypes');

        return result;
    }

    mergeFileTypesToOne(inputValues: TechnologyKeyValuePairModel[], mergedFileTypes: string[], outputFileType: string) {
        let mergedItem = {name: outputFileType, value: 0};

        let output: Object = Object.assign({}, inputValues); // make copy of array

        mergedFileTypes.forEach(mergedFileType => {
            if (output.hasOwnProperty(mergedFileType)) {
                mergedItem.value += output[mergedFileType];
                delete output[mergedFileType];
            }
        });

        output[outputFileType] = mergedItem.value;

        return output;
    }

    calculateFileTypeUsagePercentage(array: {[key: string]: number}) {
        let output = Object.assign({}, array);

        let arrayKeys = Object.getOwnPropertyNames(array);

        let filesCount = arrayKeys.reduce<number>((previous: number, key: string) => {
            return previous + array[key];
        }, 0);

        arrayKeys.forEach(key => {
            output[key] = Math.round((output[key] * 100) / filesCount);
        });

        return output;
    }


    static convertStatsToMap(stats: StatsItem[]) : Map<string, StatsItem> {
        let map = new Map<string, StatsItem>();
        stats.forEach(item => map.set(item.key, item));
        return map;
    }
}

interface TechnologiesStats {
    fileTypes: {[key: string]: number},
    technologies: {[key: string]: number}
}
