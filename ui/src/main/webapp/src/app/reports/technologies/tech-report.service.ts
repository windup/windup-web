import {Injectable} from "@angular/core";
import {Http} from "@angular/http";
import {Observable} from "rxjs/Observable";

import {ProjectTechnologiesStatsModel} from "../../generated/tsModels/ProjectTechnologiesStatsModel";
import {GraphService} from "../../services/graph.service";
import {GraphJSONToModelService} from "../../services/graph/graph-json-to-model.service";
import {Cached} from "../../shared/cache.service";
import {EjbMessageDrivenModel} from "../../generated/tsModels/EjbMessageDrivenModel";
import {EjbEntityBeanModel} from "../../generated/tsModels/EjbEntityBeanModel";
import {EjbSessionBeanModel} from "../../generated/tsModels/EjbSessionBeanModel";

@Injectable()
export class TechReportService extends GraphService
{
    constructor(http: Http, graphJsonToModelService: GraphJSONToModelService<any>) {
        super(http, graphJsonToModelService);
    }

    @Cached('techReport', null, true)
    getStats(execID: number): Observable<ProjectTechnologiesStatsModel[]>
    {
        return this.getTypeAsArray<ProjectTechnologiesStatsModel>(ProjectTechnologiesStatsModel.discriminator, execID, {
            depth: 2,
            includeInVertices: false
        });
    }

    getEjbMessageDrivenModel(execID: number): Observable<EjbMessageDrivenModel[]> {
        return this.getTypeAsArray<EjbMessageDrivenModel>(EjbMessageDrivenModel.discriminator, execID, {
            depth: 1
        });
    }

    getEjbSessionBeanModel(execID: number, sessionType: string): Observable<EjbSessionBeanModel[]> {
        return this.getTypeAsArray<EjbSessionBeanModel>(EjbSessionBeanModel.discriminator, execID, {
            depth: 1
        },'sessionType', sessionType);
    }

    getEjbEntityBeanModel(execID: number): Observable<EjbEntityBeanModel[]> {
        return this.getTypeAsArray<EjbEntityBeanModel>(EjbEntityBeanModel.discriminator, execID, {
            depth: 1
        });
    }

}

export class StatsItem {
    key: string;
    quantity: number = 0;
    label: string;
}
