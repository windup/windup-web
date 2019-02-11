import {GraphService} from "../../services/graph.service";
import {Injectable} from "@angular/core";
import {Http} from "@angular/http";
import {GraphJSONToModelService} from "../../services/graph/graph-json-to-model.service";
import {Observable} from 'rxjs';
import {HardcodedIPLocationModel} from "../../generated/tsModels/HardcodedIPLocationModel";
import {ReportFilter} from "../../generated/windup-services";
import {Constants} from "../../constants";
import {FileLocationModel} from "../../generated/tsModels/FileLocationModel";
import {JavaClassModel} from "../../generated/tsModels/JavaClassModel";
import {JavaClassFileModel} from "../../generated/tsModels/JavaClassFileModel";
import {FileModel} from "../../generated/tsModels/FileModel";

@Injectable()
export class HardcodedIPService extends GraphService {
    private static HARDCODED_IP_URL = `${Constants.GRAPH_REST_BASE}/reports/{execID}/hardcodedIP`;

    constructor(http: Http, graphJsonToModelService: GraphJSONToModelService<any>) {
        super(http, graphJsonToModelService);
    }

    getHardcodedIPModels(execID: number, filter?: ReportFilter): Observable<HardcodedIPDTO[]> {
        let url = HardcodedIPService.HARDCODED_IP_URL
            .replace('{execID}', execID.toString());

        let serializedFilter = this.serializeFilter(filter);

        return this._http.post(url, serializedFilter, this.JSON_OPTIONS)
            .map(res => res.json())
            .map(data => {
                if (!Array.isArray(data)) {
                    throw new Error("No items returned");
                }

                return <HardcodedIPLocationModel[]>this._graphJsonToModelService.fromJSONarray(data, HardcodedIPLocationModel);
            })
            // split the array into individual DTO items
            .flatMap(array => {
                return array.map(item => {
                    let dto = <HardcodedIPDTO>{};
                    dto.ipModel = item;

                    // The location model itself is also of type FileLocationModel, so use that
                    let locationInfo = <FileLocationModel>this._graphJsonToModelService.fromJSON(item.data, FileLocationModel);
                    dto.row = locationInfo.lineNumber;
                    dto.column = locationInfo.columnNumber;
                    dto.ipAddress = locationInfo.sourceSnippit;
                    return dto;
                });
            })
            // Get the file information
            .flatMap(dto => {
                let locationInfo = <FileLocationModel>this._graphJsonToModelService.fromJSON(dto.ipModel.data, FileLocationModel);
                return locationInfo.file.map(file => {
                    dto.fileModel = file;
                    dto.filename = file.fileName;
                    dto.sourceVertexID = file.vertexId;
                    return dto;
                });
            })
            // Get the Java Class information (if available)
            .flatMap(dto => {
                let javaClassFile = <JavaClassFileModel>this._graphJsonToModelService.fromJSON(dto.fileModel.data, JavaClassFileModel);
                if (javaClassFile.javaClass == null) {
                    dto.prettyName = this.getPrettyName(dto.ipModel, null);
                    return Observable.of(dto);
                }

                return javaClassFile.javaClass.map(javaClass => {
                    dto.javaClassModel = javaClass;

                    if (javaClass != null)
                        dto.javaClassName = javaClass.qualifiedName;

                    dto.prettyName = this.getPrettyName(dto.ipModel, javaClass);
                    return dto;
                })
            })
            .reduce((previousValue, currentValue, currentIndex) => {
                previousValue.push(currentValue);
                return previousValue;
            }, []);
    }

    private getPrettyName(ipModel:HardcodedIPLocationModel,  javaClass:JavaClassModel):string {
        if (javaClass != null && javaClass.qualifiedName != null)
            return javaClass.qualifiedName;
        else
            return ipModel.data["prettyPathWithinProject"]; // This is set by the service to contain the path within the project
    }
}

export interface HardcodedIPDTO {
    ipModel:HardcodedIPLocationModel;
    fileModel:FileModel;
    javaClassModel:JavaClassModel;

    sourceVertexID:number;
    prettyName:string;
    filename:string;
    javaClassName:string;
    row:number;
    column:number;
    ipAddress:string;
}