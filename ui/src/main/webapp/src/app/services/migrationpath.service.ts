import {Injectable} from '@angular/core';
import {Headers, Http, RequestOptions} from '@angular/http';

import {Constants} from "../constants";
import {MigrationPath} from "../windup-services";
import {AbstractService} from "../shared/abtract.service";

@Injectable()
export class MigrationPathService extends AbstractService {
    private GET_ALL_URL = "/migration-paths";

    constructor (private _http: Http) {
        super();
    }

    getAll() {
        let headers = new Headers();
        let options = new RequestOptions({ headers: headers });
        return this._http.get(Constants.REST_BASE + this.GET_ALL_URL, options)
            .map(res => <MigrationPath[]> res.json())
            .catch(this.handleError);
    }
}
