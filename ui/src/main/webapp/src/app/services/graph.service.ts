import {AbstractService} from "./abtract.service";
import {Constants} from "../constants";
import {Http, URLSearchParams} from "@angular/http";
import {Injectable} from "@angular/core";
import {Observable} from "rxjs";
import {GraphJSONToModelService} from "./graph/graph-json-to-model.service";
import {BaseModel} from "./graph/base.model";

@Injectable()
export class GraphService extends AbstractService {
    private static WINDUP_REST_URL = Constants.REST_SERVER + "/windup-web-services/rest-furnace";
    private static GRAPH_ENDPOINT_URL = `${GraphService.WINDUP_REST_URL}/graph/{execID}/by-type/{type}`;

    constructor(private _http: Http) {
        super();
    }

    protected getSingleType<T extends BaseModel>(type: string, execID: number, options?: GraphEndpointOptions): Observable<T> {
        let service = new GraphJSONToModelService();

        return this.prepareGetRequest(type, execID,  options)
            .map(data => {
                if (!Array.isArray(data) || data.length == 0) {
                    throw new Error("No items returned");
                }

                return <T>service.fromJSON(data[0], this._http);
            })
            .catch(this.handleError);
    }

    protected getTypeAsArray<T extends BaseModel>(type: string, execID: number, options?: GraphEndpointOptions): Observable<T[]> {
        let service = new GraphJSONToModelService();

        return this.prepareGetRequest(type,execID, options)
            .map(data => {
                if (!Array.isArray(data)) {
                    throw new Error("No items returned");
                }

                return <T[]>service.fromJSONarray(data,  this._http);
            });
    }

    protected prepareGetRequest(type: string, execID: number, options?: GraphEndpointOptions): Observable<any> {
        let params: URLSearchParams = new URLSearchParams();
        let url = GraphService.GRAPH_ENDPOINT_URL
            .replace('{execID}', execID.toString())
            .replace('{type}', type);

        Object.keys(options).forEach(key => {
            params.set(key, options[key]);
        });

        return this._http.get(url, {
            search: params
        })
            .map(res => res.json());
    }
}

export interface GraphEndpointOptions {
    depth?: number;
    includeInVertices?: boolean;
}
