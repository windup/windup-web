import {Injectable} from "@angular/core";
import {Http, Response} from "@angular/http";
import {Constants} from "../../../constants";
import {AbstractService} from "../../../services/abtract.service";
import {Observable} from "rxjs/Observable";

// Windup
import {GraphJSONToModelService} from "../../../services/graph/graph-json-to-model.service";

// Models
import {TechnologiesStatsModel} from "../../../generated/tsModels/TechnologiesStatsModel";
import {ProjectTechnologiesStatsModel} from "../../../generated/tsModels/ProjectTechnologiesStatsModel";


@Injectable()
export class TechReportService extends AbstractService
{
    constructor(
        private http: Http
    ) { super(); }

    static WINDUP_REST_URL = Constants.REST_SERVER + "/windup-web-services/rest-furnace"; //"http://localhost:8080/
    static DISCR_TECH_STATS =    ProjectTechnologiesStatsModel.discriminator; //"TechnologiesStats";
    static INVOKER_URL =         `${TechReportService.WINDUP_REST_URL}/technologyStats/create?exec=`;
    static GRAPH_TECHSTATS_URL = `${TechReportService.WINDUP_REST_URL}/graph/#{execID}/by-type/${TechReportService.DISCR_TECH_STATS}?depth=2&includeInVertices=false`;


    getStats(execID: number): Observable<ProjectTechnologiesStatsModel[]>
    {
        let service = new GraphJSONToModelService();
        let url = TechReportService.GRAPH_TECHSTATS_URL.replace(/#\{execID\}/, ""+execID);
        return this.http.get(url)
            .map((res:Response) => (res.json()))
            .map((data:any) => {
                if (!Array.isArray(data) || data.length == 0) {
                    throw new Error("No items returned, URL: " + url);
                }

                return service.fromJSONarray(data, this.http);
            })
            .catch( (error, caught) => Observable.throw(error));
    }
 }

export class StatsItem {
    key: string;
    quantity: number = 0;
    label: string;
}
