import {Inject, Injectable} from '@angular/core';
import {Headers, Http, RequestOptions, Response} from '@angular/http';
import {Observable} from 'rxjs/Observable';

import {Constants} from "../constants";
import {AbstractService} from "./abtract.service";
import {KeycloakService} from "./keycloak.service";

@Injectable()
export class FileService extends AbstractService {
    private PATH_EXISTS_URL = "/file/pathExists";

    constructor (private _keycloakService:KeycloakService, private _http: Http) {
        super();
    }

    pathExists(path:string) {
        let headers = this._keycloakService.defaultHeaders;
        let options = new RequestOptions({ headers: headers });
        headers.append('Content-Type', 'application/json');
        headers.append('Accept', 'application/json');

        return this._http.post(Constants.REST_BASE + this.PATH_EXISTS_URL, path, options)
            .map(res => <boolean> res.json())
            .catch(this.handleError);
    }
}