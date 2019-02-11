import {Component, OnInit} from "@angular/core";
import {Constants} from "../constants";
import {Http} from "@angular/http";
import { map } from 'rxjs/operators';

@Component({
    templateUrl: './about.component.html'
})
export class AboutPageComponent implements OnInit {

    private WINDUP_CORE_VERSION_URL: string = "/windup/coreVersion";

    versionWindupWeb: string = Constants.WINDUP_WEB_VERSION;
    scmRevisionWindupWeb: string = Constants.WINDUP_WEB_SCM_REVISION;
    versionWindupCore: string = "(loading)";
    scmRevisionWindupCore: string = "(loading)";

    constructor (private _http: Http) {
    }

    ngOnInit(): any {
        this._http.get(Constants.REST_BASE + this.WINDUP_CORE_VERSION_URL)
            .pipe(
                map(res => res.json())
            )
            .subscribe(versionAndRevision =>
            {
                this.versionWindupCore = versionAndRevision.version;
                this.scmRevisionWindupCore = versionAndRevision.scmRevision;
            });
    }
}
