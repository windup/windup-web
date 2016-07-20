//import {Inject, Injectable} from '@angular/core';
//import {Headers, Http, RequestOptions, Response} from '@angular/http';
//import {Observable} from 'rxjs/Observable';

import {DiscriminatorMapping, getParentClass} from './DiscriminatorMapping';
import {FrameModel} from './FrameModel';
import {TestGraphData} from './test/TestGraphData';
import {TestGeneratorModel} from './test/models/TestGeneratorModel';

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
export class GraphJSONtoTsModelsService<T extends FrameModel>
{
    static MODE = "_mode";
    static DISCRIMINATOR = "w:winduptype";


    public getTypeScriptClassByDiscriminator(discriminator: string): typeof FrameModel {
        return DiscriminatorMapping.getModelClassByDiscriminator(discriminator);
    }


    public fromJSON(input: Object, clazz?: typeof FrameModel): T
    {
        const service_this = this;
        if (clazz === void 0){
            var disc = input[GraphJSONtoTsModelsService.DISCRIMINATOR];
            if (disc instanceof Array)
                disc = disc[0];
            if (disc === void 0)
                throw new Error(`Given object doesn't specify "${GraphJSONtoTsModelsService.DISCRIMINATOR}" and no target class given: ` + JSON.stringify(input));
            clazz = this.getTypeScriptClassByDiscriminator(disc);
        }

        if (clazz == null){
            throw new Error(`No class found for discriminator ${disc}: ` + JSON.stringify(input));
        }

        let result = new FrameModel(input["_id"]);
        //result.setVertexId(input["_id"]);
        //console.log("We have a frame now: " + result);

        //for (let name in Object.getOwnPropertyNames(input) ){
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

    public fromLink <T extends FrameModel> (link: string):  T
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
