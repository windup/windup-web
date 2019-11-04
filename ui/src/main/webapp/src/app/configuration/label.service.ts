import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

import {Constants} from "../constants";
import {LabelsPath, LabelProviderEntity, MigrationProject} from "../generated/windup-services";
import {AbstractService} from "../shared/abtract.service";
import {Observable, from} from "rxjs";
import {FileUploader} from "ng2-file-upload";
import {KeycloakService} from "../core/authentication/keycloak.service";
import {FileUploaderFactory} from "../shared/upload/file-uploader-factory.service";
import {FileUploaderWrapper} from "../shared/upload/file-uploader-wrapper.service";
import {utils} from "../shared/utils";
import { map, catchError, flatMap } from 'rxjs/operators';

@Injectable()
export class LabelService extends AbstractService {
    private static RULES_ROOT = '/labels';

    private GET_ALL_RULE_PROVIDERS_URL= "/labels/allProviders";
    private GET_RULE_PROVIDERS_BY_RULES_PATH_URL= "/labels/by-labels-path/";
    private IS_RULES_PATH_USED = "/labels/is-used-labels-path/{id}";
    private UPLOAD_URL = LabelService.RULES_ROOT + '/upload';
    private UPLOAD_BY_PROJECT_URL = LabelService.RULES_ROOT + '/upload/by-project/{projectId}';
    private DELETE_RULE_URL = LabelService.RULES_ROOT + '/by-labels-path/{id}';


    private _multipartUploader: FileUploaderWrapper;

    constructor (private _http: HttpClient, private _fileUploaderFactory: FileUploaderFactory, private _keycloakService: KeycloakService) {
        super();
        this._multipartUploader = _fileUploaderFactory.create(Constants.REST_BASE + this.UPLOAD_URL, undefined, _keycloakService);
    }

    getMultipartUploader(): FileUploader {
        return this._multipartUploader;
    }

    getAll(): Observable<LabelProviderEntity[]> {
        return this._http.get<LabelProviderEntity[]>(Constants.REST_BASE + this.GET_ALL_RULE_PROVIDERS_URL);
    }

    getByLabelsPath(labelsPath: LabelsPath): Observable<LabelProviderEntity[]> {
        let url = Constants.REST_BASE + this.GET_RULE_PROVIDERS_BY_RULES_PATH_URL + labelsPath.id;

        return this._http.get<LabelProviderEntity[]>(url);
    }

    checkIfUsedLabelsPath(labelsPath: LabelsPath): Observable<boolean>
    {
        if (labelsPath.labelsPathType == "SYSTEM_PROVIDED")
            return;

        let url = Constants.REST_BASE + this.IS_RULES_PATH_USED.replace('{id}', labelsPath.id.toString());
        return this._http.get<boolean>(url); 
    }

    uploadLabelsToProject(project: MigrationProject) {
        this._multipartUploader.setOptions({
            ...this._multipartUploader.options,
            url: Constants.REST_BASE + this.UPLOAD_BY_PROJECT_URL.replace('{projectId}', project.id.toString())
        });

        return this.uploadLabels();
    }

    uploadGlobalLabels() {
        this._multipartUploader.setOptions({
            ...this._multipartUploader.options,
            url: Constants.REST_BASE + this.UPLOAD_URL
        });

        return this.uploadLabels();
    }

    uploadLabels() {
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

    deleteLabel(labelPath: LabelsPath): Observable<any> {
        let url = Constants.REST_BASE + this.DELETE_RULE_URL.replace('{id}', labelPath.id.toString());

        return this._http.delete(url);
    }
}
