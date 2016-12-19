import {Injectable} from "@angular/core";
import {Http, Response} from "@angular/http";
import {Observable} from "rxjs";
import {AbstractService} from "../../../services/abtract.service";
import {BaseModel} from '../../../../app/services/graph/base.model';
import {ProjectDependencyModel} from "../../../generated/tsModels/ProjectDependencyModel";
import {WindupConfigurationModel} from "../../../generated/tsModels/WindupConfigurationModel";
import {DependenciesReportModel} from "../../../generated/tsModels/DependenciesReportModel";
import {ProjectModel} from "../../../generated/tsModels/ProjectModel";
import {Constants} from "../../../constants";

// Windup
import {GraphJSONToModelService} from '../../../../app/services/graph/graph-json-to-model.service';

let SHARED_LIBS_UNIQUE_ID = "<shared-libs>";

@Injectable()
export class DependenciesService extends AbstractService
    {
    private static DEPS_URL = 'dependencies';

    constructor(
        private _http: Http
    ) { super(); }

    /**
     * Returns given models from the graph.
     */
    getModel <T extends BaseModel> (executionId: number, clazz: typeof BaseModel): Observable<T[]> {
        let service = new GraphJSONToModelService();
        let url = `${Constants.GRAPH_REST_BASE}/graph/${executionId}/by-type/` + (clazz).name + "?depth=1";
        return this._http.get(url)
            .map((res:Response) => res.json())
            .map((data:any) => {
                if (!Array.isArray(data) || data.length == 0) {
                    throw new Error("No items returned, URL: " + url);
                }
                let models = service.fromJSONarray(data, this._http);
                return Observable.of(models);
            })
            .catch(this.handleError);
    }

    /**
     * Returns the DependenciesReportModel
     */
    getDepsReportModel(executionId: number): Observable<DependenciesReportModel> {
        let service = new GraphJSONToModelService();
        let url = `${Constants.GRAPH_REST_BASE}/graph/${executionId}/by-type/` + DependenciesReportModel.discriminator + "?depth=1";
        return this._http.get(url)
            .map((res:Response) => res.json())
            .map((data:any) => {
                if (!Array.isArray(data) || data.length == 0) {
                    throw new Error("No items returned, URL: " + url);
                }
                let reportModel = <DependenciesReportModel>service.fromJSONarray(data, this._http, DependenciesReportModel)[0];
                console.log("reportModel: ", reportModel);
                return reportModel;
            })
            .catch(this.handleError);
    }

    /**
     * Returns the WindupConfigurationModel
     */
    getWindupConfiguration(executionId: number): Observable<WindupConfigurationModel> {
        let service = new GraphJSONToModelService();
        let url = `${Constants.GRAPH_REST_BASE}/graph/${executionId}/by-type/` + WindupConfigurationModel.discriminator + "?depth=1";
        return this._http.get(url)
            .map((res:Response) => res.json())
            .map((data:any) => {
                if (!Array.isArray(data) || data.length == 0) {
                    throw new Error("No items returned, URL: " + url);
                }
                let windupConfig = <WindupConfigurationModel>service.fromJSONarray(data, this._http)[0];
                return windupConfig;
            })
            .catch(this.handleError);
    }

    /**
     * Returns an array of root projects.
     */
    getRootProjects(executionId: number): Observable<ProjectModel[]> {
        ///return this._http.get(`${Constants.GRAPH_REST_BASE}/reports/${executionId}/${DependenciesService.DEPS_URL}`)
        //return this._http.get(`${Constants.GRAPH_REST_BASE}/graph/${executionId}/` + ProjectDependencyModel.discriminator)

        let service = new GraphJSONToModelService();
        let url = `${Constants.GRAPH_REST_BASE}/graph/${executionId}/by-type/` + ProjectModel.discriminator + "?depth=1";
        return this._http.get(url)
            .map((res:Response) => res.json())
            .map((data:any) => {
                console.debug("Data items: ", data);
                if (!Array.isArray(data) || data.length == 0) {
                    throw new Error("No items returned, URL: " + url);
                }
                let projects = <ProjectModel[]>service.fromJSONarray(data, this._http);
                //projects = projects.filter((project: ProjectModel) => project.parentProject == null)
                ///projects.forEach(p => Object.getPrototypeOf(p).constructor = ProjectModel); // JS experiment
                return projects;
            })
            .catch(this.handleError);
    }
}
