import {Http} from "@angular/http";
import {DiscriminatorMapping} from "./discriminator-mapping";
import {GraphJSONToModelService} from "../../../app/services/graph/graph-json-to-model.service";

/**
 * Things common to all models on the Typescript side.
 */
export class BaseModel
{
    // Model metadata
    static discriminator: string;

    /* These two store the context of Observable fields resolution done by @GraphAdjacency. */
    http:Http;
    graphService: GraphJSONToModelService<BaseModel>;

    constructor(private discriminator:string[], public vertexId: number, public data:any){
    }

    public toString():string {
        return `BaseModel<${this.discriminator}>#${this.vertexId}`;
    }
}