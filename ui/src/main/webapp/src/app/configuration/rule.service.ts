import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

import {Constants} from "../constants";
import {RulesPath, RuleProviderEntity, RulesPathType} from "../generated/windup-services";
import {AbstractService} from "../shared/abtract.service";
import {Observable, from} from "rxjs";
import {FileUploader} from "ng2-file-upload";
import {KeycloakService} from "../core/authentication/keycloak.service";
import {FileUploaderFactory} from "../shared/upload/file-uploader-factory.service";
import {FileUploaderWrapper} from "../shared/upload/file-uploader-wrapper.service";
import {utils} from "../shared/utils";
import { map, catchError, flatMap } from 'rxjs/operators';

@Injectable()
export class RuleService extends AbstractService {
    private static RULES_ROOT = '/rules';

    private GET_ALL_RULE_PROVIDERS_URL= "/rules/allProviders";
    private GET_RULE_PROVIDERS_BY_RULES_PATH_URL= "/rules/by-rules-path/";
    private IS_RULES_PATH_USED = "/rules/is-used-rules-path/{id}";
    private UPLOAD_URL = RuleService.RULES_ROOT + '/upload';
    private DELETE_RULE_URL = RuleService.RULES_ROOT + '/by-rules-path/{id}';


    private _multipartUploader: FileUploaderWrapper;

    constructor (private _http: HttpClient, private _fileUploaderFactory: FileUploaderFactory, private _keycloakService: KeycloakService) {
        super();
        this._multipartUploader = _fileUploaderFactory.create(Constants.REST_BASE + this.UPLOAD_URL, undefined, _keycloakService);
    }

    getMultipartUploader(): FileUploader {
        return this._multipartUploader;
    }

    getAll(): Observable<RuleProviderEntity[]> {
        return this._http.get<RuleProviderEntity[]>(Constants.REST_BASE + this.GET_ALL_RULE_PROVIDERS_URL);
    }

    getByRulesPath(rulesPath: RulesPath): Observable<RuleProviderEntity[]> {
        let url = Constants.REST_BASE + this.GET_RULE_PROVIDERS_BY_RULES_PATH_URL + rulesPath.id;

        return this._http.get<RuleProviderEntity[]>(url);
    }

    checkIfUsedRulesPath(rulesPath: RulesPath): Observable<boolean>
    {
        if (rulesPath.rulesPathType == "SYSTEM_PROVIDED")
            return;

        let url = Constants.REST_BASE + this.IS_RULES_PATH_USED.replace('{id}', rulesPath.id.toString());
        return this._http.get<boolean>(url); 
    }

    uploadRules() {
        return this._keycloakService.getToken()
            .pipe(
                flatMap((token: string) => {
                    this._multipartUploader.setOptions({
                        authToken: 'Bearer ' + token,
                        method: 'POST'
                    });
        
                    const responses = [];
                    const errors = [];
        
                    const promise = new Promise((resolve, reject) => {
                        this._multipartUploader.onCompleteItem = (item, response, status) => {
                            const parsedResponse = utils.parseServerResponse(response);
        
                            if (status == 200) {
                                responses.push(parsedResponse);
                            } else {
                                errors.push(parsedResponse);
                            }
                        };
        
                        this._multipartUploader.onCompleteAll = () => {
                            resolve(responses);
                        };
        
                        this._multipartUploader.onErrorItem = (item, response) => {
                            reject(utils.parseServerResponse(response));
                        };
                    });
        
                    this._multipartUploader.uploadAll();
        
                    return from(promise);
                })
            );
    }

    deleteRule(rulePath: RulesPath): Observable<any> {
        let url = Constants.REST_BASE + this.DELETE_RULE_URL.replace('{id}', rulePath.id.toString());

        return this._http.delete(url);
    }
}
