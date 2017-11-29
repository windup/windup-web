import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from 'rxjs/Observable';

import {Constants} from "../constants";
import {Configuration, RulesPath} from "../generated/windup-services";
import {AbstractService} from "../shared/abtract.service";
import {Cached} from "../shared/cache.service";

@Injectable()
export class ConfigurationService extends AbstractService {
    private GET_URL = "/configuration";
    private SAVE_URL = "/configuration";
    private CONFIGURATION_RELOAD_URL = '/configuration/reload';

    constructor (private _http: HttpClient) {
        super();
    }

    save(configuration: Configuration): Observable<Configuration> {
        let body = JSON.stringify(configuration);

        return this._http.put<Configuration>(Constants.REST_BASE + this.SAVE_URL, body, this.JSON_OPTIONS);
    }

    @Cached({section: 'configuration', immutable: true})
    get(): Observable<Configuration> {
        return this._http.get<Configuration>(Constants.REST_BASE + this.GET_URL);
    }

    private GET_CUSTOM_RULESETS_URL = "/configuration/custom-rulesets";

    @Cached({section: 'configuration', immutable: true})
    getCustomRulesetPaths(): Observable<RulesPath[]> {
        return this._http.get<RulesPath[]>(Constants.REST_BASE + this.GET_CUSTOM_RULESETS_URL);

    }

    reloadConfigration(): Observable<Configuration> {
        return this._http.post<Configuration>(Constants.REST_BASE + this.CONFIGURATION_RELOAD_URL, null);
    }
}
