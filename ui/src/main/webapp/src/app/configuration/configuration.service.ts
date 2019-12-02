import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

import {Constants} from "../constants";
import {Configuration, RulesPath, LabelsPath} from "../generated/windup-services";
import {AbstractService} from "../shared/abtract.service";
import {Cached} from "../shared/cache.service";
import { map, catchError } from 'rxjs/operators';
import { isNumber } from 'util';

@Injectable()
export class ConfigurationService extends AbstractService {
    private GET_URL = "/configuration";
    private GET_BY_PROJECT_URL = "/configuration/by-project/{projectId}";
    private SAVE_URL = "/configuration/{id}";
    private CONFIGURATION_RELOAD_URL = '/configuration/{id}/reload';
    private GET_CUSTOM_RULESETS_URL = "/configuration/{id}/custom-rulesets";
    private GET_CUSTOM_LABELSETS_URL = "/configuration/{id}/custom-labelsets";

    constructor (private _http: HttpClient) {
        super();
    }

    save(configuration: Configuration): Observable<Configuration> {
        let body = JSON.stringify(configuration);

        return this._http.put<Configuration>(Constants.REST_BASE + this.SAVE_URL.replace("{id}", configuration.id.toString()), body, this.JSON_OPTIONS);
    }

    @Cached({section: 'configuration', immutable: true})
    get(): Observable<Configuration> {
        return this._http.get<Configuration>(Constants.REST_BASE + this.GET_URL);
    }

    @Cached('configuration')
    getByProjectId(projectId: number): Observable<Configuration> {
        if (!isNumber(projectId)) {
            throw new Error("Not a project ID: " + projectId);
        }
        return this._http.get<Configuration>(Constants.REST_BASE + this.GET_BY_PROJECT_URL.replace("{projectId}", projectId.toString()));
    }

    @Cached({section: 'configuration', immutable: true})
    getCustomRulesetPathsByConfigurationId(id: number): Observable<RulesPath[]> {
        if (!isNumber(id)) {
            throw new Error("Not a configuration ID: " + id);
        }

        return this._http.get<RulesPath[]>(Constants.REST_BASE + this.GET_CUSTOM_RULESETS_URL.replace("{id}", id.toString()));
    }

    @Cached({section: 'configuration', immutable: true})
    getCustomLabelsetPathsByConfigurationId(id: number): Observable<LabelsPath[]> {
        if (!isNumber(id)) {
            throw new Error("Not a configuration ID: " + id);
        }

        return this._http.get<LabelsPath[]>(Constants.REST_BASE + this.GET_CUSTOM_LABELSETS_URL.replace("{id}", id.toString()));
    }

    reloadConfigration(id: number): Observable<Configuration> {
        if (!isNumber(id)) {
            throw new Error("Not a configuration ID: " + id);
        }

        return this._http.post<Configuration>(Constants.REST_BASE + this.CONFIGURATION_RELOAD_URL.replace("{id}", id.toString()), null);
    }
}
