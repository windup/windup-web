import {Injectable} from "@angular/core";
import {Http} from "@angular/http";
import {Observable} from "rxjs";
import {AbstractService} from "../../shared/abtract.service";
import {Constants} from "../../constants";
import {FileModel} from "../../generated/tsModels/FileModel";
import {GraphJSONToModelService} from "./graph-json-to-model.service";
import { map, catchError } from 'rxjs/operators';

@Injectable()
export class FileModelService extends AbstractService {

    constructor(private _http: Http, private _graphJsonToModelService: GraphJSONToModelService<any>) {
        super();
    }

    getFileModel(executionId: number, vertexID: number): Observable<FileModel> {
        let url = `${Constants.GRAPH_REST_BASE}/graph/${executionId}/${vertexID}?depth=1`;
        let service = this._graphJsonToModelService;

        return this._http.get(url)
            .pipe(
                map(res => res.json()),
                map(res => <FileModel>service.fromJSON(res)),
                catchError(this.handleError)
            );
    }

    getSource(executionId: number, vertexID: number): Observable<string> {
        let url = `${Constants.GRAPH_REST_BASE}/graph/filemodel/${executionId}/source/${vertexID}`;

        return this._http.get(url)
            .pipe(
                map(res => res.text()),
                catchError(this.handleError)
            );
    }
}
