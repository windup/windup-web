import {Inject, Injectable} from '@angular/core';
import {Headers, Http, RequestOptions, Response} from '@angular/http';
import {Observable} from 'rxjs/Observable';

import 'rxjs/add/observable/dom/ajax'; // Observable.ajax
import 'rxjs/add/operator/map';

import {DiscriminatorMappingData} from '../../tsModels/DiscriminatorMappingData';
import {DiscriminatorMapping} from './DiscriminatorMappingBFM';
import {GraphJSONtoTsModelsService, RelationInfo} from '../../services/graph/GraphJSONtoTsModelsService';
import {BaseFrameModel} from './BaseFrameModel';
import {Constants} from "../../constants";

/**
 * Facilitates the data flow between a generic REST endpoint for the graph and the calling methods.
 * The purpose is to make the transfer of the objects as easy as possible.
 * Unlike Rexster, this leverages the Windup Frames support for types.
 */
@Injectable()
export class FramesRestClientService
{
    constructor (private http: Http) {}

    static WINDUP_REST_URL = Constants.REST_BASE; //"http://localhost:8080/windup-web-services/rest";
    

    /**
     * This simply returns the data from the graph service.
     */
    //public getObjectsFromGraph <T extends BaseFrameModel> (clazz: { new () : T })  : Observable<T>
    public getObjectsFromGraph <T extends BaseFrameModel> (discr: string, depth: number = 0)  : Observable<T[]>
    {
        //let discr =  DiscriminatorMappingData.getDiscriminatorByModelClass(clazz);
        
        let GRAPH_ENDPOINT_URL  = `${FramesRestClientService.WINDUP_REST_URL}/graph/by-type/${discr}?depth=${depth}`;
        let service = new GraphJSONtoTsModelsService(DiscriminatorMapping);
        return Observable.ajax.getJSON(GRAPH_ENDPOINT_URL)
            .map(data => <T[]> service.fromJSON(data))
            .catch(({ xhr }) => { console.log(xhr.response.message); return Observable.of(null); } );
    }
    
}
