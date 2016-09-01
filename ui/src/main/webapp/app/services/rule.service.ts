import {Injectable} from '@angular/core';
import {Http, Response} from '@angular/http';
import {Observable} from 'rxjs/Observable';

import {Constants} from "../constants";
import {RuleProviderEntity} from "windup-services";
import {RulesPath} from "windup-services";

@Injectable()
export class RuleService
{
    private GET_ALL_RULE_PROVIDERS_URL= "/rules/allProviders";
    private GET_RULE_PROVIDERS_BY_RULES_PATH_URL= "/rules/by-rules-path/";

    constructor (private _http: Http, private _constants: Constants) {}

    getAll() {
        return this._http.get(this._constants.REST_BASE + this.GET_ALL_RULE_PROVIDERS_URL)
            .map(res => <RuleProviderEntity[]> res.json())
            .catch(this.handleError);
    }

    getByRulesPath(rulesPath:RulesPath) {
        let url = this._constants.REST_BASE + this.GET_RULE_PROVIDERS_BY_RULES_PATH_URL + rulesPath.id;

        return this._http.get(url)
            .map(res => <RuleProviderEntity[]> res.json())
            .catch(this.handleError);
    }

    private handleError(error: Response) {
        // in a real world app, we may send the error to some remote logging infrastructure
        // instead of just logging it to the console
        console.error("Service error: (" + typeof error + ") " + error);
        if (typeof error === 'object')
            console.error(JSON.stringify(error));
        var json;
        try {
            json = error.json();
            console.error("Service error - JSON: " + JSON.stringify(json));
        }
        catch (ex) {
            console.error("Service error - can't JSON: " + (<SyntaxError>ex).message);
        }
        return Observable.throw(json);
    }
}