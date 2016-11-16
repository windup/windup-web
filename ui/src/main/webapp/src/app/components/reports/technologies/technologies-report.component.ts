import {Component, OnInit} from "@angular/core";
import {ActivatedRoute, Params}   from '@angular/router';

import {TechReportService, StatsItem} from "./tech-report.service";

import {ApplicationGroup} from "../../../../app/windup-services";
import {ApplicationGroupService} from '../../../services/application-group.service';
import {TechnologiesStatsModel} from '../../../generated/tsModels/TechnologiesStatsModel';

@Component({
    selector: 'wu-technologies-report',
    templateUrl: 'technologies-report.component.html'
})
export class TechnologiesReportComponent implements OnInit {

    private execID: number;
    private technologiesStats: TechnologiesStatsModel = <TechnologiesStatsModel> {};
    private appGroups : ApplicationGroup[];

    constructor(
        private route: ActivatedRoute,
        private techReportService: TechReportService,
        private appGrpService: ApplicationGroupService
    ){}

    ngOnInit(): void {
        this.route.params.forEach((params: Params) => {
            this.execID = +params['executionId'];
            this.fetchTechnologiesStats();
        });

        this.appGrpService.getAll().toPromise().then(appGroups => this.appGroups = appGroups);
    }

    fetchTechnologiesStats(): void {
        this.techReportService.getStats(this.execID).subscribe(stats => {
            console.log("Stats: ", stats);
            this.technologiesStats = stats; // [0]
        });
    }


    static convertStatsToMap(stats: StatsItem[]) : Map<string, StatsItem> {
        let map = new Map<string, StatsItem>();
        stats.forEach(item => map.set(item.key, item));
        return map;
    }
}
