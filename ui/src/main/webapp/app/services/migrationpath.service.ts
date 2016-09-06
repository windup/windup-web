import {Inject, Injectable} from '@angular/core';
import {Headers, Http, RequestOptions, Response} from '@angular/http';
import {Observable} from 'rxjs/Observable';

import {Constants} from "../constants";
import {MigrationPath} from "windup-services";
import {AbstractService} from "./abtract.service";
import {KeycloakService} from "./keycloak.service";

@Injectable()
export class MigrationPathService extends AbstractService {
    private GET_ALL_URL = "/migration-paths";

    constructor (private _keycloakService:KeycloakService, private _http: Http) {
        super();
    }

    getAll() {
        let headers = this._keycloakService.defaultHeaders;
        let options = new RequestOptions({ headers: headers });
        return this._http.get(Constants.REST_BASE + this.GET_ALL_URL, options)
            .map(res => <MigrationPath[]> res.json())
            .catch(this.handleError);
    }
}