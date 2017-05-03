import {Injectable} from '@angular/core';
import {Http} from '@angular/http';

import {Constants} from "../constants";
import {RulesPath, RuleProviderEntity} from "../generated/windup-services";
import {AbstractService} from "../shared/abtract.service";
import {Observable} from "rxjs";

@Injectable()
export class RuleService extends AbstractService {
    private GET_ALL_RULE_PROVIDERS_URL= "/rules/allProviders";
    private GET_RULE_PROVIDERS_BY_RULES_PATH_URL= "/rules/by-rules-path/";

    constructor (private _http: Http) {
        super();
    }

    getAll(): Observable<RuleProviderEntity[]> {
        return this._http.get(Constants.REST_BASE + this.GET_ALL_RULE_PROVIDERS_URL)
            .map(res => <RuleProviderEntity[]> res.json())
            .catch(this.handleError);
    }

    getByRulesPath(rulesPath: RulesPath): Observable<RuleProviderEntity[]> {
        let url = Constants.REST_BASE + this.GET_RULE_PROVIDERS_BY_RULES_PATH_URL + rulesPath.id;

        return this._http.get(url)
            .map(res => <RuleProviderEntity[]> res.json())
            .catch(this.handleError);
    }
}
