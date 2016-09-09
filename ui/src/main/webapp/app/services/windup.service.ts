import {Inject, Injectable} from '@angular/core';
import {Headers, Http, RequestOptions, Response} from '@angular/http';
import {Observable} from 'rxjs/Observable';

import {Constants} from "../constants";
import {RegisteredApplication} from "windup-services";
import {WindupExecution} from "windup-services";
import {AbstractService} from "./abtract.service";
import {KeycloakService} from "./keycloak.service";

@Injectable()
export class WindupService extends AbstractService {
    private EXECUTE_GROUP_PATH = "/windup/executeGroup";
    private GET_STATUS_GROUP_PATH = "/windup/statusGroup/";

    constructor (private _keycloakService:KeycloakService, private _http: Http) {
        super();
    }

    public getStatusGroup(executionID:number):Observable<WindupExecution> {
        let headers = this._keycloakService.defaultHeaders;
        let options = new RequestOptions({ headers: headers });

        let url = Constants.REST_BASE + this.GET_STATUS_GROUP_PATH + executionID;

        return this._http.get(url, options)
            .map(res => <WindupExecution> res.json())
            .catch(this.handleError);
    }

    public executeWindupGroup(groupID:number):Observable<WindupExecution> {
        let headers = this._keycloakService.defaultHeaders;
        let options = new RequestOptions({ headers: headers });

        headers.append('Content-Type', 'application/json');
        var body = JSON.stringify(groupID);

        return this._http.post(Constants.REST_BASE + this.EXECUTE_GROUP_PATH, body, options)
            .map(res => <WindupExecution> res.json())
            .catch(this.handleError);
    }
}