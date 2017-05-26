import {Injectable} from '@angular/core';
import {Http} from '@angular/http';

import {Constants} from "../constants";
import {RulesPath, RuleProviderEntity} from "../generated/windup-services";
import {AbstractService} from "../shared/abtract.service";
import {Observable} from "rxjs";
import {FileUploader} from "ng2-file-upload";
import {KeycloakService} from "../core/authentication/keycloak.service";
import {FileUploaderFactory} from "../shared/upload/file-uploader-factory.service";
import {FileUploaderWrapper} from "../shared/upload/file-uploader-wrapper.service";

@Injectable()
export class RuleService extends AbstractService {
    private static RULES_ROOT = '/rules';

    private GET_ALL_RULE_PROVIDERS_URL= "/rules/allProviders";
    private GET_RULE_PROVIDERS_BY_RULES_PATH_URL= "/rules/by-rules-path/";
    private UPLOAD_URL = RuleService.RULES_ROOT + '/upload';
    private DELETE_RULE_URL = RuleService.RULES_ROOT + '/by-rules-path/{id}';


    private _multipartUploader: FileUploaderWrapper;

    constructor (private _http: Http, private _fileUploaderFactory: FileUploaderFactory, private _keycloakService: KeycloakService) {
        super();
        this._multipartUploader = _fileUploaderFactory.create(Constants.REST_BASE + this.UPLOAD_URL);
    }

    getMultipartUploader(): FileUploader {
        return this._multipartUploader;
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

    uploadRules() {
        return this._keycloakService.getToken().flatMap((token: string) => {
            this._multipartUploader.setOptions({
                authToken: 'Bearer ' + token,
                method: 'POST'
            });

            const responses = [];
            const errors = [];

            const promise = new Promise((resolve, reject) => {
                this._multipartUploader.onCompleteItem = (item, response, status) => {
                    if (status == 200) {
                        responses.push(JSON.parse(response));
                    } else {
                        errors.push(JSON.parse(response));
                    }
                };

                this._multipartUploader.onCompleteAll = () => {
                    resolve(responses);
                };

                this._multipartUploader.onErrorItem = (item, response) => {
                    reject(JSON.parse(response));
                };
            });

            this._multipartUploader.uploadAll();

            return Observable.fromPromise(promise);
        });
    }

    deleteRule(rulePath: RulesPath): Observable<any> {
        let url = Constants.REST_BASE + this.DELETE_RULE_URL.replace('{id}', rulePath.id.toString());

        return this._http.delete(url);
    }
}
