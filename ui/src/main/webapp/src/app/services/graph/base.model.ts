import {Http} from "@angular/http";
import {GraphJSONToModelService} from "../../../app/services/graph/graph-json-to-model.service";
import {Observable} from "rxjs";

/**
 * Things common to all models on the Typescript side.
 */
export class BaseModel
{
    // Model metadata
    static discriminator: string;

    /* These two store the context of Observable fields resolution done by @GraphAdjacency. */
    http: Http;
    observableCache: Map<string, Observable<any>> = new Map<string, Observable<any>>();
    graphService: GraphJSONToModelService<BaseModel>;

    constructor(public discriminator: string[], public vertexId: number, public data:any){
    }

    public toString(): string {
        return `BaseModel<${this.discriminator}>#${this.vertexId}`;
    }
}
