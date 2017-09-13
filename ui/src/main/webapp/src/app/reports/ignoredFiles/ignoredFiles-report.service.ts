import {Injectable} from "@angular/core";
import {Http} from "@angular/http";
import {Observable} from "rxjs/Observable";

import {GraphService} from "../../services/graph.service";
import {GraphJSONToModelService} from "../../services/graph/graph-json-to-model.service";
import {Cached} from "../../shared/cache.service";
import {IgnoredFileModel} from "../../generated/tsModels/IgnoredFileModel";
import {FileModel} from "../../generated/tsModels/FileModel";
import {ReportFilter} from "../../generated/windup-services";

@Injectable()
export class IgnoredFilesReportService extends GraphService
{
    constructor(http: Http, graphJsonToModelService: GraphJSONToModelService<any>) {
        super(http, graphJsonToModelService);
    }

    @Cached('ignoredFilesReport', null, true)
    getIgnoredFilesInfo(execID: number, reportFilter: ReportFilter): Observable<IgnoredFileModel[]>
    {
        let filesObs: Observable<IgnoredFileModel[]> = this.getTypeAsArray<IgnoredFileModel>(IgnoredFileModel.discriminator, execID, {
            depth: 0,
            includeInVertices: false,
            out: "parentFile",
            //in:  "projectModelToFile"
        });
        return filesObs;

        /*let filesResultObservable: Observable<IgnoredFileModel[]> = filesObs.flatMap( (files: IgnoredFileModel[]) => {

            let resolveParentFileCallBack: (IgnoredFileModel) => Observable<IgnoredFileModel> = (file) => {
                // Resolve the parentPath
                if (!file || !file.parentFile)
                    return Observable.of(file);
                return file.parentFile.map((result: FileModel) => {
                    file.parentFile["resolved"] = result;
                    //if (result instanceof ApplicationArchiveModel) // The type tree is not complete (single inheritance) and we stopped working on a solution.
                    if (result == null) // Should be enough - apps are the top. Although this means this file is the app.
                        null; // We could distribute this file to the files met above.

                    // Here I want to recursively resolve the result's parentFile.
                    let resolvedParent: Observable<FileModel> = resolveParentFileCallBack(result);
                    return file;
                });
            };

            // On the level 0, apply this to all files from the endpoint.
            let filesResolvedObservables: Observable<IgnoredFileModel>[] = files.map(resolveParentFileCallBack);

            // Resolve all and return as an Observable of array of results.
            let resolvedFilesObservable: Observable<IgnoredFileModel[]> = Observable.forkJoin(...filesResolvedObservables);

            return resolvedFilesObservable;
        });

        return filesResultObservable;
        */
    }
}
