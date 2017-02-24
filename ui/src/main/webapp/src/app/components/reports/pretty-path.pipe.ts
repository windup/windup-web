import {Pipe, PipeTransform} from "@angular/core";
import { Http } from "@angular/http";

import { PersistedTraversalChildFileModel } from "../../generated/tsModels/PersistedTraversalChildFileModel";
import { GraphJSONToModelService } from "../../services/graph/graph-json-to-model.service";
import {JavaSourceFileModel} from "../../generated/tsModels/JavaSourceFileModel";

/**
 * Used to convert from a PersistedTraversalChildFileModel to a pretty path. This will be the relative path or
 * the classname in the case of a Java file.
 *
 */
@Pipe({name: 'prettyPath'})
export class PrettyPathPipe implements PipeTransform {
    private prettyPath: string;

    constructor(private _http: Http, private _graphJsonToModelService: GraphJSONToModelService<any>) {
    }

    transform(file: PersistedTraversalChildFileModel):string {
        this.prettyPath = file.filePath;
        if (!file.filePath)
            console.log("NO file path? " + file);

        if (file.filePath.toLowerCase().endsWith(".java")) {
            file.fileModel.subscribe(
                fileModel => {
                    let javaSourceModel:JavaSourceFileModel = <JavaSourceFileModel>this._graphJsonToModelService
                        .translateType(fileModel, this._http, JavaSourceFileModel);
                    if (!javaSourceModel.packageName)
                        return;

                    let packageName = javaSourceModel.packageName;
                    let filename = fileModel.fileName.substring(0, fileModel.fileName.length - 5);
                    this.prettyPath = packageName + "." + filename;
                });
        }
        return this.prettyPath;
    }
}
