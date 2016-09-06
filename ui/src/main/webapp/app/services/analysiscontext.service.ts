import {Inject, Injectable} from '@angular/core';
import {Headers, Http, RequestOptions, Response} from '@angular/http';
import {Observable} from 'rxjs/Observable';

import {Constants} from "../constants";
import {AnalysisContext} from "windup-services";
import {AbstractService} from "./abtract.service";
import {KeycloakService} from "./keycloak.service";

@Injectable()
export class AnalysisContextService extends AbstractService
{
    private GET_URL = "/analysis-context/get";
    private CREATE_URL = "/analysis-context/create";
    private UPDATE_URL = "/analysis-context/update";

    constructor (private _keycloakService:KeycloakService, private _http: Http) {
        super();
    }

    create(analysisContext: AnalysisContext) {
        let headers = this._keycloakService.defaultHeaders;
        let options = new RequestOptions({ headers: headers });

        headers.append('Content-Type', 'application/json');
        headers.append('Accept', 'application/json');

        let body = JSON.stringify(analysisContext);

        return this._http.put(Constants.REST_BASE + this.CREATE_URL, body, options)
            .map(res => <AnalysisContext> res.json())
            .catch(this.handleError);
    }

    update(analysisContext: AnalysisContext) {
        let headers = this._keycloakService.defaultHeaders;
        let options = new RequestOptions({ headers: headers });
        headers.append('Content-Type', 'application/json');
        headers.append('Accept', 'application/json');

        let body = JSON.stringify(analysisContext);

        return this._http.put(Constants.REST_BASE + this.UPDATE_URL, body, options)
            .map(res => <AnalysisContext> res.json())
            .catch(this.handleError);
    }

    get(id:number) {
        let headers = this._keycloakService.defaultHeaders;
        let options = new RequestOptions({ headers: headers });

        return this._http.get(Constants.REST_BASE + this.GET_URL + "/" + id, options)
            .map(res => <AnalysisContext> res.json())
            .catch(this.handleError);
    }
}