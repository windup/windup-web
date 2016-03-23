import {OpaqueToken} from 'angular2/core';

class WindupOpaqueToken extends OpaqueToken {
    constructor(private _path:string) {
        super(_path);
    }

    toString():string {
        return this._path;
    }
}

export let REST_BASE = new WindupOpaqueToken("/windup-web-services/rest");
export let STATIC_REPORTS_BASE = new WindupOpaqueToken("/windup-web-services/staticReport");
