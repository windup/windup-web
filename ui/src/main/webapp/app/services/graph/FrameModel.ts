
/**
 * Things common to all Frames models on the Typescript side.
 */
export class FrameModel
{
    // Model metadata
	static discriminator: string;
	static graphPropertyMapping: { [key:string]:string; };
	static graphRelationMapping: { [key:string]:string; };

    constructor(vertexId: number){
        this.vertexId = vertexId;
    }

    // Object
    private vertexId;

    public getVertexId(): number {
        return this.vertexId;
    }
    public setVertexId(id: number) {
        this.vertexId = id;
    }

    public toString() {
        return `FrameModel<${this.constructor.discriminator}>#${this.vertexId}`;
    }
}