//import {Inject, Injectable} from '@angular/core';
//import {Headers, Http, RequestOptions, Response} from '@angular/http';

import {DiscriminatorMapping, getParentClass} from './DiscriminatorMappingBFM';
import {BaseFrameModel as BaseFrameModel} from './BaseFrameModel';
import {Observable} from "rxjs/Observable";

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
//@Injectable()
export class GraphJSONtoTsModelsService<T extends BaseFrameModel>
{
    static MODE = "_mode";
    static DISCRIMINATOR = "w:winduptype";

    // Maps the @TypeValue strings to TS model classes.    
    private discriminatorMappingData : typeof DiscriminatorMapping;
    
    constructor (discriminatorMappingData : typeof DiscriminatorMapping){
        this.discriminatorMappingData = discriminatorMappingData;
    }


    public getTypeScriptClassByDiscriminator(discriminator: string): typeof BaseFrameModel {
        return this.discriminatorMappingData.getModelClassByDiscriminator(discriminator);
    }

    
    /**
     * Unmarshalls the JSON graph data representation into TypeScript objects.
     * Accepts a single JSON object or a JSON array, returns an object or an array, respectively.
     */
    public fromJSON (input: Object, clazz?: typeof BaseFrameModel): T | T[]
    {
        //console.log("Called fromJSON() with " + input); ///
        const service_this = this;
        
        if (Array.isArray(input)) {
            let items : T[] = [];
            for (var i = 0; i < input.length; i++) {
                let frame : T = (<T> this.fromJSON(input[i]));
                items.push((frame));
            }
            return items;
        }
        
        if (clazz === void 0){
            var disc = input[GraphJSONtoTsModelsService.DISCRIMINATOR];
            
            if (disc instanceof Array)
                disc = disc[0];
            if (disc === void 0)
                throw new Error(`Given object doesn't specify "${GraphJSONtoTsModelsService.DISCRIMINATOR}" and no target class given: ` + JSON.stringify(input));
            clazz = this.getTypeScriptClassByDiscriminator(disc);
            console.log("  Discr " + disc + " => " + clazz.name);///
        }

        if (clazz == null){
            console.log(`No class found for discriminator ${disc}. `);
            throw new Error(`No class found for discriminator ${disc}: ` + JSON.stringify(input));
        }

        //let result = new clazz(input[GraphJSONtoTsModelsService.DISCRIMINATOR], input["_id"], input);
        let result = new BaseFrameModel(input[GraphJSONtoTsModelsService.DISCRIMINATOR], input["_id"], input);
        Object.getPrototypeOf(result).constructor = clazz;
        
        //result.setVertexId(input["_id"]);
        //console.log("We have a frame now: " + result); ///

        let propNames = Object.getOwnPropertyNames(input);
        for (let i = 0; i < propNames.length; i++) {
            let name = propNames[i];
            let val = input[name];
            // Properties
            if (typeof val === 'string' || typeof val === 'number'){
                let beanPropName = clazz.graphPropertyMapping[name] || name; // Use same if not defined.
                result[beanPropName] = val;
            }
            // Adjacent - input prop name is graph edge name.
            if (typeof val === 'object'){
                let beanPropName = clazz.graphRelationMapping[name] || name; // Use same if not defined.
                let info = RelationInfo.parse(beanPropName);

                //console.log(`propName: ${name}  beanPropName: ${beanPropName}  isArray: ${isArray}`);
                let direction = val["direction"];
                let items = [];
                if (val["vertices"] instanceof Array) {
                    val["vertices"].forEach((vertex) => {
                        let item: Object;
                        let mode = vertex[GraphJSONtoTsModelsService.MODE] || "vertex";
                        if (mode == "vertex")
                            item = service_this.fromJSON(vertex);
                        else if (mode == "link")
                        {
                            let link: string = vertex["link"];
                            //item = this.fromLink(link);
                            item = service_this.fromLink(link);
                        }
                        //console.log(`item: ${item}  vertex: ${JSON.stringify(vertex)}`);
                        items.push(item);
                    });
                }
                result[info.beanPropName] = info.isArray ? items : (items[0]);
            }
        }

        return <T> result;
    }

    public fromLink<T extends BaseFrameModel>(link: string):  Observable<T>
    {
        return null;
        // TODO - This should store some kind of metadata to allow the vertices to be loaded lazily.
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
