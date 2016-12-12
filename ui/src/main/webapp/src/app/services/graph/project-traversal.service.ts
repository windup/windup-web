import {Injectable} from "@angular/core";
import {Http} from "@angular/http";
import {Observable} from "rxjs";
import {AbstractService} from "../abtract.service";
import {Constants} from "../../constants";
import {GraphJSONToModelService} from "./graph-json-to-model.service";
import {PersistedProjectModelTraversalModel} from "../../generated/tsModels/PersistedProjectModelTraversalModel";

@Injectable()
export class ProjectTraversalService extends AbstractService {

    constructor(private _http: Http) {
        super();
    }

    getRootTraversals(executionId: number, traversalType:string): Observable<PersistedProjectModelTraversalModel[]> {
        let url = `${Constants.GRAPH_REST_BASE}/graph/project-traversal/${executionId}/by-traversal-type/${traversalType}`;
        let service = new GraphJSONToModelService();

        return this._http.get(url)
            .map(res => res.json())
            .map(res => <PersistedProjectModelTraversalModel[]>res.map((json) => service.fromJSON(json, this._http)))
            .catch(this.handleError);
    }
}
