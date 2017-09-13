import {Injectable} from "@angular/core";
import {Http} from "@angular/http";
import {Observable} from "rxjs/Observable";

import {GraphService} from "../../services/graph.service";
import {GraphJSONToModelService} from "../../services/graph/graph-json-to-model.service";
import {Cached} from "../../shared/cache.service";
import {IgnoredFileModel} from "../../generated/tsModels/IgnoredFileModel";
import {FileModel} from "../../generated/tsModels/FileModel";

@Injectable()
export class IgnoredFilesReportService extends GraphService
{
    constructor(http: Http, graphJsonToModelService: GraphJSONToModelService<any>) {
        super(http, graphJsonToModelService);
    }

    @Cached('ignoredFilesReport', null, true)
    getIgnoredFilesInfo(execID: number): Observable<IgnoredFileModel[]>
    {
        let filesObs: Observable<IgnoredFileModel[]> = this.getTypeAsArray<IgnoredFileModel>(IgnoredFileModel.discriminator, execID, {
            depth: 0,
            includeInVertices: false,
            out: "parentFile",
            //in:  "projectModelToFile"
        });

        let filesResultObservable: Observable<IgnoredFileModel[]> = filesObs.flatMap( (files: IgnoredFileModel[]) => {
            debugger;

            let resolveParentFileCallBack: (IgnoredFileModel) => Observable<IgnoredFileModel> = (file) => {
                // Resolve the parentPath
                if (!file || !file.parentFile)
                    return Observable.of(file);
                return file.parentFile.map((result: FileModel) => {
                    file.parentFile["resolved"] = result;

                    // Here I want to recursively resolve the result's parentFile.
                    let resolvedParent: Observable<FileModel> = resolveParentFileCallBack(result);
                    return file;
                });
            };

            debugger;
            // On the level 0, apply this to all files from the endpoint.
            let filesResolvedObservables: Observable<IgnoredFileModel>[] = files.map(resolveParentFileCallBack);

            // And "wait" for all to be resolved.
            let resolvedFilesObservable: Observable<IgnoredFileModel[]> = Observable.forkJoin(...filesResolvedObservables);
            return resolvedFilesObservable;
        });

        return filesResultObservable;
    }
}
