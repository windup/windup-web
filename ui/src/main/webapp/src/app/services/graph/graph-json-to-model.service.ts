import {Injectable} from "@angular/core";
import {Http}       from "@angular/http";

import {DiscriminatorMapping}     from './discriminator-mapping';
import {BaseModel} from './base.model';

/**
 * Converts the JSON Graph representation to TypeScript models.
 *
    a = {
        "_id": 256,
        "_mode": "vertex",
        "w:winduptype": ["BaseWindupConfiguration"],
        "fetchRemoteResources": false,
        "csv": false,
        "keepWorkDirs": true,
        "edgeLabel": {
            "direction": "out", //|'in'|'both',
            "vertices": [
                { "_mode": "vertex", ... }, // Normal vertex
                { "_mode": "link", "link": "http://localhost/rest/graph/by-id/{id}" } // A link to a vertex
            ]
        },
        "otherEdgeLabel": { }
    }
 */
@Injectable()
export class GraphJSONToModelService<T extends BaseModel>
{
    static MODE = "_mode";
    static DISCRIMINATOR = "w:winduptype";

    /**
     * @param mapping  Maps the @TypeValue strings to TS model classes.
     */
    constructor(private mapping: typeof DiscriminatorMapping = DiscriminatorMapping){ }

    public getTypeScriptClassByDiscriminator(discriminator: string): typeof BaseModel {
        return this.mapping.getModelClassByDiscriminator(discriminator);
    }

    /**
     * Converts a type that has been serialized as one type into a different type.
     *
     * This can be useful in cases where a single type implements multiple interfaces.
     */
    public translateType(input:BaseModel, http:Http, clazz: typeof BaseModel): T {
        return this.fromJSON(input.data, http, clazz);
    }

    /**
     * Unmarshalls the JSON graph data representation into TypeScript objects.
     * Accepts a single JSON object or a JSON array, returns an object or an array, respectively.
     */
    public fromJSON(input: Object, http: Http, clazz?: typeof BaseModel): T
    {
        if (!http) throw new Error("Http service must be passed.");
        if (Array.isArray(input))
            //return this.fromJSONarray(input, http, clazz);
            throw new TypeError("For arrays of models, use fromJSONarray(...).");

        let discriminator:string[] = input[GraphJSONToModelService.DISCRIMINATOR];
        if (!clazz) {
            clazz = this.getModelClassForJsonObject(input, clazz);
        }
        let frameModel:BaseModel = Object.create(clazz.prototype);
        frameModel.constructor.apply(frameModel, [discriminator, input["_id"], input]);
        frameModel.http = http;
        // Store this service to use when resolving Observable's in fields.
        // TODO: Http could be in the service.
        frameModel.graphService = this;
        return <T>frameModel;
    }

    public fromJSONarray(input: any[], http: Http, clazz?: typeof BaseModel): T[]
    {
        if (!http) throw new Error("Http service must be passed.");

        return input.map((item) => {
            let obj = this.fromJSON(item, http, clazz);
            if (obj == null || ! (typeof obj === "object") /*|| ! (obj instanceof clazz)*/)
                console.warn(`Unmarshalling: ${obj} not instance of ${clazz}`);
            return obj;
        });
    }


    /**
     * Returns a model class that the given JSON object should be unmarshalled to.
     * Tries to use the most specialized class.
     */
    private getModelClassForJsonObject(input: Object, clazz?: typeof BaseModel): typeof BaseModel
    {
        if (!clazz) {
            var disc = input[GraphJSONToModelService.DISCRIMINATOR];
            if (!disc)
                throw new Error(`Given object doesn't specify "${GraphJSONToModelService.DISCRIMINATOR}" and no target class given, vertex id: ` + input["_id"]);
            if (Array.isArray(disc)) {
                //disc = disc[0];
                let classes: Array<typeof BaseModel> =
                    (<Array<string>>disc).map(disc => clazz = this.getTypeScriptClassByDiscriminator(disc));
                clazz = classes[0];
            }
            else {
                clazz = this.getTypeScriptClassByDiscriminator(disc);
            }
        }

        if (clazz == null) {
            throw new Error(`No class found for discriminator ${disc}: ` + JSON.stringify(input));
        }

        return clazz;
    }
}


export class RelationInfo {
    beanPropName: string;
    isArray: boolean = false;
    typeDiscriminator: string = null;

    /**
     * Parses the string in these forms and meanings:
     * relName|[ModelClass - 1:N relation named relName, expected type is ModelClass).
     * relName[ModelClass - same as above.
     * relName[           - unspecified expected type.
     * relName|ModelClass - relation named relName, 1:1, expected type ModelClass.
     * relName|           - unspecified expected type.
     * relName            - same as above.
     *
     * The purpose of this weird string is to reduce the complexity of the model class generating.
     */
    static parse(str: string): RelationInfo {
        let info = new RelationInfo();

        str = str.replace("|[", "[").replace("[", "|[");
        let parts = str.split("|", 2);
        info.beanPropName = parts[0];
        if (parts.length == 1)
            return info;

        info.isArray = parts[1].startsWith("[");
        info.typeDiscriminator = parts[1].substring(info.isArray ? 1 : 0);
        if (info.typeDiscriminator == "")
            info.typeDiscriminator = null;
        return info;
    }
}



type AnyClass = { new (): any };

/**
 * Sorts given classes  by the number of extends from Object.
 * Usage:
 *
       class A { }
       class B extends A { }
       class C extends B { }
       class D extends B { }
       let classes : Object[] = sortClassesBySpeciality([A, B, C, D]);
 * Will return [D,C,B,A] and give a warning about D and C being at the same level.
 * This could be a bit smarter and actually build the inheritance tree...
 */
export function sortClassesBySpeciality(classes: Array<AnyClass>) : Array<AnyClass>
{
    let classesLevels: AnyClass[][] = [];
    for (let i = 0; i < classes.length; i++){
        console.log("Next class");
        let clazz = classes[i], parent;
        let proto = Object.getPrototypeOf(new (<typeof Object>clazz)()); // The only way to get to the actual function.
        let protoOrig = proto;
        for (var depth = 0; ; depth++){
            //console.log(`  Proto: ${proto}`);
            console.log(`  Depth: ${depth} Proto: ${proto.constructor.name}`);
            parent = Object.getPrototypeOf(proto);
            if (!parent) {
                console.log("No parent, break;")
                break;
            }
            proto = parent;
        }

        if (classesLevels[depth] === void 0)
            classesLevels[depth] = [];
        else
        {
            console.warn("Classes at the same level of inheritance, means they are from different inheritance branches: "
                //+ `proto: ${proto}\n`
                //+ `proto.constructor: ${proto.constructor}\n`
                //+ `proto.constructor.name: ${proto.constructor.name}\n`);
                + `proto.constructor.name: ${protoOrig.constructor.name} vs. ${classesLevels[depth].join()}\n`);
        }
        classesLevels[depth].push(clazz);
    }
    let sortedClasses: Array<AnyClass> = [];
    classesLevels.forEach( (level)=>level.forEach( (cls)=>sortedClasses.push(cls) ) );
    return sortedClasses;
}

