import {Injectable} from '@angular/core';
import {Headers, Http, RequestOptions} from '@angular/http';
import {Observable} from 'rxjs/Observable';

import {Constants} from "../constants";
import {Configuration} from "windup-services";
import {AbstractService} from "./abtract.service";

@Injectable()
export class ConfigurationService extends AbstractService {
    private GET_URL = "/configuration";
    private SAVE_URL = "/configuration";

    constructor (private _http: Http) {
        super();
    }

    save(configuration: Configuration):Observable<Configuration> {
        let headers = new Headers();
        let options = new RequestOptions({ headers: headers });
        headers.append('Content-Type', 'application/json');
        headers.append('Accept', 'application/json');

        let body = JSON.stringify(configuration);

        return this._http.put(Constants.REST_BASE + this.SAVE_URL, body, options)
            .map(res => <Configuration> res.json())
            .catch(this.handleError);
    }

    get() {
        let headers = new Headers();
        let options = new RequestOptions({ headers: headers });

        return this._http.get(Constants.REST_BASE + this.GET_URL, options)
            .map(res => <Configuration> res.json())
            .catch(this.handleError);
    }
}