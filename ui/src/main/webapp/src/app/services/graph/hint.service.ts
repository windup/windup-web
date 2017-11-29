import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {AbstractService} from "../../shared/abtract.service";
import {Constants} from "../../constants";
import {FileModel} from "../../generated/tsModels/FileModel";
import {GraphJSONToModelService} from "./graph-json-to-model.service";
import {ClassificationModel} from "../../generated/tsModels/ClassificationModel";
import {InlineHintModel} from "../../generated/tsModels/InlineHintModel";

@Injectable()
export class HintService extends AbstractService {

    constructor(private _http: HttpClient, private _graphJsonToModelService: GraphJSONToModelService<any>) {
        super();
    }

    getHintsForFile(executionId: number, fileModelID: number): Observable<InlineHintModel[]> {
        let url = `${Constants.GRAPH_REST_BASE}/graph/hints/${executionId}/by-file/${fileModelID}`;
        let service = this._graphJsonToModelService;

        return this._http.get(url)
            .map((res: InlineHintModel[]) => res.map((json) => service.fromJSON(json, InlineHintModel)));
    }
}
