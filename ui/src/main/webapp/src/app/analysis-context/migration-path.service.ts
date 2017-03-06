import {Injectable} from '@angular/core';
import {Http} from '@angular/http';

import {Constants} from "../constants";
import {MigrationPath} from "windup-services";
import {AbstractService} from "../shared/abtract.service";
import {Observable} from "rxjs";

@Injectable()
export class MigrationPathService extends AbstractService {
    private GET_ALL_URL = "/migration-paths";

    constructor (private _http: Http) {
        super();
    }

    getAll(): Observable<MigrationPath[]> {
        return this._http.get(Constants.REST_BASE + this.GET_ALL_URL,)
            .map(res => <MigrationPath[]> res.json())
            .catch(this.handleError);
    }
}
