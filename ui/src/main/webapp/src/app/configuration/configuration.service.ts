import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
import {Observable} from 'rxjs/Observable';

import {Constants} from "../constants";
import {Configuration, RulesPath} from "windup-services";
import {AbstractService} from "../shared/abtract.service";

@Injectable()
export class ConfigurationService extends AbstractService {
    private GET_URL = "/configuration";
    private SAVE_URL = "/configuration";
    private CONFIGURATION_RELOAD_URL = '/configuration/reload';

    constructor (private _http: Http) {
        super();
    }

    save(configuration: Configuration): Observable<Configuration> {
        let body = JSON.stringify(configuration);

        return this._http.put(Constants.REST_BASE + this.SAVE_URL, body, this.JSON_OPTIONS)
            .map(res => <Configuration> res.json())
            .catch(this.handleError);
    }

    get(): Observable<Configuration> {
        return this._http.get(Constants.REST_BASE + this.GET_URL)
            .map(res => <Configuration> res.json())
            .catch(this.handleError);
    }

    private GET_CUSTOM_RULESETS_URL = "/configuration/custom-rulesets";

    getCustomRulesetPaths(): Observable<RulesPath[]> {
        return this._http.get(Constants.REST_BASE + this.GET_CUSTOM_RULESETS_URL)
            .map(res => <RulesPath[]> res.json())
            .catch(this.handleError);

    }

    reloadConfigration(): Observable<Configuration> {
        return this._http.post(Constants.REST_BASE + this.CONFIGURATION_RELOAD_URL, null)
            .map(res => res.json())
            .catch(this.handleError);
    }
}
