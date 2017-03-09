import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
import {Observable} from 'rxjs/Observable';

import {Constants} from "../constants";
import {WindupExecution} from "windup-services";
import {AbstractService} from "../shared/abtract.service";
import {Cached, CacheServiceInstance} from "../shared/cache.service";
import {AnalysisContext} from "windup-services";
import {MigrationProject} from "windup-services";

@Injectable()
export class WindupService extends AbstractService {
    private EXECUTE_WITH_CONTEXT_PATH = "/windup/execute-with-context/{projectId}";
    private EXECUTIONS_PATH = '/windup/executions';
    private PROJECT_EXECUTIONS_PATH = '/windup/by-project/{projectId}';

    constructor (private _http: Http) {
        super();
    }

    /**
     * When execution is COMPLETED or FAILED it can be cached and treated as immutable
     *
     * @param execution {WindupExecution}
     * @returns {boolean}
     */
    static cacheExecution = (execution: WindupExecution): boolean => {
        return execution.state === "COMPLETED" || execution.state === "FAILED";
    };

    static cacheExecutionList = (executions: WindupExecution[]): boolean => {
        return executions.find(execution => !WindupService.cacheExecution(execution)) == null;
    }

    @Cached({section: 'execution', immutable: true, cacheItemCallback: WindupService.cacheExecution})
    public getExecution(executionID:number):Observable<WindupExecution> {
        let url = Constants.REST_BASE + this.EXECUTIONS_PATH + '/' + executionID;

        return this._http.get(url)
            .map(res => <WindupExecution> res.json())
            .catch(this.handleError);
    }

    /**
     * Executes project context.projectId as per given context.
     * Clones the context for the execution and creates a new one with projectId == null.
     * See the endpoint.
     */
    public executeWindupWithAnalysisContext(context: AnalysisContext, project: MigrationProject): Observable<WindupExecution> {
        let body = JSON.stringify(context);
        let url = Constants.REST_BASE + this.EXECUTE_WITH_CONTEXT_PATH.replace('{projectId}', project.id.toString());

        return this._http.post(url, body, this.JSON_OPTIONS)
            .map(res => <WindupExecution> res.json())
            .do(res => {
                CacheServiceInstance.getSection('execution').clear();
            })
            .catch(this.handleError);
    }

    @Cached({section: 'execution', cacheItemCallback: WindupService.cacheExecutionList})
    public getAllExecutions(): Observable<WindupExecution[]> {
        return this._http.get(Constants.REST_BASE + this.EXECUTIONS_PATH)
            .map(res => <WindupExecution[]> res.json())
            .catch(this.handleError);
    }

    @Cached({section: 'execution', cacheItemCallback: WindupService.cacheExecutionList})
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
