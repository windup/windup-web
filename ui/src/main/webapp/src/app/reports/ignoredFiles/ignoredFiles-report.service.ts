import {Injectable} from "@angular/core";
import {Http} from "@angular/http";
import {Observable} from "rxjs/Observable";

import {GraphService} from "../../services/graph.service";
import {GraphJSONToModelService} from "../../services/graph/graph-json-to-model.service";
import {Cached} from "../../shared/cache.service";
import {IgnoredFileModel} from "../../generated/tsModels/IgnoredFileModel";

@Injectable()
export class IgnoredFilesReportService extends GraphService
{
    constructor(http: Http, graphJsonToModelService: GraphJSONToModelService<any>) {
        super(http, graphJsonToModelService);
    }

    @Cached('ignoredFilesReport', null, true)
    getIgnoredFilesInfo(execID: number): Observable<IgnoredFileModel[]>
    {
        return this.getTypeAsArray<IgnoredFileModel>(IgnoredFileModel.discriminator, execID, {
            depth: 2,
            includeInVertices: false
        });
    }
}
