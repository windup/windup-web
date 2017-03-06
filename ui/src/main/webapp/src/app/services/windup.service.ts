import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
import {Observable} from 'rxjs/Observable';

import {Constants} from "../constants";
import {WindupExecution} from "windup-services";
import {AbstractService} from "../shared/abtract.service";

@Injectable()
export class WindupService extends AbstractService {
    private EXECUTE_WITH_CONTEXT_PATH = "/windup/execute-with-context";
    private EXECUTIONS_PATH = '/windup/executions';
    private PROJECT_EXECUTIONS_PATH = '/windup/by-project/{projectId}';

    constructor (private _http: Http) {
        super();
    }

    public getExecution(executionID:number):Observable<WindupExecution> {
        let url = Constants.REST_BASE + this.EXECUTIONS_PATH + '/' + executionID;

        return this._http.get(url)
            .map(res => <WindupExecution> res.json())
            .catch(this.handleError);
    }

    public executeWindupWithAnalysisContext(contextId: number): Observable<WindupExecution> {
        let body = JSON.stringify(contextId);

        return this._http.post(Constants.REST_BASE + this.EXECUTE_WITH_CONTEXT_PATH, body, this.JSON_OPTIONS)
            .map(res => <WindupExecution> res.json())
            .catch(this.handleError);
    }

    public getAllExecutions(): Observable<WindupExecution[]> {
        return this._http.get(Constants.REST_BASE + this.EXECUTIONS_PATH)
            .map(res => <WindupExecution[]> res.json())
            .catch(this.handleError);
    }

    public getProjectExecutions(projectId: number): Observable<WindupExecution[]> {
        let url = Constants.REST_BASE + this.PROJECT_EXECUTIONS_PATH.replace('{projectId}', projectId.toString());

        return this._http.get(url)
            .map(res => res.json())
            .catch(this.handleError);
    }

    public cancelExecution(execution: WindupExecution): Observable<any> {
        return this._http.post(Constants.REST_BASE + this.EXECUTIONS_PATH + '/' + execution.id + '/cancel' , null)
            .catch(this.handleError);
    }
}
