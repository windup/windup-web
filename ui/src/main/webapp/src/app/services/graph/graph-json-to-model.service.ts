//import {Inject, Injectable} from '@angular/core';
//import {Headers, Http, RequestOptions, Response} from '@angular/http';
//import {Observable} from 'rxjs/Observable';

import {DiscriminatorMapping, getParentClass} from './discriminator-mapping';
import {BaseModel} from './base.model';
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
export class GraphJSONToModelService<T extends BaseModel>
{
    static MODE = "_mode";
    static DISCRIMINATOR = "w:winduptype";


    public getTypeScriptClassByDiscriminator(discriminator: string): typeof BaseModel {
        return DiscriminatorMapping.getModelClassByDiscriminator(discriminator);
    }


    public fromJSON(input: Object, clazz?: typeof BaseModel): T
    {
        let discriminator:string[] = input[GraphJSONToModelService.DISCRIMINATOR];
        clazz = this.getClass(input, clazz);
        let frameModel:BaseModel = Object.create(clazz.prototype);
        frameModel.constructor.apply(frameModel, [discriminator, input["_id"], input]);
        return <T>frameModel;
    }

    public fromLink <T extends BaseModel> (link: string):  Observable<T>
    {
        // TODO - This should store some kind of metadata to allow the vertices to be loaded lazily.
        return null;
    }

    private getClass(input: Object, clazz?: typeof BaseModel):typeof BaseModel {
        if (!clazz) {
            var disc = input[GraphJSONToModelService.DISCRIMINATOR];
            if (disc instanceof Array)
                disc = disc[0];
            if (!disc)
                throw new Error(`Given object doesn't specify "${GraphJSONToModelService.DISCRIMINATOR}" and no target class given: ` + JSON.stringify(input));
            clazz = this.getTypeScriptClassByDiscriminator(disc);
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
