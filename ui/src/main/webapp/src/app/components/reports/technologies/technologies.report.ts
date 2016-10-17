import {Component, OnInit} from "@angular/core";
import { ActivatedRoute, Params }   from '@angular/router';

import {TechReportService, StatsItem} from "./TechReportService";

import {ApplicationGroup} from "windup-services";
import {ApplicationGroupService} from '../../../services/applicationgroup.service';
import {GraphJSONtoTsModelsService, RelationInfo} from '../../../services/graph/GraphJSONtoTsModelsService';
import {DiscriminatorMappingData} from '../../../tsModels/DiscriminatorMappingData';
import {TechnologiesStatsModel} from '../../../tsModels/TechnologiesStatsModel';
import {FramesRestClientService} from '../../../services/graph/FramesRestClientService';
import {Observable} from 'rxjs/Observable';


@Component({
    selector: 'wu-technologies-report',
    templateUrl: 'technologies.report.html'
})
export class TechnologiesReport implements OnInit {
    
    private execID: number;
    private technologiesStats: TechnologiesStatsModel = <TechnologiesStatsModel> {};
    private appGroups : ApplicationGroup[];

    constructor(
        private route: ActivatedRoute,
        private techReportService: TechReportService,
        private appGrpService: ApplicationGroupService,
        private frameService: FramesRestClientService
    ){}
    
    ngOnInit(): void {
        this.route.params.forEach((params: Params) => {
            this.execID = +params['exec'];
        });
                
        this.appGrpService.getAll().toPromise().then(appGroups => this.appGroups = appGroups);
        
        this.fetchTechnologiesStats();
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
