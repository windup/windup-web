import {Http} from "@angular/http";
/**
 * Things common to all models on the Typescript side.
 */
export class BaseModel
{
    // Model metadata
	static discriminator: string;
    http:Http;

    constructor(private discriminator:string[], public vertexId: number, public data:any){
    }

    public toString():string {
        return `FrameModel<${this.discriminator}>#${this.vertexId}`;
    }
}