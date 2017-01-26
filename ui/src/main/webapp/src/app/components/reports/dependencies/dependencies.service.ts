import {Injectable} from "@angular/core";
import {Http, Response} from "@angular/http";
import {Observable} from "rxjs";
import {AbstractService} from "../../../services/abtract.service";
import {DependenciesReportModel} from "../../../generated/tsModels/DependenciesReportModel";
import {Constants} from "../../../constants";

import {GraphJSONToModelService} from '../../../../app/services/graph/graph-json-to-model.service';

@Injectable()
export class DependenciesService extends AbstractService {

    constructor(
        private _http: Http
    ) { super(); }

    /**
     * Returns the DependenciesReportModel
     */
    getDepsReportModel(executionId: number): Observable<DependenciesReportModel[]> {
        let service = new GraphJSONToModelService();
        let url = `${Constants.GRAPH_REST_BASE}/graph/${executionId}/by-type/` + DependenciesReportModel.discriminator + "?depth=2";
        return this._http.get(url)
            .map((res:Response) => res.json())
            .map((data:any) => {
                if (!Array.isArray(data) || data.length == 0) {
                    throw new Error("No items returned, URL: " + url);
                }
                return <DependenciesReportModel[]>service.fromJSONarray(data, this._http, DependenciesReportModel);
            })
            .catch(this.handleError);
    }

}
