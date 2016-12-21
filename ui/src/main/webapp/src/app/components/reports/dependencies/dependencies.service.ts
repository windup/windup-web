import {Injectable} from "@angular/core";
import {Http, Response} from "@angular/http";
import {Observable} from "rxjs";
import {AbstractService} from "../../../services/abtract.service";
import {ProjectDependencyModel} from "../../../generated/tsModels/ProjectDependencyModel";
import {ProjectModel} from "../../../generated/tsModels/ProjectModel";
import {Constants} from "../../../constants";

// Windup
import {GraphJSONToModelService} from '../../../../app/services/graph/graph-json-to-model.service';

@Injectable()
export class DependenciesService extends AbstractService
    {
    private static DEPS_URL = 'dependencies';

    constructor(
        private _http: Http
    ) { super(); }

    /**
     * Returns an array of root projects.
     */
    getRootProjects(executionId: number): Observable<ProjectModel[]> {
        ///return this._http.get(`${Constants.GRAPH_REST_BASE}/reports/${executionId}/${DependenciesService.DEPS_URL}`)
        //return this._http.get(`${Constants.GRAPH_REST_BASE}/graph/${executionId}/` + ProjectDependencyModel.name)

        let service = new GraphJSONToModelService();
        let url = `${Constants.GRAPH_REST_BASE}/graph/${executionId}/by-type/` + ProjectModel.name + "?depth=1";
        return this._http.get(url)
            .map((res:Response) => res.json())
            .map((data:any) => {
                console.log("Data items: ", data);///
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
