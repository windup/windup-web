import {Injectable} from "@angular/core";
import {Http} from "@angular/http";
import {Observable} from "rxjs";
import {AbstractService} from "../../../services/abtract.service";
import {Constants} from "../../../constants";
import {GraphJSONToModelService} from "../../../services/graph/graph-json-to-model.service";
import {PersistedProjectModelTraversalModel} from "../../../generated/tsModels/PersistedProjectModelTraversalModel";

@Injectable()
export class ApplicationDetailsService extends AbstractService {

    constructor(private _http: Http) {
        super();
    }

    getApplicationDetailsData(executionId: number): Observable<PersistedProjectModelTraversalModel[]> {
        let url = `${Constants.GRAPH_REST_BASE}/graph/application-details/${executionId}`;
        let service = new GraphJSONToModelService();

        return this._http.get(url)
            .map(res => res.json())
            .map(res => <PersistedProjectModelTraversalModel[]>res.map((json) => service.fromJSON(json, this._http)))
            .catch(this.handleError);
    }
}
