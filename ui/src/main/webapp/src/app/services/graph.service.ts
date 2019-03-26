import {AbstractService} from "../shared/abtract.service";
import {Constants} from "../constants";
import {HttpClient, HttpParams} from "@angular/common/http";
import {Injectable} from "@angular/core";
import {Observable} from "rxjs";
import {GraphJSONToModelService} from "./graph/graph-json-to-model.service";
import {BaseModel} from "./graph/base.model";
import { map, catchError } from 'rxjs/operators';

@Injectable()
export class GraphService extends AbstractService {
    private static WINDUP_REST_URL = Constants.GRAPH_REST_BASE;
    private static GRAPH_ENDPOINT_URL = `${GraphService.WINDUP_REST_URL}/graph/{execID}/by-type/{type}`;

    constructor(protected _http: HttpClient, protected _graphJsonToModelService: GraphJSONToModelService<any>) {
        super();
    }

    protected getSingleType<T extends BaseModel>(type: string, execID: number, options?: GraphEndpointOptions): Observable<T> {
        let service = this._graphJsonToModelService;

        return this.prepareGetRequest(type, execID,  options)
            .pipe(
                map(data => {
                    if (!Array.isArray(data) || data.length == 0) {
                        throw new Error("No items returned");
                    }
    
                    return <T>service.fromJSON(data[0]);
                })
            );
    }

    protected getTypeAsArray<T extends BaseModel>(type: string, execID: number, options?: GraphEndpointOptions): Observable<T[]> {
        let service = this._graphJsonToModelService;

        return this.prepareGetRequest(type, execID, options)
            .pipe(
                map(data => {
                    if (!Array.isArray(data)) {
                        throw new Error("No items returned");
                    }
    
                    return <T[]>service.fromJSONarray(data);
                })
            );
    }

    protected prepareGetRequest(type: string, execID: number, options?: GraphEndpointOptions): Observable<any> {
        let params: HttpParams = new HttpParams();
        let url = GraphService.GRAPH_ENDPOINT_URL
            .replace('{execID}', execID.toString())
            .replace('{type}', type);

        if (options) {
            Object.keys(options).forEach(key => {
                params.append(key, options[key]);
            });
        }

        return this._http.get(url, {
            params
        });
    }

    public getPropertiesString(...properties: string[]): string {
        return properties.join(',');
    }
}

export interface GraphEndpointOptions {
    depth?: number;
    includeInVertices?: boolean;
    dedup?: boolean;
    in?: string;
    out?: string;
    [property: string]: any;
}
