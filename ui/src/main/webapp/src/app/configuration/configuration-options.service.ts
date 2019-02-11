import {Injectable} from '@angular/core';
import {Http} from '@angular/http';

import {Constants} from "../constants";
import {AbstractService} from "../shared/abtract.service";
import {ConfigurationOption} from "../model/configuration-option.model";
import {Observable} from 'rxjs';
import {ValidationResult} from "../model/validation-result.model";
import {AdvancedOption} from "../generated/windup-services";
import {Cached} from "../shared/cache.service";
import { map, catchError } from 'rxjs/operators';

@Injectable()
export class ConfigurationOptionsService extends AbstractService {
    private GET_CONFIGURATION_OPTIONS_URL = "/configuration-options";
    private VALIDATE_OPTION_URL = this.GET_CONFIGURATION_OPTIONS_URL + "/validate-option";

    constructor (private _http: Http) {
        super();
    }

    validate(option: AdvancedOption): Observable<ValidationResult> {
        let body = JSON.stringify(option);

        return this._http.post(Constants.REST_BASE + this.VALIDATE_OPTION_URL, body, this.JSON_OPTIONS)
            .pipe(
                map(res => <ValidationResult> res.json()),
                catchError(this.handleError)
            );
    }

    @Cached({section: 'configurationOptions', immutable: true})
    getAll(): Observable<ConfigurationOption[]> {
        return this._http.get(Constants.REST_BASE + this.GET_CONFIGURATION_OPTIONS_URL)
            .pipe(
                map(res => <ConfigurationOption[]> res.json()),
                catchError(this.handleError)
            );
    }
}
