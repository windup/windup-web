import {Injectable} from '@angular/core';
import {Http, RequestOptions, Response} from '@angular/http';
import {Observable} from 'rxjs/Observable';

import {Constants} from "../constants";
import {RuleProviderEntity} from "windup-services";
import {RulesPath} from "windup-services";
import {KeycloakService} from "./keycloak.service";
import {AbstractService} from "./abtract.service";

@Injectable()
export class RuleService extends AbstractService {
    private GET_ALL_RULE_PROVIDERS_URL= "/rules/allProviders";
    private GET_RULE_PROVIDERS_BY_RULES_PATH_URL= "/rules/by-rules-path/";

    constructor (private _keycloakService:KeycloakService, private _http: Http) {
        super();
    }

    getAll() {
        let headers = this._keycloakService.defaultHeaders;
        let options = new RequestOptions({ headers: headers });
        return this._http.get(Constants.REST_BASE + this.GET_ALL_RULE_PROVIDERS_URL, options)
            .map(res => <RuleProviderEntity[]> res.json())
            .catch(this.handleError);
    }

    getByRulesPath(rulesPath:RulesPath) {
        let headers = this._keycloakService.defaultHeaders;
        let options = new RequestOptions({ headers: headers });

        let url = Constants.REST_BASE + this.GET_RULE_PROVIDERS_BY_RULES_PATH_URL + rulesPath.id;

        return this._http.get(url, options)
            .map(res => <RuleProviderEntity[]> res.json())
            .catch(this.handleError);
    }
}