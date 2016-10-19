import {Http} from "@angular/http";
/**
 * Things common to all models on the Typescript side.
 */
export class BaseFrameModel
{
    // Model metadata
    static discriminator: string;
    http:Http;

    constructor(private discriminator:string[], public vertexId: number, public data:any){
    }

    public toString():string {
        return `BaseModel<${this.discriminator}>#${this.vertexId}`;
    }
}