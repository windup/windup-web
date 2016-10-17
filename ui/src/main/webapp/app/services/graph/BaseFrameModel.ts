/**
 * Things common to all Frames models on the Typescript side.
 */
export class BaseFrameModel
{
    // Model metadata
    static discriminator: string;
    static graphPropertyMapping: { [key:string]:string; };
    static graphRelationMapping: { [key:string]:string; };

    
    constructor(
        public vertexId: number,
        private discriminator: string[],
        public data: any
    ){ }

    public getVertexId(): number {
        return this.vertexId;
    }
    public setVertexId(id: number) {
        this.vertexId = id;
    }

    public toString() {
        var classOfThis = Object.getPrototypeOf(this).constructor;
        //return `class: ${classOfThis.name }`;
        return `BaseFrameModel<${classOfThis.name}>#${this.vertexId}`;
    }
}