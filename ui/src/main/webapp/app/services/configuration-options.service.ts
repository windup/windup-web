import {Injectable} from '@angular/core';
import {Headers, Http, RequestOptions} from '@angular/http';

import {Constants} from "../constants";
import {AbstractService} from "./abtract.service";
import {ConfigurationOption} from "../model/configuration-option.model";

@Injectable()
export class ConfigurationOptionsService extends AbstractService {
    private GET_CONFIGURATION_OPTIONS_URL = "/configuration-options";

    constructor (private _http: Http) {
        super();
    }

    getAll() {
        let headers = new Headers();
        let options = new RequestOptions({ headers: headers });

        return this._http.get(Constants.REST_BASE + this.GET_CONFIGURATION_OPTIONS_URL, options)
            .map(res => <ConfigurationOption[]> res.json())
            .catch(this.handleError);
    }
}