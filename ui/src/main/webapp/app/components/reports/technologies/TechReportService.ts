import {Injectable} from '@angular/core';
import {Headers, Http, RequestOptions, Response} from '@angular/http';

import {Constants} from "../../../constants";
import {ApplicationGroup} from "windup-services";
import {AbstractService} from "../../../services/abtract.service";

import {Observable} from 'rxjs/Observable';

// Windup
//import {GraphJSONtoTsModelsService, RelationInfo} from '../../../services/graph/GraphJSONtoTsModelsService';
//import {FramesRestClientService}  from '../../../services/graph/FramesRestClientService';
//import {DiscriminatorMappingData} from '../../../tsModels/DiscriminatorMappingData';

import {GraphJSONToModelService} from '../../../services/graph/graph-json-to-model.service';
/*
import {BaseModel}            from '../../../services/graph/BaseModel';
import {GraphProperty}        from "../../../services/graph/graph-property.decorator";
import {GraphAdjacency}       from "../../../services/graph/graph-adjacency.decorator";
import {DiscriminatorMapping} from "../../../services/graph/discriminator-mapping";
*/

// Models
import {TechnologiesStatsModel} from '../../../tsModels/TechnologiesStatsModel';



@Injectable()
export class TechReportService extends AbstractService
{
    constructor(
        private http: Http,
        ///private graphClient: FramesRestClientService
    ) { super(); }
    
    static WINDUP_REST_URL =     "http://localhost:8080/windup-web-services/rest";
    static DISCR_TECH_STATS =    TechnologiesStatsModel.discriminator; //"TechnologiesStats";
    static INVOKER_URL =         `${TechReportService.WINDUP_REST_URL}/technologyStats/create?exec=`;
    static GRAPH_TECHSTATS_URL = `${TechReportService.WINDUP_REST_URL}/graph/by-type/${TechReportService.DISCR_TECH_STATS}?depth=1`;
    
    
    getStats(execID: number): Observable<TechnologiesStatsModel> 
    {
        ///let service = new GraphJSONtoTsModelsService(DiscriminatorMappingData);
        let service = new GraphJSONToModelService();
        return this.http.get(TechReportService.GRAPH_TECHSTATS_URL + "&exec=" + execID)
            .map((res:Response) => res.json())
            .map((data:TechnologiesStatsModel[]) => <TechnologiesStatsModel><any>service.fromJSON(data[0], this.http))
            .catch(this.handleError);
    }
}

export class StatsItem {
    key: string;
    quantity: number = 0;
    label: string;
}
